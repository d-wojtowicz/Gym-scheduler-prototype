import express from 'express';
import controller from '../controllers/user';

const router = express.Router();

router.get('/get/users', controller.getAllUsers);
router.get('/get/user/:_id', controller.getUserByID);

router.post('/create/user', controller.createUser);
router.post('/login', controller.loginUser);

router.put('/update/user/:_id', controller.updateUser);

router.delete('/delete/user/:_id', controller.deleteUser);

export = router;
