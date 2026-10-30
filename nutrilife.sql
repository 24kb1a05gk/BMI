-- ========================================================
-- NutriLife Smart Personalized Healthy Meal Planner Database
-- Database Name: nutrilife_db
-- ========================================================

CREATE DATABASE IF NOT EXISTS `nutrilife_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `nutrilife_db`;

-- Drop tables in order of foreign key dependencies
DROP TABLE IF EXISTS `saved_meals`;
DROP TABLE IF EXISTS `weekly_preferences`;
DROP TABLE IF EXISTS `food_preferences`;
DROP TABLE IF EXISTS `user_profiles`;
DROP TABLE IF EXISTS `meals`;
DROP TABLE IF EXISTS `users`;

-- 1. Users Table
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. User Profiles Table
CREATE TABLE `user_profiles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL UNIQUE,
  `age` INT NOT NULL,
  `gender` VARCHAR(20) DEFAULT NULL,
  `height` DECIMAL(5,2) NOT NULL COMMENT 'Height in centimeters',
  `weight` DECIMAL(5,2) NOT NULL COMMENT 'Weight in kilograms',
  `bmi` DECIMAL(4,1) NOT NULL,
  `health_goal` ENUM('weight_loss', 'weight_gain', 'maintain_weight') NOT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_profile_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Food Preferences Table (Overall Preference: vegetarian / non_vegetarian)
CREATE TABLE `food_preferences` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL UNIQUE,
  `preference_type` ENUM('vegetarian', 'non_vegetarian') NOT NULL,
  CONSTRAINT `fk_pref_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Weekly Preferences Table (Day-by-Day Preferences for non-veg users)
CREATE TABLE `weekly_preferences` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `day_of_week` ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
  `food_type` ENUM('vegetarian', 'non_vegetarian') NOT NULL,
  UNIQUE KEY `user_day_unique` (`user_id`, `day_of_week`),
  CONSTRAINT `fk_weekly_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Meals Table
CREATE TABLE `meals` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `meal_name` VARCHAR(150) NOT NULL,
  `meal_type` ENUM('breakfast', 'lunch', 'dinner') NOT NULL,
  `food_category` ENUM('vegetarian', 'non_vegetarian') NOT NULL,
  `calories` INT NOT NULL,
  `protein` DECIMAL(5,1) NOT NULL COMMENT 'in grams',
  `carbohydrates` DECIMAL(5,1) NOT NULL COMMENT 'in grams',
  `fat` DECIMAL(5,1) NOT NULL COMMENT 'in grams',
  `ingredients` TEXT NOT NULL,
  `preparation_steps` TEXT NOT NULL,
  `benefits` TEXT NOT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  INDEX `idx_meals_type_category` (`meal_type`, `food_category`),
  INDEX `idx_meals_calories` (`calories`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Saved Meals Table
CREATE TABLE `saved_meals` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `meal_id` INT NOT NULL,
  `saved_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `user_meal_unique` (`user_id`, `meal_id`),
  CONSTRAINT `fk_saved_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_saved_meal` FOREIGN KEY (`meal_id`) REFERENCES `meals` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================================
-- Insert Sample Indian Healthy Meals (44 Recipes)
-- ========================================================

INSERT INTO `meals` (`meal_name`, `meal_type`, `food_category`, `calories`, `protein`, `carbohydrates`, `fat`, `ingredients`, `preparation_steps`, `benefits`, `image_url`) VALUES
-- VEGETARIAN BREAKFAST (8 items)
('Idli and Sambar', 'breakfast', 'vegetarian', 290, 9.5, 52.0, 3.5, 
 'Fermented rice & urad dal batter, Toor dal, Mixed veggies (drumsticks, carrots, beans), Sambar powder, Mustard seeds, Curry leaves', 
 '1. Pour batter into greased idli molds and steam for 10-12 mins. 2. Pressure cook toor dal with turmeric. 3. Sauté veggies with sambar powder, add cooked dal and simmer. 4. Temper with mustard seeds, curry leaves, and serve hot.', 
 'Probiotic fermentation aids gut health; low fat, rich in complex carbs and plant protein for sustained morning energy.', 
 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80'),

('Vegetable Oats Khichdi', 'breakfast', 'vegetarian', 260, 9.0, 42.0, 5.0, 
 'Rolled oats, Yellow moong dal, Chopped carrots, French beans, Green peas, Cumin seeds, Ginger-garlic paste, Turmeric', 
 '1. Dry roast rolled oats for 2 minutes. 2. In a pan, temper cumin seeds in 1 tsp olive oil, add ginger-garlic and veggies. 3. Add washed moong dal, oats, water, salt and turmeric. 4. Simmer for 8-10 minutes until soft and porridge-like.', 
 'Rich in beta-glucan soluble fiber that helps lower LDL cholesterol and stabilizes blood glucose levels.', 
 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=800&auto=format&fit=crop&q=80'),

('Vegetable Upma', 'breakfast', 'vegetarian', 280, 7.5, 46.0, 6.5, 
 'Roasted semolina (Rava), Carrots, Green peas, Mustard seeds, Urad dal, Cashews, Curry leaves, Green chillies, Lemon juice', 
 '1. Dry roast rava until fragrant. 2. Splutter mustard seeds, urad dal, cashews and curry leaves in oil. 3. Add diced veggies and green chillies, sauté for 3 mins. 4. Add boiling water, gradually whisk in rava, cover and cook on low for 3 mins. Finish with fresh lemon juice.', 
 'Easily digestible, high in dietary fiber and essential micronutrients, providing a light yet energizing breakfast.', 
 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80'),

('Moong Dal Chilla', 'breakfast', 'vegetarian', 240, 14.0, 32.0, 5.0, 
 'Split yellow moong dal (soaked & ground), Ginger, Green chilli, Cumin seeds, Chopped onions, Coriander, Crumbled low-fat paneer', 
 '1. Soak yellow moong dal for 2 hours and blend into a smooth batter with ginger and chilli. 2. Pour a ladleful onto a hot non-stick tawa, spreading thin like a crepe. 3. Sprinkle chopped onions, coriander, and low-fat paneer. 4. Cook both sides with minimal oil until golden and crisp.', 
 'Very high in clean plant protein and dietary fiber; extremely low glycemic index, ideal for weight loss and muscle retention.', 
 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80'),

('Ragi Dosa with Coconut Mint Chutney', 'breakfast', 'vegetarian', 250, 7.0, 44.0, 4.5, 
 'Finger millet (Ragi) flour, Rice flour, Curd, Cumin seeds, Green chillies, Finely chopped onions, Fresh mint, Coconut, Salt', 
 '1. Mix ragi flour, curd, cumin, green chillies, and water to make a thin watery batter. 2. Heat a tawa and pour batter from outward to inward. 3. Drizzle a few drops of oil and cook until edges turn crisp. 4. Serve with fresh mint-coconut chutney.', 
 'Exceptional source of calcium and iron; helps strengthen bones, boosts hemoglobin, and keeps hunger pangs at bay.', 
 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop&q=80'),

('Sprouts & Pomegranate Chaat', 'breakfast', 'vegetarian', 210, 11.5, 36.0, 2.0, 
 'Sprouted green moong, Boiled black chana, Fresh pomegranate arils, Diced cucumber, Tomatoes, Chaat masala, Lemon juice, Mint leaves', 
 '1. Lightly steam sprouted moong for 3 minutes to retain crunch. 2. In a bowl, toss sprouts with boiled black chana, cucumber, tomato, and pomegranate. 3. Season with black salt, roasted cumin powder, chaat masala and fresh lemon juice. 4. Garnish with fresh mint.', 
 'Rich in living enzymes, vitamin C, and polyphenolic antioxidants that fight inflammation and boost digestion.', 
 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80'),

('Vegetable Poha with Peanuts', 'breakfast', 'vegetarian', 270, 6.5, 45.0, 6.5, 
 'Flattened rice (thick poha), Boiled peas, Diced potatoes, Roasted peanuts, Mustard seeds, Turmeric, Curry leaves, Lemon, Green chilli', 
 '1. Rinse poha gently in a colander and drain. 2. Heat oil, splutter mustard seeds, curry leaves, and crunchy peanuts. 3. Add diced veggies, turmeric, and green chilli; cook until tender. 4. Fold in rinsed poha, sprinkle salt, cover for 2 minutes, and finish with coriander and lemon juice.', 
 'Gluten-free, iron-rich, and provides wholesome carbohydrates for instant mental clarity and physical vitality.', 
 'https://images.unsplash.com/photo-1626777553556-9d32d0f3dfa7?w=800&auto=format&fit=crop&q=80'),

('Methi Thepla with Low-Fat Curd', 'breakfast', 'vegetarian', 290, 8.5, 44.0, 7.5, 
 'Whole wheat flour, Besan, Fresh fenugreek (methi) leaves, Ajwain seeds, Turmeric, Red chilli powder, Curd, Sesame seeds', 
 '1. Knead whole wheat flour, besan, chopped methi, ajwain, turmeric, and curd into a soft pliable dough. 2. Roll into thin discs. 3. Cook on a hot tawa with a light brush of cold-pressed oil until golden brown spots appear. 4. Serve with plain low-fat yogurt.', 
 'Fenugreek leaves improve insulin sensitivity, aid digestion, and supply valuable folate and dietary fiber.', 
 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80'),

-- VEGETARIAN LUNCH (8 items)
('Brown Rice and Dal Tadka', 'lunch', 'vegetarian', 410, 15.0, 68.0, 7.0, 
 'Brown basmati rice, Yellow toor dal, Tomatoes, Cumin seeds, Garlic cloves, Ghee (1 tsp), Turmeric, Fresh coriander', 
 '1. Pressure cook soaked brown basmati rice with water and a pinch of salt. 2. Cook toor dal with turmeric and tomatoes until soft. 3. Prepare tadka: heat 1 tsp ghee, add cumin seeds, crushed garlic, and dried red chilli. 4. Pour tadka over the piping hot dal, mix well, and serve alongside brown rice.', 
 'Classic complete protein profile (methionine from rice + lysine from lentils); packed with dietary fiber for long-lasting satiety.', 
 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80'),

('Chapati and Mixed Vegetable Sabzi', 'lunch', 'vegetarian', 380, 12.0, 62.0, 8.0, 
 'Whole wheat flour phulkas (2), Cauliflower florets, Carrots, French beans, Capsicum, Onion-tomato gravy, Cumin, Garam masala', 
 '1. Roll whole wheat dough thin and roast on open flame to make oil-free soft phulkas. 2. Sauté cumin seeds, ginger, onions and tomato puree. 3. Add mixed veggies, spices and cook covered until tender. 4. Serve hot with cucumber raita.', 
 'High in complex carbohydrates, fiber, and diverse phytonutrients from rainbow vegetables, supporting colon health.', 
 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80'),

('Palak Paneer with Multigrain Roti', 'lunch', 'vegetarian', 440, 20.0, 48.0, 16.0, 
 'Fresh spinach puree, Low-fat cottage cheese (paneer) cubes, Multigrain flour (wheat, ragi, oats), Garlic, Cumin, Low-fat milk', 
 '1. Blanch spinach leaves and blend with green chilli into smooth vibrant puree. 2. Sauté garlic, cumin, and onions in 1 tsp olive oil. 3. Add spinach puree and low-fat milk; simmer for 5 minutes. 4. Drop paneer cubes gently and simmer for 2 mins. Serve with fresh multigrain rotis.', 
 'Rich in bioavailable calcium, muscle-building casein protein, iron, and lutein for ocular and cellular health.', 
 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80'),

('Vegetable Khichdi with Curd', 'lunch', 'vegetarian', 360, 13.0, 58.0, 6.5, 
 'Moong dal, Brown rice, Green peas, Carrots, Beans, Ginger, Turmeric, Cumin seeds, Fresh homemade skimmed curd', 
 '1. Wash rice and dal together. 2. In a cooker, temper cumin and ginger, add chopped veggies. 3. Add rice, dal, turmeric, salt, and 3.5 cups water. 4. Cook for 3 whistles on medium flame until creamy. Serve warm with cooling curd.', 
 'Extremely soothing Ayurvedic meal that balances digestive fire (Agni), cleanses the gut, and replenishes micronutrients.', 
 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=800&auto=format&fit=crop&q=80'),

('Soya Chunk & Vegetable Pulao', 'lunch', 'vegetarian', 420, 24.0, 60.0, 7.5, 
 'Nutri-soya chunks (boiled & squeezed), Brown basmati rice, Green peas, Carrots, Bay leaf, Cloves, Cardamom, Onions, Mint leaves', 
 '1. Boil soya chunks in salted water, drain and squeeze excess water. 2. In a pot, sauté whole spices, sliced onions, and mint. 3. Add veggies and soya chunks, stirring for 2 mins. 4. Add soaked brown rice and water; cook covered on low flame until fluffy.', 
 'Exceptional plant protein concentration (24g) with complete amino acid profile, perfect for lean muscle growth and repair.', 
 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80'),

('Curd Rice with Pomegranate and Tadka', 'lunch', 'vegetarian', 340, 9.0, 54.0, 8.0, 
 'Soft cooked rice, Fresh probiotic curd, Pomegranate seeds, Grated ginger, Mustard seeds, Curry leaves, Green chilli, Hing', 
 '1. Mash warm cooked rice gently. 2. Stir in fresh whisked curd, milk, salt, and grated ginger until creamy. 3. Heat 1/2 tsp oil, splutter mustard seeds, curry leaves, and asafoetida. 4. Pour tempering over the rice, fold in ruby pomegranate seeds, and chill lightly before serving.', 
 'Unbeatable natural probiotic properties that restore intestinal microflora, reduce core body heat, and soothe acidity.', 
 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80'),

('Chole (Chickpea Curry) with Quinoa', 'lunch', 'vegetarian', 450, 18.0, 68.0, 9.0, 
 'White chickpeas (Kabuli chana), Organic quinoa, Tomatoes, Ginger-garlic, Cumin, Coriander powder, Amchur, Garam masala', 
 '1. Cook pre-soaked chickpeas until melt-in-mouth tender. 2. Prepare a rich tomato-ginger-onion masala with roasted Indian spices. 3. Simmer chickpeas in the aromatic gravy for 15 minutes. 4. Serve over a fluffy bed of boiled quinoa.', 
 'High-fiber, high-protein powerhouse that regulates ghrelin (hunger hormone), keeping you satisfied for 4-5 hours.', 
 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=80'),

('Rajma Masala with Steamed Brown Rice', 'lunch', 'vegetarian', 430, 17.5, 66.0, 8.0, 
 'Red kidney beans (Rajma), Brown rice, Pureed tomatoes, Onions, Garlic, Ginger, Cumin seeds, Coriander powder, Kasuri methi', 
 '1. Pressure cook soaked rajma until soft. 2. Cook finely chopped onions, garlic, and tomato puree with ground spices until oil separates lightly. 3. Add cooked rajma with its broth and simmer for 20 minutes to thicken. 4. Serve over steamed brown rice.', 
 'Abundant in resistant starch and potassium, which help regulate blood pressure and promote beneficial gut bacteria.', 
 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80'),

-- VEGETARIAN DINNER (7 items)
('Paneer Bhurji with Whole Wheat Phulka', 'dinner', 'vegetarian', 370, 19.5, 34.0, 15.0, 
 'Crumbled low-fat paneer, Whole wheat phulkas (2), Diced tomatoes, Onions, Capsicum, Green chillies, Turmeric, Fresh coriander', 
 '1. Sauté onions, green chillies, and capsicum in 1 tsp oil until softened. 2. Add tomatoes, turmeric, salt, and cook until pulpy. 3. Fold in fresh crumbled paneer and toss on high flame for 2 minutes. 4. Serve with hot phulkas.', 
 'Provides slow-digesting casein protein that nourishes muscle tissue overnight during sleep without spiking blood sugar.', 
 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80'),

('Vegetable Clear Soup with Tofu Stir-Fry', 'dinner', 'vegetarian', 290, 16.0, 24.0, 10.0, 
 'Broccoli, Mushrooms, Bok choy, Firm tofu cubes, Vegetable broth, Crushed black pepper, Ginger, Garlic, Soy sauce (low sodium)', 
 '1. Simmer broccoli, carrots, and mushrooms in vegetable broth with crushed ginger and peppercorns for 10 mins. 2. In a wok, sear pressed tofu cubes with minced garlic and sesame oil. 3. Combine vegetables and tofu, season with low-sodium soy sauce. 4. Serve warm.', 
 'Ultra low-calorie, hydrating, and packed with glucosinolates and isoflavones for nighttime cellular detox.', 
 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop&q=80'),

('Yellow Moong Dal with Bottle Gourd (Lauki)', 'dinner', 'vegetarian', 260, 12.0, 40.0, 4.0, 
 'Yellow moong dal, Diced bottle gourd (Lauki), Cumin seeds, Turmeric, Tomato, Green chilli, Fresh coriander, 1 Multigrain Roti', 
 '1. Pressure cook moong dal and bottle gourd together with turmeric and salt. 2. Sauté cumin, tomato, and green chilli in 1 tsp ghee. 3. Add cooked dal-lauki mixture and bring to a gentle boil. 4. Enjoy with a single warm multigrain roti.', 
 'Light on the digestive tract, highly alkalizing, cooling for the liver, and encourages restful sleep.', 
 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80'),

('Grilled Paneer Salad with Mint Vinaigrette', 'dinner', 'vegetarian', 330, 18.0, 16.0, 19.0, 
 'Low-fat paneer slices, Cherry tomatoes, Cucumber, Mixed salad greens, Bell peppers, Fresh mint, Lemon juice, Extra virgin olive oil', 
 '1. Marinate paneer slices in turmeric, salt, and hung curd. 2. Grill on a ridged pan for 2 mins each side until charred. 3. Whisk mint puree with olive oil, lemon juice, and black pepper. 4. Toss crisp salad greens and roasted peppers with dressing, topped with hot grilled paneer.', 
 'Low in carbohydrates, rich in healthy fats and antioxidant carotenoids, perfect for evening fat burning.', 
 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80'),

('Vegetable Dalia Khichdi', 'dinner', 'vegetarian', 280, 9.0, 48.0, 4.5, 
 'Broken wheat (Dalia), Yellow moong dal, Carrots, Green peas, Ginger, Cumin seeds, Turmeric, Pink Himalayan salt', 
 '1. Dry roast dalia until slightly golden. 2. Sauté cumin, ginger, and veggies in cooker. 3. Add dalia, moong dal, salt, and water (1:3 ratio). 4. Pressure cook for 3 whistles on medium heat. Serve with homemade mint raita.', 
 'High fiber from wheat bran keeps digestive transit optimal, preventing morning bloating and constipation.', 
 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=800&auto=format&fit=crop&q=80'),

('Mushroom & Bell Pepper Masala with Phulka', 'dinner', 'vegetarian', 310, 10.0, 42.0, 8.0, 
 'Button mushrooms, Sliced tri-color capsicum, Onions, Tomato gravy, Whole wheat phulkas (2), Kasuri methi, Garam masala', 
 '1. Sauté sliced onions, ginger, and garlic until golden. 2. Add tomato puree and spices, cooking until fragrant. 3. Stir in sliced mushrooms and capsicum; cook uncovered for 6 mins until tender-crisp. 4. Garnish with crushed kasuri methi and serve with warm phulkas.', 
 'Mushrooms provide natural Vitamin D, selenium, and beta-glucans to reinforce immune defenses.', 
 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80'),

('Beetroot & Quinoa Poriyal Bowl', 'dinner', 'vegetarian', 300, 8.5, 48.0, 6.0, 
 'Grated beetroot, Cooked white quinoa, Fresh grated coconut, Mustard seeds, Urad dal, Curry leaves, Green chilli, Lemon juice', 
 '1. Cook quinoa until fluffy. 2. Splutter mustard seeds, urad dal, green chillies, and curry leaves in oil. 3. Add grated beetroot, salt, and cook covered for 5 mins until tender. 4. Toss beetroot with cooked quinoa, garnish with fresh coconut, and dress with lemon juice.', 
 'Dietary nitrates from beetroot enhance nitric oxide production, improving blood flow and cellular oxygenation during rest.', 
 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80'),

-- NON-VEGETARIAN BREAKFAST (7 items)
('Boiled Eggs with Whole Wheat Toast', 'breakfast', 'non_vegetarian', 310, 19.0, 28.0, 11.0, 
 'Organic whole eggs (2), Egg white (1), 100% whole wheat bread slices (2), Black pepper, Avocado or light butter, Cherry tomatoes', 
 '1. Boil eggs in rolling water: 7 mins for jammy yolk or 9 mins for hard-boiled. 2. Toast whole wheat slices until golden. 3. Slice eggs, arrange over toast, sprinkle freshly ground black pepper and sea salt. 4. Serve with fresh cherry tomatoes.', 
 'Gold standard bioavailable protein (biological value of 100) and choline for sharp cognitive function and sustained satiety.', 
 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80'),

('Egg Bhurji with Multigrain Toast', 'breakfast', 'non_vegetarian', 330, 20.0, 26.0, 14.0, 
 'Whole eggs (2), Egg white (1), Finely chopped onions, Tomatoes, Green chillies, Turmeric, Coriander, 2 slices Multigrain bread', 
 '1. Whisk eggs with salt and turmeric. 2. Sauté onions, tomatoes, and green chillies in 1 tsp olive oil until soft. 3. Pour in beaten eggs, scramble vigorously on medium-low heat until soft and moist. 4. Garnish with coriander and serve with warm multigrain toast.', 
 'Supplies essential amino acids and healthy lutein, preventing mid-morning sugar cravings and energy crashes.', 
 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80'),

('Healthy Egg Dosa with Mint Chutney', 'breakfast', 'non_vegetarian', 340, 16.0, 42.0, 10.0, 
 'Fermented dosa batter, Farm-fresh egg (1), Black pepper, Finely chopped onions, Green chillies, Mint & coriander chutney', 
 '1. Spread a thin layer of dosa batter on a hot cast iron tawa. 2. Break an egg directly in the center, whisk and spread evenly across the surface. 3. Sprinkle chopped onions, green chillies, and black pepper. 4. Flip and cook until crisp and cooked through.', 
 'Harmonious blend of fermented gut-friendly carbs and muscle-repairing albumen protein.', 
 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop&q=80'),

('Egg White Omelette with Spinach & Mushrooms', 'breakfast', 'non_vegetarian', 240, 22.0, 12.0, 5.0, 
 'Egg whites (3), Whole egg (1), Baby spinach, Sliced button mushrooms, Garlic, Black pepper, 1 slice whole wheat bread', 
 '1. Sauté garlic, sliced mushrooms, and baby spinach until wilted; remove and set aside. 2. Whisk egg whites and whole egg with salt and pepper. 3. Pour into a heated non-stick skillet. 4. When eggs are nearly set, add the spinach-mushroom filling, fold in half, and serve hot.', 
 'Exceptional lean protein density with near-zero saturated fat, ideal for aggressive fat loss and definition.', 
 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=800&auto=format&fit=crop&q=80'),

('Chicken Masala Oats', 'breakfast', 'non_vegetarian', 350, 26.0, 38.0, 7.5, 
 'Shredded poached chicken breast, Rolled oats, Chopped tomatoes, Green peas, Ginger, Garam masala, Cumin seeds, Coriander', 
 '1. Poach chicken breast with salt and shred finely. 2. In a skillet, temper cumin, sauté ginger and chopped tomatoes with garam masala. 3. Add rolled oats, shredded chicken, and 2 cups chicken broth. 4. Simmer for 6 minutes until thick and savory.', 
 'High-protein, high-fiber hybrid breakfast that keeps muscle synthesis primed throughout active mornings.', 
 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=800&auto=format&fit=crop&q=80'),

('Boiled Egg & Sprout Chaat', 'breakfast', 'non_vegetarian', 280, 18.5, 30.0, 8.0, 
 'Hard-boiled eggs (2, cubed), Sprouted moong, Cucumber, Cherry tomatoes, Chaat masala, Roasted cumin, Lemon juice, Mint leaves', 
 '1. Boil eggs, peel, and cut into bite-sized cubes. 2. Combine with fresh steamed moong sprouts, diced cucumber, and cherry tomatoes. 3. Season with black salt, roasted cumin, and lemon juice. 4. Toss gently and garnish with coriander.', 
 'Combines plant and animal proteins with active digestive enzymes for effortless assimilation.', 
 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80'),

('Chicken Keema Scramble with Toast', 'breakfast', 'non_vegetarian', 360, 28.0, 28.0, 11.0, 
 'Minced chicken breast (Keema), Whole wheat toast (2), Onions, Tomatoes, Green peas, Ginger-garlic, Turmeric, Coriander', 
 '1. Sauté onions, ginger, and garlic in 1 tsp olive oil. 2. Add minced chicken breast, green peas, turmeric, and cumin powder. 3. Cook on medium-high until meat is thoroughly browned and tender. 4. Spoon generously over warm whole wheat toast.', 
 'Tremendous protein kick (28g) that suppresses ghrelin and maximizes morning metabolic burn.', 
 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80'),

-- NON-VEGETARIAN LUNCH (7 items)
('Grilled Chicken with Brown Rice Bowl', 'lunch', 'non_vegetarian', 480, 38.0, 52.0, 9.5, 
 'Skinless chicken breast, Steamed brown basmati rice, Steamed broccoli florets, Bell peppers, Lemon juice, Oregano, Garlic powder', 
 '1. Marinate chicken breast with lemon juice, garlic paste, pepper, and oregano for 20 mins. 2. Grill on medium-high heat for 5-6 mins per side until internal temp reaches 74°C. 3. Steam broccoli and bell peppers until vibrant. 4. Serve sliced grilled chicken over brown rice with steamed veggies.', 
 'The ultimate athletic meal: ultra-lean protein for muscle recovery, slow-digesting complex carbs for endurance, and sulforaphane from broccoli.', 
 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800&auto=format&fit=crop&q=80'),

('South Indian Fish Curry with Steamed Rice', 'lunch', 'non_vegetarian', 430, 30.0, 50.0, 10.0, 
 'Fresh Kingfish or Pomfret steaks, Steamed red matta / brown rice, Tamarind pulp, Coconut milk (light), Mustard seeds, Fenugreek, Curry leaves', 
 '1. Extract tamarind juice and simmer with turmeric, chilli powder, and coriander powder. 2. Add fish steaks and simmer gently for 7-8 minutes. 3. Stir in 3 tbsp light coconut milk. 4. Temper with mustard seeds, fenugreek, and curry leaves in coconut oil. Serve over hot rice.', 
 'Loaded with Omega-3 polyunsaturated fatty acids (EPA & DHA) that lower systemic inflammation and support cardiovascular health.', 
 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=80'),

('Egg Vegetable Brown Rice', 'lunch', 'non_vegetarian', 420, 20.0, 56.0, 11.0, 
 'Whole eggs (2, scrambled), Cooked brown rice, Shredded cabbage, Carrots, Green beans, Spring onions, Low sodium soy sauce, Sesame oil', 
 '1. Scramble eggs lightly in a wok and set aside. 2. Stir-fry chopped garlic and crunchy vegetables on high heat. 3. Add cooked cold brown rice, scrambled eggs, and splash of low-sodium soy sauce. 4. Toss vigorously for 2 minutes and finish with sliced spring onions.', 
 'Wholesome Chinese-Indian street food made healthy: high fiber, complete protein, and crisp antioxidant-rich veggies.', 
 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&auto=format&fit=crop&q=80'),

('Tandoori Chicken with Mint Raita & Phulka', 'lunch', 'non_vegetarian', 450, 36.0, 42.0, 12.0, 
 'Chicken breast or drumstick (skinless), Greek yogurt, Kashmiri red chilli, Ginger-garlic, Garam masala, Phulkas (2), Mint raita', 
 '1. Score chicken and marinate in hung curd, Kashmiri chilli, garlic, ginger, and lemon for 1 hour. 2. Roast in oven at 200°C for 22 mins or grill until smoky and charred. 3. Serve hot with whole wheat phulkas and fresh mint cucumber raita.', 
 'Traditional tandoori spices boost metabolic rate while high-protein chicken aids tissue synthesis without excess saturated fat.', 
 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=800&auto=format&fit=crop&q=80'),

('Prawn Curry with Brown Rice', 'lunch', 'non_vegetarian', 410, 32.0, 48.0, 8.5, 
 'Fresh deveined prawns, Steamed brown rice, Onions, Tomato gravy, Kokum or tamarind, Ginger, Cumin seeds, Curry leaves', 
 '1. Sauté onions, ginger, and curry leaves in 1 tsp oil until translucent. 2. Add ground spices, tomato puree, and kokum water; simmer for 5 mins. 3. Add fresh prawns and cook for just 4-5 minutes until curled and tender (do not overcook). 4. Serve over warm brown rice.', 
 'Prawns are packed with astaxanthin (potent antioxidant) and zinc, essential for cellular regeneration and immune health.', 
 'https://images.unsplash.com/photo-1559742811-822873691df8?w=800&auto=format&fit=crop&q=80'),

('Chicken Keema with Multigrain Phulka', 'lunch', 'non_vegetarian', 440, 34.0, 44.0, 11.5, 
 'Minced chicken breast, Green peas, Multigrain rotis (2), Onions, Pureed tomatoes, Ginger-garlic, Garam masala, Fresh mint', 
 '1. Sauté onions, garlic, and ginger until caramelized. 2. Add minced chicken and break up clumps while searing. 3. Add pureed tomatoes, green peas, and ground spices. 4. Simmer covered for 15 minutes. Serve with hot multigrain rotis.', 
 'High in B-complex vitamins (especially B6 and B12) that facilitate cellular energy production and maintain nerve health.', 
 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80'),

('Steamed Fish Tikka with Millet Pulao', 'lunch', 'non_vegetarian', 420, 31.0, 46.0, 9.0, 
 'Fresh Basa or Rohu fish fillets, Foxtail millet, Diced carrots, French beans, Mustard-ajwain yogurt marinade, Lemon wedges', 
 '1. Marinate fish cubes in hung curd, ajwain seeds, turmeric, and mustard oil for 30 mins. 2. Steam in banana leaf or parchment for 12 mins. 3. Prepare foxtail millet with cumin and diced veggies. 4. Serve fish alongside the aromatic millet pulao.', 
 'Millets offer low GI and high fiber, while steamed fish delivers premium bioavailable protein without oxidative frying fats.', 
 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=80'),

-- NON-VEGETARIAN DINNER (7 items)
('Grilled Fish with Roasted Vegetables', 'dinner', 'non_vegetarian', 360, 32.0, 18.0, 14.0, 
 'Fresh white fish fillet (Basa, Cod, or Tilapia), Asparagus spears, Zucchini slices, Cherry tomatoes, Lemon juice, Olive oil, Garlic, Herbs', 
 '1. Rub fish fillet with minced garlic, lemon juice, sea salt, black pepper, and 1 tsp olive oil. 2. Toss veggies in olive oil and herbs. 3. Place on a baking sheet and roast at 200°C for 15 minutes until fish flakes easily with a fork. 4. Drizzle fresh lemon juice and serve.', 
 'Low in carbohydrates and high in anti-inflammatory omega fats, promoting deep sleep and overnight tissue recovery.', 
 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=80'),

('Warm Grilled Chicken Salad', 'dinner', 'non_vegetarian', 340, 35.0, 14.0, 12.0, 
 'Grilled chicken breast strips, Baby spinach, Rocket leaves, Cucumber, Bell peppers, Toasted pumpkin seeds, Lemon-mustard vinaigrette', 
 '1. Grill marinated chicken breast and slice into strips. 2. Arrange crispy salad greens, cucumber, and bell peppers in a wide bowl. 3. Whisk Dijon mustard, lemon juice, black pepper, and cold-pressed olive oil. 4. Top salad with warm chicken, drizzle vinaigrette, and sprinkle pumpkin seeds.', 
 'Super low glycemic impact, high zinc and magnesium for restful sleep, and ample protein for muscle recovery.', 
 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80'),

('Clear Chicken & Vegetable Soup', 'dinner', 'non_vegetarian', 260, 28.0, 12.0, 6.0, 
 'Poached chicken breast cubes, Homemade clear chicken broth, Carrots, Celery, Mushrooms, Crushed black pepper, Ginger, Garlic', 
 '1. Simmer chicken breast with bone broth, crushed ginger, and cloves for 20 mins. 2. Remove chicken, shred, and return to simmering broth. 3. Add sliced carrots, celery, and mushrooms; cook for 8 mins. 4. Season with sea salt and freshly cracked black pepper.', 
 'Deeply hydrating, comforting, easy on gastrointestinal tract, and packed with bio-collagen for joint and gut lining repair.', 
 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop&q=80'),

('Egg Curry with 2 Whole Wheat Phulkas', 'dinner', 'non_vegetarian', 380, 19.0, 38.0, 14.0, 
 'Boiled eggs (2, pierced & lightly sautéed), Whole wheat phulkas (2), Onion-tomato gravy, Ginger-garlic, Garam masala, Fresh coriander', 
 '1. Hard boil eggs, peel and make shallow slits. Sauté for 1 min in turmeric oil. 2. Sauté onions, ginger, and garlic; add pureed tomatoes and aromatic Indian spices. 3. Add 1/2 cup water and simmer eggs in gravy for 6-8 mins. 4. Garnish with coriander and serve with phulkas.', 
 'Satisfying traditional comfort food with quality protein, healthy fats, and thermogenic digestive spices.', 
 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80'),

('Kerala Style Fish Stew with Appam', 'dinner', 'non_vegetarian', 390, 27.0, 42.0, 11.0, 
 'Firm fish fillets (Kingfish or Seer), Light coconut milk, Thin sliced ginger, Green chillies, Curry leaves, Shallots, Steamed rice appam', 
 '1. Sauté sliced shallots, ginger, green chillies, and curry leaves in 1 tsp coconut oil. 2. Add thin coconut milk, turmeric, and black pepper; bring to a slow simmer. 3. Slide in fish pieces and cook for 6 mins. 4. Pour thick coconut milk, turn off heat immediately, and serve with hot soft appam.', 
 'Rich in medium-chain triglycerides (MCTs) and potassium; easily digested for light, peaceful nighttime recovery.', 
 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=80'),

('Grilled Salmon with Asparagus & Garlic Herb Dip', 'dinner', 'non_vegetarian', 410, 34.0, 10.0, 22.0, 
 'Atlantic Salmon fillet (or Indian Rawas), Fresh asparagus, Lemon zest, Garlic cloves, Greek yogurt, Dill, Sea salt', 
 '1. Season salmon with sea salt, pepper, and lemon zest. 2. Sear on a non-stick skillet skin-side down for 4 mins, then flip for 3 mins. 3. Sauté asparagus with minced garlic in the pan juices. 4. Serve with a dollop of fresh garlic-dill Greek yogurt.', 
 'Unrivaled source of Astaxanthin and Omega-3 fats, protecting heart and brain function while calming nighttime stress markers.', 
 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=80'),

('Chicken Tikka Whole Wheat Wrap', 'dinner', 'non_vegetarian', 380, 31.0, 36.0, 10.0, 
 'Tandoori-spiced chicken breast strips, 100% whole wheat roti wrap, Sliced red onions, Mint-curd spread, Bell pepper strips', 
 '1. Grill marinated spiced chicken strips until tender. 2. Warm whole wheat roti on a griddle. 3. Spread refreshing mint-hung curd spread across the roti. 4. Place grilled chicken, crunchy onion rings, and bell pepper strips, roll tightly and slice in half.', 
 'Convenient, balanced macro ratio of high protein to moderate carbs, satisfying dinner cravings cleanly.', 
 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800&auto=format&fit=crop&q=80')
;
