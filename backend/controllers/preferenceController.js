const db = require('../config/db');

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// POST /api/preferences (Sets primary food preference)
async function setFoodPreference(req, res, next) {
  try {
    const userId = req.user.id;
    const { preference_type } = req.body;

    if (!preference_type || !['vegetarian', 'non_vegetarian'].includes(preference_type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid preference type. Must be "vegetarian" or "non_vegetarian".'
      });
    }

    // Upsert into food_preferences
    await db.query(
      `INSERT INTO food_preferences (user_id, preference_type)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE preference_type = VALUES(preference_type)`,
      [userId, preference_type]
    );

    // If switched to vegetarian, automatically update all weekly schedule days to vegetarian
    if (preference_type === 'vegetarian') {
      for (const day of DAYS_OF_WEEK) {
        await db.query(
          `INSERT INTO weekly_preferences (user_id, day_of_week, food_type)
           VALUES (?, ?, 'vegetarian')
           ON DUPLICATE KEY UPDATE food_type = 'vegetarian'`,
          [userId, day]
        );
      }
    }

    return res.status(200).json({
      success: true,
      message: `Food preference updated to ${preference_type}.`,
      preference_type
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/preferences (Returns main preference and full 7-day schedule)
async function getPreferences(req, res, next) {
  try {
    const userId = req.user.id;

    const [mainPrefs] = await db.query(
      'SELECT preference_type FROM food_preferences WHERE user_id = ?',
      [userId]
    );

    const preferenceType = mainPrefs.length > 0 ? mainPrefs[0].preference_type : 'vegetarian';

    const [weeklyRows] = await db.query(
      'SELECT day_of_week, food_type FROM weekly_preferences WHERE user_id = ?',
      [userId]
    );

    // Map rows into a clean 7-day dictionary
    const schedule = {};
    DAYS_OF_WEEK.forEach(day => {
      // Default to vegetarian if main is vegetarian, else default to non_vegetarian
      schedule[day] = preferenceType === 'vegetarian' ? 'vegetarian' : 'non_vegetarian';
    });

    weeklyRows.forEach(row => {
      if (preferenceType === 'vegetarian') {
        schedule[row.day_of_week] = 'vegetarian';
      } else {
        schedule[row.day_of_week] = row.food_type;
      }
    });

    return res.status(200).json({
      success: true,
      preference_type: preferenceType,
      weekly_preferences: schedule
    });
  } catch (error) {
    next(error);
  }
}

// PUT /api/preferences/weekly (Updates 7-day schedule for non-veg users)
async function updateWeeklyPreferences(req, res, next) {
  try {
    const userId = req.user.id;
    const { schedule, preferences } = req.body;

    const targetSchedule = schedule || preferences;

    if (!targetSchedule || typeof targetSchedule !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Invalid schedule payload. Expected an object with days of the week.'
      });
    }

    // Verify main preference is non_vegetarian (if vegetarian, all days must be veg)
    const [mainPrefs] = await db.query(
      'SELECT preference_type FROM food_preferences WHERE user_id = ?',
      [userId]
    );
    const mainType = mainPrefs.length > 0 ? mainPrefs[0].preference_type : 'vegetarian';

    for (const day of DAYS_OF_WEEK) {
      let foodType = targetSchedule[day];
      if (mainType === 'vegetarian') {
        foodType = 'vegetarian';
      } else {
        foodType = (foodType === 'vegetarian') ? 'vegetarian' : 'non_vegetarian';
      }

      await db.query(
        `INSERT INTO weekly_preferences (user_id, day_of_week, food_type)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE food_type = VALUES(food_type)`,
        [userId, day, foodType]
      );
    }

    // Return the updated schedule
    const [updatedRows] = await db.query(
      'SELECT day_of_week, food_type FROM weekly_preferences WHERE user_id = ?',
      [userId]
    );

    const updatedSchedule = {};
    updatedRows.forEach(r => {
      updatedSchedule[r.day_of_week] = r.food_type;
    });

    return res.status(200).json({
      success: true,
      message: 'Weekly meal schedule updated successfully!',
      weekly_preferences: updatedSchedule
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  setFoodPreference,
  getPreferences,
  updateWeeklyPreferences
};
