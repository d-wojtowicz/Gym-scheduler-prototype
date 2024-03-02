import express from 'express';
import controller from '../controllers/training';

const router = express.Router();

router.post('/create/training', controller.createTraining);

router.get('/get/trainings', controller.getAllTrainings);
router.get('/get/trainings/date/:date', controller.getTrainingByDate);

export = router;
