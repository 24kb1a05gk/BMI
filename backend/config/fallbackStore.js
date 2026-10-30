const defaultMeals = require('../data/defaultMeals.json');

// In-Memory Database store for serverless/cloud environments where local XAMPP 127.0.0.1:3306 is unreachable
class FallbackStore {
  constructor() {
    this.users = [];
    this.userProfiles = new Map(); // userId -> profile
    this.foodPreferences = new Map(); // userId -> pref
    this.weeklyPreferences = new Map(); // `${userId}_${day}` -> food_type
    this.savedMeals = new Map(); // `${userId}_${mealId}` -> { userId, mealId, saved_at }
    this.meals = defaultMeals.map((m, idx) => ({ ...m, id: m.id || idx + 1 }));
    this.nextUserId = 1;
  }

  async execute(sql, params = []) {
    const cleanSql = sql.replace(/\s+/g, ' ').trim();

    // 1. users
    if (cleanSql.startsWith('INSERT INTO users')) {
      const [full_name, email, password_hash] = params;
      const user = {
        id: this.nextUserId++,
        full_name,
        email,
        password_hash,
        created_at: new Date().toISOString()
      };
      this.users.push(user);
      return [{ insertId: user.id, affectedRows: 1 }];
    }

    if (cleanSql.includes('FROM users WHERE email = ?')) {
      const email = params[0]?.toLowerCase();
      const user = this.users.find(u => u.email.toLowerCase() === email);
      return [user ? [{ ...user }] : []];
    }

    if (cleanSql.includes('FROM users WHERE id = ?')) {
      const id = parseInt(params[0], 10);
      const user = this.users.find(u => u.id === id);
      return [user ? [{ ...user }] : []];
    }

    // 2. user_profiles
    if (cleanSql.includes('INSERT INTO user_profiles')) {
      const [user_id, age, gender, height, weight, bmi, health_goal] = params;
      const profile = {
        id: user_id,
        user_id,
        age: parseInt(age, 10),
        gender,
        height: parseFloat(height),
        weight: parseFloat(weight),
        bmi: parseFloat(bmi),
        health_goal,
        updated_at: new Date().toISOString()
      };
      this.userProfiles.set(user_id, profile);
      return [{ affectedRows: 1 }];
    }

    if (cleanSql.includes('UPDATE user_profiles SET')) {
      const [age, gender, height, weight, bmi, health_goal, user_id] = params;
      const existing = this.userProfiles.get(user_id) || {};
      const updated = {
        ...existing,
        user_id,
        age: parseInt(age, 10),
        gender,
        height: parseFloat(height),
        weight: parseFloat(weight),
        bmi: parseFloat(bmi),
        health_goal,
        updated_at: new Date().toISOString()
      };
      this.userProfiles.set(user_id, updated);
      return [{ affectedRows: 1 }];
    }

    if (cleanSql.includes('FROM user_profiles WHERE user_id = ?')) {
      const userId = parseInt(params[0], 10);
      const p = this.userProfiles.get(userId);
      return [p ? [{ ...p }] : []];
    }

    // 3. food_preferences
    if (cleanSql.includes('INSERT INTO food_preferences')) {
      const [user_id, preference_type] = params;
      this.foodPreferences.set(user_id, preference_type);
      return [{ affectedRows: 1 }];
    }

    if (cleanSql.includes('FROM food_preferences WHERE user_id = ?')) {
      const userId = parseInt(params[0], 10);
      const pref = this.foodPreferences.get(userId);
      return [pref ? [{ preference_type: pref }] : []];
    }

    // 4. weekly_preferences
    if (cleanSql.includes('INSERT INTO weekly_preferences')) {
      const [user_id, day_of_week, food_type] = params;
      this.weeklyPreferences.set(`${user_id}_${day_of_week}`, food_type);
      return [{ affectedRows: 1 }];
    }

    if (cleanSql.includes('FROM weekly_preferences WHERE user_id = ? AND day_of_week = ?')) {
      const [userId, day] = params;
      const foodType = this.weeklyPreferences.get(`${userId}_${day}`);
      return [foodType ? [{ food_type: foodType }] : []];
    }

    if (cleanSql.includes('FROM weekly_preferences WHERE user_id = ?')) {
      const userId = parseInt(params[0], 10);
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const rows = [];
      for (const d of days) {
        const ft = this.weeklyPreferences.get(`${userId}_${d}`);
        if (ft) rows.push({ day_of_week: d, food_type: ft });
      }
      return [rows];
    }

    // 5. meals & suggestions
    if (cleanSql.includes('FROM meals m') || cleanSql.includes('FROM meals')) {
      let filtered = [...this.meals];
      const userId = params[0];

      // Meal by id
      if (cleanSql.includes('WHERE m.id = ?') || cleanSql.includes('WHERE id = ?')) {
        const id = parseInt(params[params.length - 1], 10);
        const meal = this.meals.find(m => m.id === id);
        if (!meal) return [[]];
        const isSaved = this.savedMeals.has(`${userId}_${id}`);
        return [[{ ...meal, is_saved: isSaved ? 1 : 0 }]];
      }

      // Meal type & category filter
      if (cleanSql.includes('m.meal_type = ?') && cleanSql.includes('m.food_category = ?')) {
        const mealType = params[1];
        const foodCategory = params[2];
        filtered = filtered.filter(m => m.meal_type === mealType && m.food_category === foodCategory);
      } else if (cleanSql.includes('m.meal_type = ?')) {
        const mealType = params[1];
        filtered = filtered.filter(m => m.meal_type === mealType);
      }

      if (cleanSql.includes("m.food_category = 'vegetarian'")) {
        filtered = filtered.filter(m => m.food_category === 'vegetarian');
      }

      // Order by
      if (cleanSql.includes('ORDER BY m.calories ASC')) {
        filtered.sort((a, b) => a.calories - b.calories);
      } else if (cleanSql.includes('ORDER BY m.calories DESC')) {
        filtered.sort((a, b) => b.calories - a.calories);
      }

      // Limit 1
      if (cleanSql.includes('LIMIT 1')) {
        filtered = filtered.slice(0, 1);
      }

      const rows = filtered.map(m => ({
        ...m,
        is_saved: this.savedMeals.has(`${userId}_${m.id}`) ? 1 : 0
      }));

      return [rows];
    }

    // 6. saved_meals
    if (cleanSql.includes('INSERT INTO saved_meals')) {
      const [userId, mealId] = params;
      this.savedMeals.set(`${userId}_${mealId}`, {
        userId,
        mealId: parseInt(mealId, 10),
        saved_at: new Date().toISOString()
      });
      return [{ affectedRows: 1 }];
    }

    if (cleanSql.includes('DELETE FROM saved_meals')) {
      const [userId, mealId] = params;
      const key = `${userId}_${mealId}`;
      const had = this.savedMeals.has(key);
      this.savedMeals.delete(key);
      return [{ affectedRows: had ? 1 : 0 }];
    }

    if (cleanSql.includes('FROM saved_meals WHERE user_id = ? AND meal_id = ?')) {
      const [userId, mealId] = params;
      const entry = this.savedMeals.get(`${userId}_${mealId}`);
      return [entry ? [{ id: 1, ...entry }] : []];
    }

    if (cleanSql.includes('FROM saved_meals sm JOIN meals m')) {
      const userId = params[0];
      const rows = [];
      for (const [key, val] of this.savedMeals.entries()) {
        if (val.userId === userId) {
          const meal = this.meals.find(m => m.id === val.mealId);
          if (meal) {
            rows.push({ ...meal, saved_at: val.saved_at, is_saved: 1 });
          }
        }
      }
      return [rows];
    }

    return [[]];
  }
}

const fallbackStore = new FallbackStore();

module.exports = fallbackStore;
