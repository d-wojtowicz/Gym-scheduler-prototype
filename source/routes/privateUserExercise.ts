import express from 'express';
import mongoose from 'mongoose';
import controller from '../controllers/privateUserExercise';
import verifyToken from '../../public/js/verifyToken';

const router = express.Router();

router.get('/get/privateExercise', verifyToken, controller.getAllPrivateExercises);

router.post('/create/privateExercise', controller.createPrivateExercise);

router.put('/patch/privateExercise', verifyToken, controller.addCustomExercise);

export = router;
