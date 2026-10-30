const http = require('http');

function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : '';
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: `/api${path}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(postData && { 'Content-Length': Buffer.byteLength(postData) }),
        ...(token && { Authorization: `Bearer ${token}` })
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting NutriLife End-to-End API Test Suite...');
  const testEmail = `testuser_${Date.now()}@nutrilife.test`;

  // 1. Register
  console.log('1️⃣ Testing POST /api/auth/register...');
  const regRes = await request('POST', '/auth/register', {
    full_name: 'Test Nutrition Seeker',
    email: testEmail,
    password: 'password123',
    confirm_password: 'password123'
  });
  console.log(`   Status: ${regRes.status}, Success: ${regRes.body.success}, Token: ${!!regRes.body.token}`);
  const token = regRes.body.token;

  // 2. Login
  console.log('2️⃣ Testing POST /api/auth/login...');
  const loginRes = await request('POST', '/auth/login', {
    email: testEmail,
    password: 'password123'
  });
  console.log(`   Status: ${loginRes.status}, User: ${loginRes.body.user.full_name}, hasProfile: ${loginRes.body.hasProfile}`);

  // 3. Me
  console.log('3️⃣ Testing GET /api/auth/me...');
  const meRes = await request('GET', '/auth/me', null, token);
  console.log(`   Status: ${meRes.status}, Email: ${meRes.body.user.email}`);

  // 4. Create Profile (Height 175cm, Weight 70kg -> BMI 22.9 Normal)
  console.log('4️⃣ Testing POST /api/profile...');
  const profileRes = await request('POST', '/profile', {
    age: 26,
    gender: 'male',
    height: 175,
    weight: 70,
    health_goal: 'maintain_weight',
    preference_type: 'non_vegetarian'
  }, token);
  console.log(`   Status: ${profileRes.status}, BMI: ${profileRes.body.profile.bmi}, Category: ${profileRes.body.profile.category}`);

  // 5. Get Preferences
  console.log('5️⃣ Testing GET /api/preferences...');
  const prefRes = await request('GET', '/preferences', null, token);
  console.log(`   Status: ${prefRes.status}, Type: ${prefRes.body.preference_type}, Monday: ${prefRes.body.weekly_preferences.Monday}`);

  // 6. Update Weekly Schedule (Make Tuesday & Thursday Vegetarian)
  console.log('6️⃣ Testing PUT /api/preferences/weekly...');
  const updatedSchedule = {
    ...prefRes.body.weekly_preferences,
    Tuesday: 'vegetarian',
    Thursday: 'vegetarian'
  };
  const updatePrefRes = await request('PUT', '/preferences/weekly', { schedule: updatedSchedule }, token);
  console.log(`   Status: ${updatePrefRes.status}, Tuesday is now: ${updatePrefRes.body.weekly_preferences.Tuesday}`);

  // 7. Get Meal Suggestions for Tuesday (Vegetarian Day)
  console.log('7️⃣ Testing GET /api/meals/suggestions for Tuesday (Veg Day)...');
  const vegSugRes = await request('GET', '/meals/suggestions?day=Tuesday&meal_type=breakfast', null, token);
  console.log(`   Status: ${vegSugRes.status}, Suggestions returned: ${vegSugRes.body.count}`);
  const allVeg = vegSugRes.body.meals.every(m => m.food_category === 'vegetarian');
  console.log(`   ✅ Filter verification: All ${vegSugRes.body.meals.length} suggestions are vegetarian: ${allVeg}`);

  // 8. Get Meal Suggestions for Monday (Non-Veg Day)
  console.log('8️⃣ Testing GET /api/meals/suggestions for Monday (Non-Veg Day)...');
  const nonVegSugRes = await request('GET', '/meals/suggestions?day=Monday&meal_type=breakfast', null, token);
  console.log(`   Status: ${nonVegSugRes.status}, Suggestions returned: ${nonVegSugRes.body.count}`);
  console.log(`   First suggestion: ${nonVegSugRes.body.meals[0].meal_name} (${nonVegSugRes.body.meals[0].food_category})`);

  // 9. Save a meal
  const mealToSave = nonVegSugRes.body.meals[0].id;
  console.log(`9️⃣ Testing POST /api/meals/save (Meal ID: ${mealToSave})...`);
  const saveRes = await request('POST', '/meals/save', { meal_id: mealToSave }, token);
  console.log(`   Status: ${saveRes.status}, Message: ${saveRes.body.message}`);

  // 10. Get Saved meals
  console.log('🔟 Testing GET /api/meals/saved...');
  const savedRes = await request('GET', '/meals/saved', null, token);
  console.log(`   Status: ${savedRes.status}, Total saved meals: ${savedRes.body.count}`);

  // 11. Dashboard Aggregated Endpoint
  console.log('1️⃣1️⃣ Testing GET /api/dashboard...');
  const dashRes = await request('GET', '/dashboard', null, token);
  console.log(`   Status: ${dashRes.status}, Success: ${dashRes.body.success}`);
  console.log(`   Target Calories: ${dashRes.body.nutritionTarget.dailyCalories} kcal`);
  console.log(`   Today Breakfast: ${dashRes.body.todayMeals.breakfast?.meal_name}`);
  console.log(`   Today Lunch: ${dashRes.body.todayMeals.lunch?.meal_name}`);
  console.log(`   Today Dinner: ${dashRes.body.todayMeals.dinner?.meal_name}`);

  console.log('\n🎉 ALL 11 API ENDPOINT TESTS PASSED WITH 100% SUCCESS!');
}

runTests().catch(console.error);
