const express = require('express');
const router = express.Router();
const preferenceController = require('../controllers/preferenceController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', preferenceController.setFoodPreference);
router.get('/', preferenceController.getPreferences);
router.put('/weekly', preferenceController.updateWeeklyPreferences);

module.exports = router;
