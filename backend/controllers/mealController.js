const db = require('../config/db');

// GET /api/meals/suggestions
// Smart Recommendation Engine
async function getMealSuggestions(req, res, next) {
  try {
    const userId = req.user.id;
    let { day, meal_type } = req.query;

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDayName = daysOfWeek[new Date().getDay()];
    const selectedDay = day || currentDayName;

    const validMealTypes = ['breakfast', 'lunch', 'dinner'];
    const selectedMealType = validMealTypes.includes(meal_type?.toLowerCase())
      ? meal_type.toLowerCase()
      : 'breakfast';

    // 1. Fetch User Profile
    const [profiles] = await db.query(
      'SELECT age, gender, height, weight, bmi, health_goal FROM user_profiles WHERE user_id = ?',
      [userId]
    );

    const userProfile = profiles.length > 0 ? profiles[0] : {
      bmi: 22.0,
      health_goal: 'maintain_weight'
    };

    // 2. Fetch User Food Preference
    const [mainPrefs] = await db.query(
      'SELECT preference_type FROM food_preferences WHERE user_id = ?',
      [userId]
    );
    const mainPref = mainPrefs.length > 0 ? mainPrefs[0].preference_type : 'vegetarian';

    // 3. Determine Food Category for the Selected Day
    let targetCategory = 'vegetarian';

    if (mainPref === 'vegetarian') {
      // Vegetarian users strictly receive vegetarian meals ONLY
      targetCategory = 'vegetarian';
    } else {
      // Non-veg users: check weekly_preferences for the selected day
      const [dayPrefs] = await db.query(
        'SELECT food_type FROM weekly_preferences WHERE user_id = ? AND day_of_week = ?',
        [userId, selectedDay]
      );

      if (dayPrefs.length > 0) {
        targetCategory = dayPrefs[0].food_type;
      } else {
        targetCategory = 'non_vegetarian';
      }
    }

    // 4. Construct SQL Query incorporating Health Goal & BMI
    let queryParams = [selectedMealType, targetCategory, userId];
    let whereClauses = ['m.meal_type = ?', 'm.food_category = ?'];
    let orderClause = 'ORDER BY m.id ASC';

    if (userProfile.health_goal === 'weight_loss' || userProfile.bmi >= 25.0) {
      // Prefer lower calories, high protein
      orderClause = 'ORDER BY m.calories ASC, m.protein DESC';
    } else if (userProfile.health_goal === 'weight_gain' || userProfile.bmi < 18.5) {
      // Prefer calorie dense, high protein
      orderClause = 'ORDER BY m.calories DESC, m.protein DESC';
    } else {
      // Maintain: balanced
      orderClause = 'ORDER BY ABS(m.calories - 380) ASC, m.protein DESC';
    }

    let sql = `
      SELECT 
        m.*,
        CASE WHEN sm.id IS NOT NULL THEN 1 ELSE 0 END AS is_saved
      FROM meals m
      LEFT JOIN saved_meals sm ON sm.meal_id = m.id AND sm.user_id = ?
      WHERE ${whereClauses.join(' AND ')}
      ${orderClause}
    `;

    // Swap parameters for SELECT with LEFT JOIN
    const execParams = [userId, selectedMealType, targetCategory];
    let [meals] = await db.query(sql, execParams);

    // If fewer than 3 items found for targetCategory, fallback to any matching meal_type
    // Note: if user is vegetarian, NEVER fallback to non-vegetarian!
    if (meals.length < 3 && mainPref === 'non_vegetarian' && targetCategory === 'non_vegetarian') {
      const [fallback] = await db.query(
        `SELECT m.*, CASE WHEN sm.id IS NOT NULL THEN 1 ELSE 0 END AS is_saved
         FROM meals m
         LEFT JOIN saved_meals sm ON sm.meal_id = m.id AND sm.user_id = ?
         WHERE m.meal_type = ?
         ${orderClause}
         LIMIT 6`,
        [userId, selectedMealType]
      );
      meals = fallback;
    }

    return res.status(200).json({
      success: true,
      query: {
        day: selectedDay,
        meal_type: selectedMealType,
        target_category: targetCategory,
        health_goal: userProfile.health_goal,
        bmi: userProfile.bmi
      },
      count: meals.length,
      meals: meals.map(m => ({ ...m, is_saved: Boolean(m.is_saved) }))
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/meals (Explore & filter all meals)
async function getAllMeals(req, res, next) {
  try {
    const userId = req.user.id;
    const { meal_type, food_category, search } = req.query;

    // Check user preference
    const [mainPrefs] = await db.query(
      'SELECT preference_type FROM food_preferences WHERE user_id = ?',
      [userId]
    );
    const mainPref = mainPrefs.length > 0 ? mainPrefs[0].preference_type : 'vegetarian';

    const conditions = [];
    const params = [userId];

    // Vegetarian users NEVER see non-vegetarian meals anywhere
    if (mainPref === 'vegetarian') {
      conditions.push("m.food_category = 'vegetarian'");
    } else if (food_category && ['vegetarian', 'non_vegetarian'].includes(food_category)) {
      conditions.push('m.food_category = ?');
      params.push(food_category);
    }

    if (meal_type && ['breakfast', 'lunch', 'dinner'].includes(meal_type.toLowerCase())) {
      conditions.push('m.meal_type = ?');
      params.push(meal_type.toLowerCase());
    }

    if (search && search.trim() !== '') {
      conditions.push('(m.meal_name LIKE ? OR m.ingredients LIKE ? OR m.benefits LIKE ?)');
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    const whereSql = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const sql = `
      SELECT 
        m.*,
        CASE WHEN sm.id IS NOT NULL THEN 1 ELSE 0 END AS is_saved
      FROM meals m
      LEFT JOIN saved_meals sm ON sm.meal_id = m.id AND sm.user_id = ?
      ${whereSql}
      ORDER BY m.id ASC
    `;

    const [meals] = await db.query(sql, params);

    return res.status(200).json({
      success: true,
      count: meals.length,
      meals: meals.map(m => ({ ...m, is_saved: Boolean(m.is_saved) }))
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/meals/:id
async function getMealById(req, res, next) {
  try {
    const userId = req.user.id;
    const mealId = parseInt(req.params.id, 10);

    const [meals] = await db.query(
      `SELECT m.*, CASE WHEN sm.id IS NOT NULL THEN 1 ELSE 0 END AS is_saved
       FROM meals m
       LEFT JOIN saved_meals sm ON sm.meal_id = m.id AND sm.user_id = ?
       WHERE m.id = ?`,
      [userId, mealId]
    );

    if (meals.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found.'
      });
    }

    const meal = meals[0];

    // Enforce veg constraint
    const [mainPrefs] = await db.query(
      'SELECT preference_type FROM food_preferences WHERE user_id = ?',
      [userId]
    );
    if (mainPrefs.length > 0 && mainPrefs[0].preference_type === 'vegetarian' && meal.food_category !== 'vegetarian') {
      return res.status(403).json({
        success: false,
        message: 'Non-vegetarian meals are not accessible with a Vegetarian preference profile.'
      });
    }

    return res.status(200).json({
      success: true,
      meal: { ...meal, is_saved: Boolean(meal.is_saved) }
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/meals/save (Toggle or Save meal)
async function saveMeal(req, res, next) {
  try {
    const userId = req.user.id;
    const { meal_id } = req.body;

    if (!meal_id) {
      return res.status(400).json({
        success: false,
        message: 'meal_id is required.'
      });
    }

    // Verify meal exists
    const [meals] = await db.query('SELECT id, meal_name, food_category FROM meals WHERE id = ?', [meal_id]);
    if (meals.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Meal does not exist.'
      });
    }

    // Verify user is not veg saving a non-veg meal
    const [mainPrefs] = await db.query(
      'SELECT preference_type FROM food_preferences WHERE user_id = ?',
      [userId]
    );
    if (mainPrefs.length > 0 && mainPrefs[0].preference_type === 'vegetarian' && meals[0].food_category !== 'vegetarian') {
      return res.status(400).json({
        success: false,
        message: 'Cannot save a non-vegetarian meal for a vegetarian account.'
      });
    }

    // Check if already saved
    const [existing] = await db.query(
      'SELECT id FROM saved_meals WHERE user_id = ? AND meal_id = ?',
      [userId, meal_id]
    );

    if (existing.length > 0) {
      // Remove it (toggle behavior)
      await db.query(
        'DELETE FROM saved_meals WHERE user_id = ? AND meal_id = ?',
        [userId, meal_id]
      );
      return res.status(200).json({
        success: true,
        message: `Removed "${meals[0].meal_name}" from saved meals.`,
        is_saved: false
      });
    }

    // Save
    await db.query(
      'INSERT INTO saved_meals (user_id, meal_id) VALUES (?, ?)',
      [userId, meal_id]
    );

    return res.status(201).json({
      success: true,
      message: `"${meals[0].meal_name}" saved to your collection!`,
      is_saved: true
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/meals/saved
async function getSavedMeals(req, res, next) {
  try {
    const userId = req.user.id;

    const sql = `
      SELECT 
        m.*,
        sm.saved_at,
        1 AS is_saved
      FROM saved_meals sm
      JOIN meals m ON m.id = sm.meal_id
      WHERE sm.user_id = ?
      ORDER BY sm.saved_at DESC
    `;

    const [saved] = await db.query(sql, [userId]);

    return res.status(200).json({
      success: true,
      count: saved.length,
      meals: saved.map(m => ({ ...m, is_saved: true }))
    });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/meals/saved/:mealId
async function deleteSavedMeal(req, res, next) {
  try {
    const userId = req.user.id;
    const mealId = parseInt(req.params.mealId, 10);

    const [result] = await db.query(
      'DELETE FROM saved_meals WHERE user_id = ? AND meal_id = ?',
      [userId, mealId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Saved meal not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Meal removed from your saved list.'
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getMealSuggestions,
  getAllMeals,
  getMealById,
  saveMeal,
  getSavedMeals,
  deleteSavedMeal
};
