const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const FoodController = require('../controllers/foodController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// ensure upload directory exists
const uploadDir = path.join(__dirname, '..', '..', 'public', 'uploads', 'foods');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});
const upload = multer({ storage });

// GET /filters -> list checkbox into Sidebar
router.get('/filters', FoodController.getFilterOptions);

// GET /foods -> returns all foods with primary image
router.get('/foods', FoodController.getAllFoods);

// GET /foods/:id -> returns food detail with images & reviews
router.get('/foods/:id', FoodController.getFoodById);

// Extra read endpoint for popular foods
router.get('/favorite_foods', FoodController.getPopularFoods);

// Admin / write endpoints
router.post('/foods', upload.single('image'), FoodController.createFood);
router.put('/foods/:id', upload.single('image'), FoodController.updateFood);
router.delete('/foods/:id', FoodController.deleteFood);
router.post('/foods/:id/images', upload.single('image'), FoodController.uploadFoodImage);
router.delete('/foods/:id/images/:imageId', FoodController.deleteFoodImage);

// Reviews
router.post('/foods/:id/reviews', authenticateToken, FoodController.addReview);

module.exports = router;


