import express from 'express';
import controller from '../controllers/globalUserExercise';
import verifyToken from '../../public/js/verifyToken';

const router = express.Router();

router.get('/get/globalExercise', verifyToken, controller.getAllGlobalExercises);

router.post('/create/globalExercise', verifyToken, controller.createGlobalExercise);

export = router;
