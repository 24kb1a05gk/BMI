const express = require('express');
const router = express.Router();
const mealController = require('../controllers/mealController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/suggestions', mealController.getMealSuggestions);
router.get('/saved', mealController.getSavedMeals);
router.post('/save', mealController.saveMeal);
router.delete('/saved/:mealId', mealController.deleteSavedMeal);
router.get('/', mealController.getAllMeals);
router.get('/:id', mealController.getMealById);

module.exports = router;
