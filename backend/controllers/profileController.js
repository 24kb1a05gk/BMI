const db = require('../config/db');

// Helper to calculate BMI and its metadata
function calculateBMIData(heightCm, weightKg) {
  const heightM = heightCm / 100;
  const bmi = parseFloat((weightKg / (heightM * heightM)).toFixed(1));

  let category = 'Normal weight';
  let color = '#557C55';
  let advice = 'You have a healthy body weight. Maintain your balanced diet and consistent daily activity.';

  if (bmi < 18.5) {
    category = 'Underweight';
    color = '#3B82F6'; // Blue
    advice = 'Focus on nutrient-dense healthy meals, adequate complex carbs, and protein to achieve a healthier weight.';
  } else if (bmi <= 24.9) {
    category = 'Normal weight';
    color = '#557C55'; // Theme green
    advice = 'Your weight is in the ideal range. Keep enjoying balanced nutrient-packed meals.';
  } else if (bmi <= 29.9) {
    category = 'Overweight';
    color = '#F59E0B'; // Amber
    advice = 'Aim for gradual weight reduction with high-fiber, lean protein meals and regular cardiovascular exercise.';
  } else {
    category = 'Obesity range';
    color = '#EF4444'; // Red
    advice = 'Prioritize portion control, low-calorie nutrient-dense foods, and consult a registered healthcare provider.';
  }

  return { bmi, category, color, advice };
}

// Helper to initialize default 7-day weekly preferences if user is non-veg
async function ensureWeeklyPreferences(userId, defaultType = 'non_vegetarian') {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  for (const day of days) {
    await db.query(
      `INSERT INTO weekly_preferences (user_id, day_of_week, food_type) 
       VALUES (?, ?, ?) 
       ON DUPLICATE KEY UPDATE food_type = VALUES(food_type)`,
      [userId, day, defaultType]
    );
  }
}

// POST /api/profile
async function createProfile(req, res, next) {
  try {
    const userId = req.user.id;
    const { age, gender, height, weight, health_goal, preference_type } = req.body;

    if (!age || !height || !weight || !health_goal) {
      return res.status(400).json({
        success: false,
        message: 'Please provide age, height, weight, and health goal.'
      });
    }

    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);
    const ageNum = parseInt(age, 10);

    if (heightNum <= 50 || heightNum >= 250 || weightNum <= 20 || weightNum >= 350) {
      return res.status(400).json({
        success: false,
        message: 'Please enter realistic height (50-250 cm) and weight (20-350 kg).'
      });
    }

    const { bmi, category, advice } = calculateBMIData(heightNum, weightNum);

    // Upsert into user_profiles
    await db.query(
      `INSERT INTO user_profiles (user_id, age, gender, height, weight, bmi, health_goal)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
         age = VALUES(age),
         gender = VALUES(gender),
         height = VALUES(height),
         weight = VALUES(weight),
         bmi = VALUES(bmi),
         health_goal = VALUES(health_goal)`,
      [userId, ageNum, gender || null, heightNum, weightNum, bmi, health_goal]
    );

    // Upsert food preference
    const foodPref = preference_type === 'non_vegetarian' ? 'non_vegetarian' : 'vegetarian';
    await db.query(
      `INSERT INTO food_preferences (user_id, preference_type)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE preference_type = VALUES(preference_type)`,
      [userId, foodPref]
    );

    // If non-vegetarian, ensure default weekly schedule exists
    if (foodPref === 'non_vegetarian') {
      await ensureWeeklyPreferences(userId, 'non_vegetarian');
    } else {
      // If vegetarian, ensure all 7 days in weekly_preferences are vegetarian
      await ensureWeeklyPreferences(userId, 'vegetarian');
    }

    return res.status(200).json({
      success: true,
      message: 'Profile saved successfully!',
      profile: {
        user_id: userId,
        age: ageNum,
        gender,
        height: heightNum,
        weight: weightNum,
        bmi,
        category,
        advice,
        health_goal,
        preference_type: foodPref
      }
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/profile
async function getProfile(req, res, next) {
  try {
    const userId = req.user.id;

    const [profiles] = await db.query(
      'SELECT * FROM user_profiles WHERE user_id = ?',
      [userId]
    );

    const [prefs] = await db.query(
      'SELECT preference_type FROM food_preferences WHERE user_id = ?',
      [userId]
    );

    if (profiles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No profile found for this user.'
      });
    }

    const profile = profiles[0];
    const { category, color, advice } = calculateBMIData(profile.height, profile.weight);

    return res.status(200).json({
      success: true,
      profile: {
        ...profile,
        category,
        color,
        advice,
        preference_type: prefs.length > 0 ? prefs[0].preference_type : 'vegetarian'
      }
    });
  } catch (error) {
    next(error);
  }
}

// PUT /api/profile
async function updateProfile(req, res, next) {
  try {
    const userId = req.user.id;
    const { age, gender, height, weight, health_goal, preference_type } = req.body;

    // Check existing
    const [existing] = await db.query('SELECT * FROM user_profiles WHERE user_id = ?', [userId]);
    if (existing.length === 0) {
      return createProfile(req, res, next);
    }

    const current = existing[0];
    const newAge = age !== undefined ? parseInt(age, 10) : current.age;
    const newGender = gender !== undefined ? gender : current.gender;
    const newHeight = height !== undefined ? parseFloat(height) : current.height;
    const newWeight = weight !== undefined ? parseFloat(weight) : current.weight;
    const newGoal = health_goal || current.health_goal;

    const { bmi, category, color, advice } = calculateBMIData(newHeight, newWeight);

    await db.query(
      `UPDATE user_profiles 
       SET age = ?, gender = ?, height = ?, weight = ?, bmi = ?, health_goal = ?
       WHERE user_id = ?`,
      [newAge, newGender, newHeight, newWeight, bmi, newGoal, userId]
    );

    if (preference_type) {
      await db.query(
        `INSERT INTO food_preferences (user_id, preference_type)
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE preference_type = VALUES(preference_type)`,
        [userId, preference_type]
      );
      if (preference_type === 'vegetarian') {
        await ensureWeeklyPreferences(userId, 'vegetarian');
      }
    }

    const [updatedPrefs] = await db.query(
      'SELECT preference_type FROM food_preferences WHERE user_id = ?',
      [userId]
    );

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      profile: {
        user_id: userId,
        age: newAge,
        gender: newGender,
        height: newHeight,
        weight: newWeight,
        bmi,
        category,
        color,
        advice,
        health_goal: newGoal,
        preference_type: updatedPrefs.length > 0 ? updatedPrefs[0].preference_type : 'vegetarian'
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createProfile,
  getProfile,
  updateProfile,
  calculateBMIData
};
