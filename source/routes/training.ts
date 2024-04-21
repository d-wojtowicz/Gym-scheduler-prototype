import express from 'express';
import controller from '../controllers/training';
import verifyToken from '../../public/js/verifyToken';

const router = express.Router();

router.get('/get/trainings', verifyToken, controller.getAllTrainings);
router.get('/get/trainings/date/:date', verifyToken, controller.getTrainingByDate);

router.post('/create/training', verifyToken, controller.createTraining);

router.delete('/delete/training/:id', verifyToken, controller.removeTraining);

export = router;
