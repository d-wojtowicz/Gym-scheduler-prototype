import express from 'express';
import controller from '../controllers/training';

const router = express.Router();

router.get('/get/trainings', controller.getAllTrainings);

export = router;
