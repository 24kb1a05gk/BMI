# NutriLife – Smart Personalized Healthy Meal Planner

A complete, production-ready, commercial-quality full-stack web application designed for smart personalized Indian meal planning based on real-time **BMI screening**, **metabolic goals**, and **flexible weekly vegetarian / non-vegetarian lifestyle scheduling**.

---

## 🌟 Key Features

1. **Intelligent BMI Screening & Health Categorization**:
   - Automated BMI calculation: $\text{BMI} = \text{weight (kg)} / (\text{height (m)})^2$
   - WHO-aligned categories: Underweight ($<18.5$), Normal ($18.5 - 24.9$), Overweight ($25 - 29.9$), and Obesity ($30+$).
   - Visual segmented color gauge with live dynamic recalculation as metrics update.
   - Evidence-based health guidance and medical disclaimers.

2. **Weekly Vegetarian & Non-Vegetarian Scheduling**:
   - **Vegetarian Users**: Strict vegetarian enforcement. Non-vegetarian meals are completely hidden across all endpoints.
   - **Non-Vegetarian Users**: Independent day-by-day scheduling (Monday through Sunday) allowing custom vegetarian and non-veg days (e.g. vegetarian on Tuesdays/Thursdays, non-veg on weekends).
   - Persisted directly to MySQL `weekly_preferences` table.

3. **Smart Personalized Meal Recommendation Engine**:
   - Day & Meal Time (Breakfast, Lunch, Dinner) filtering.
   - Considers BMI, health goal (Weight Loss, Weight Gain, Maintain Weight), and day-specific dietary mode.
   - Returns at least 3 tailored meal suggestions with recipes, ingredients, instructions, and macro nutrients.

4. **Extensive Indian Culinary Database (44+ Recipes)**:
   - Authentic, accessible Indian dishes covering both vegetarian and non-vegetarian cuisines.
   - Realistic nutritional estimates: Calories, Protein, Carbohydrates, and Fats.
   - High-definition photography, detailed ingredient breakdowns, step-by-step preparation instructions, and therapeutic health benefits.

5. **Personalized SaaS Member Dashboard**:
   - Daily greeting & member stats.
   - BMI overview card & custom daily macro targets (Mifflin-St Jeor calculation).
   - Today's curated plate (1 Breakfast, 1 Lunch, 1 Dinner).
   - Interactive weekly calendar preview.
   - Recently saved recipes quick-access.

6. **Recipe Vault (Saved Meals)**:
   - Bookmark favorite meals with heart toggle.
   - Filter by meal type (Breakfast, Lunch, Dinner).
   - Interactive recipe modal with ingredient pills and numbered instructions.

---

## 🛠️ Technology Stack

- **Frontend**:
  - React 19 (JSX)
  - Vite 6
  - Tailwind CSS v4
  - React Compiler enabled (`babel-plugin-react-compiler`)
  - React Router DOM v6
  - Axios (with JWT interceptors)
  - Lucide React icons
  - ESLint 9 (configured with 0 warnings)

- **Backend**:
  - Node.js & Express.js
  - RESTful API architecture
  - MySQL2 (`mysql2/promise` connection pooling)
  - JSON Web Tokens (JWT) for secure stateless sessions
  - bcryptjs for cryptographic password hashing
  - dotenv for environment variable configuration
  - CORS with credentials support

- **Database**:
  - MySQL through XAMPP
  - Database name: `nutrilife_db`
  - 6 relational tables with foreign keys and cascading rules: `users`, `user_profiles`, `food_preferences`, `weekly_preferences`, `meals`, `saved_meals`.

---

## 🚀 Execution & Setup Instructions

### 1. Prerequisites
- **Node.js** (v18 or newer installed)
- **XAMPP** (with Apache and MySQL)

---

### 2. Start MySQL in XAMPP
1. Open the **XAMPP Control Panel**.
2. Click **Start** next to **MySQL** (and **Apache** if you wish to use phpMyAdmin).
3. Ensure MySQL is running on port `3306`.

---

### 3. Database Setup (Two Alternative Methods)

#### Option A: Automated One-Command Script (Recommended)
From the root folder, navigate to `backend` and run:
```bash
cd backend
npm run db:setup
```
This automatically connects to MySQL, creates `nutrilife_db`, creates all 6 tables, and inserts the 44+ healthy Indian meals.

#### Option B: Via phpMyAdmin Web Interface
1. Open your browser and navigate to `http://localhost/phpmyadmin`.
2. Click on **New** in the left sidebar.
3. Database name: `nutrilife_db`, Collation: `utf8mb4_unicode_ci`. Click **Create**.
4. Select `nutrilife_db` from the left menu.
5. Click on the **Import** tab at the top.
6. Click **Choose File** and select `nutrilife.sql` located in the root directory.
7. Click **Import** at the bottom.

---

### 4. Configure Backend Environment
The backend configuration is already prepared in `backend/.env`. You can verify or edit credentials:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=nutrilife_db
JWT_SECRET=nutrilife_super_secure_jwt_secret_key_2026_xyz
```

---

### 5. Install Dependencies

#### Backend:
```bash
cd backend
npm install
```

#### Frontend:
```bash
cd frontend
npm install
```

---

### 6. Run the Application

#### Start the Backend Server (Port 5000):
```bash
cd backend
npm start
```
Server runs at: `http://localhost:5000`

#### Start the Frontend Development Server (Port 5173):
Open a new terminal window:
```bash
cd frontend
npm run dev
```
Client runs at: `http://localhost:5173`

---

## 🧪 Verification & Automated Testing

You can run the end-to-end API test suite anytime:
```bash
node backend/scripts/testE2E.js
```
This verifies user registration, login, profile setup, BMI calculations, 7-day schedule mutations, vegetarian constraint enforcement, meal saving, and dashboard data aggregation.

---

## 👤 Author & Repository

- **GitHub Profile**: [24kb1a05gk](https://github.com/24kb1a05gk)
- **Email**: [24kb1a05gk@nbkrist.org](mailto:24kb1a05gk@nbkrist.org)
- **Repository**: [https://github.com/24kb1a05gk/BMI.git](https://github.com/24kb1a05gk/BMI.git)
