import express from 'express';
import controller from '../controllers/template';
import verifyToken from '../../public/js/verifyToken';

const router = express.Router();

router.get('/get/template/:templateNum', verifyToken, controller.getTemplate);
router.put('/update/template/:templateNum', verifyToken, controller.updateTemplate);

export = router;
