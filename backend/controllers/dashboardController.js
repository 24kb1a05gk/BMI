const db = require('../config/db');
const { calculateBMIData } = require('./profileController');

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// GET /api/dashboard
async function getDashboardData(req, res, next) {
  try {
    const userId = req.user.id;

    // 1. Fetch user base info
    const [users] = await db.query('SELECT id, full_name, email, created_at FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    const user = users[0];

    // 2. Fetch user profile
    const [profiles] = await db.query('SELECT * FROM user_profiles WHERE user_id = ?', [userId]);
    const profile = profiles.length > 0 ? profiles[0] : null;

    // 3. Fetch primary food preference
    const [prefs] = await db.query('SELECT preference_type FROM food_preferences WHERE user_id = ?', [userId]);
    const foodPreference = prefs.length > 0 ? prefs[0].preference_type : 'vegetarian';

    // 4. Fetch 7-day schedule
    const [weeklyRows] = await db.query('SELECT day_of_week, food_type FROM weekly_preferences WHERE user_id = ?', [userId]);
    const weeklySchedule = {
      Monday: 'vegetarian',
      Tuesday: 'vegetarian',
      Wednesday: 'vegetarian',
      Thursday: 'vegetarian',
      Friday: 'vegetarian',
      Saturday: 'vegetarian',
      Sunday: 'vegetarian'
    };

    if (foodPreference === 'vegetarian') {
      // All days are vegetarian
    } else {
      // Non-veg defaults
      Object.keys(weeklySchedule).forEach(day => {
        weeklySchedule[day] = 'non_vegetarian';
      });
      weeklyRows.forEach(row => {
        weeklySchedule[row.day_of_week] = row.food_type;
      });
    }

    // 5. Today's day and category
    const todayIndex = new Date().getDay();
    const todayName = DAYS[todayIndex];
    const todayPreference = foodPreference === 'vegetarian' ? 'vegetarian' : weeklySchedule[todayName] || 'non_vegetarian';

    // 6. BMI Details & Target Nutrition Estimation
    let bmiData = null;
    let nutritionTarget = {
      dailyCalories: 2000,
      protein: 75,
      carbs: 250,
      fats: 60
    };

    if (profile) {
      bmiData = calculateBMIData(profile.height, profile.weight);

      // Estimate BMR & daily caloric needs using Mifflin-St Jeor equation approximation
      // BMR ≈ 10 * weight (kg) + 6.25 * height (cm) - 5 * age + (gender === 'male' ? 5 : -161)
      let bmr = (10 * profile.weight) + (6.25 * profile.height) - (5 * profile.age);
      bmr += (profile.gender && profile.gender.toLowerCase() === 'female') ? -161 : 5;
      let tdee = Math.round(bmr * 1.35); // Moderate activity multiplier

      if (profile.health_goal === 'weight_loss') {
        nutritionTarget.dailyCalories = Math.max(1400, tdee - 450);
        nutritionTarget.protein = Math.round(profile.weight * 1.6); // 1.6g/kg
      } else if (profile.health_goal === 'weight_gain') {
        nutritionTarget.dailyCalories = tdee + 450;
        nutritionTarget.protein = Math.round(profile.weight * 1.8);
      } else {
        nutritionTarget.dailyCalories = tdee;
        nutritionTarget.protein = Math.round(profile.weight * 1.2);
      }

      nutritionTarget.fats = Math.round((nutritionTarget.dailyCalories * 0.25) / 9);
      nutritionTarget.carbs = Math.round((nutritionTarget.dailyCalories - (nutritionTarget.protein * 4) - (nutritionTarget.fats * 9)) / 4);
    }

    // 7. Today's tailored meal suggestions (1 breakfast, 1 lunch, 1 dinner)
    const mealTypes = ['breakfast', 'lunch', 'dinner'];
    const todayMeals = {};

    for (const type of mealTypes) {
      const [meals] = await db.query(
        `SELECT m.*, CASE WHEN sm.id IS NOT NULL THEN 1 ELSE 0 END AS is_saved
         FROM meals m
         LEFT JOIN saved_meals sm ON sm.meal_id = m.id AND sm.user_id = ?
         WHERE m.meal_type = ? AND m.food_category = ?
         ORDER BY ${profile?.health_goal === 'weight_loss' ? 'm.calories ASC' : profile?.health_goal === 'weight_gain' ? 'm.calories DESC' : 'm.id ASC'}
         LIMIT 1`,
        [userId, type, todayPreference]
      );

      if (meals.length > 0) {
        todayMeals[type] = { ...meals[0], is_saved: Boolean(meals[0].is_saved) };
      } else {
        // Fallback if needed
        const [fallback] = await db.query(
          `SELECT m.*, CASE WHEN sm.id IS NOT NULL THEN 1 ELSE 0 END AS is_saved
           FROM meals m
           LEFT JOIN saved_meals sm ON sm.meal_id = m.id AND sm.user_id = ?
           WHERE m.meal_type = ? AND m.food_category = 'vegetarian'
           LIMIT 1`,
          [userId, type]
        );
        todayMeals[type] = fallback.length > 0 ? { ...fallback[0], is_saved: Boolean(fallback[0].is_saved) } : null;
      }
    }

    // 8. Recently saved meals (last 4)
    const [savedMeals] = await db.query(
      `SELECT m.*, sm.saved_at, 1 AS is_saved
       FROM saved_meals sm
       JOIN meals m ON m.id = sm.meal_id
       WHERE sm.user_id = ?
       ORDER BY sm.saved_at DESC
       LIMIT 4`,
      [userId]
    );

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        member_since: user.created_at
      },
      hasProfile: Boolean(profile),
      profile: profile ? { ...profile, ...bmiData } : null,
      foodPreference,
      today: {
        day: todayName,
        preference: todayPreference,
        dateFormatted: new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      },
      todayMeals,
      weeklySchedule,
      nutritionTarget,
      recentSavedMeals: savedMeals.map(m => ({ ...m, is_saved: true }))
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDashboardData
};
