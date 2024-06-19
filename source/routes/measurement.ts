import express from 'express';
import controller from '../controllers/measurement';
import verifyToken from '../../public/js/verifyToken';

const router = express.Router();

router.get('/get/measurements', verifyToken, controller.getAllMeasurements);

router.put('/patch/measurement', verifyToken, controller.addMeasurement);

export = router;
