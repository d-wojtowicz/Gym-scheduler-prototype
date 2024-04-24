import express from 'express';
import mongoose from 'mongoose';
import controller from '../controllers/privateUserExercise';

const router = express.Router();

router.get('/get/privateExercise', controller.getAllPrivateExercises);

router.post('/create/privateExercise', controller.createPrivateExercise);

router.patch('/patch/privateExercise', controller.addCustomExercise);

export = router;
