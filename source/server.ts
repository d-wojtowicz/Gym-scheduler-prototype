// TODO: Refactor page routes, controllers; include EJS.
// TODO!!!: Take interest in a token (Should all information be sent in token? If yes - fix reading in .js files)
import * as path from 'path';
import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import logging from './config/logging';
import config from './config/config';
import mongoose from 'mongoose';
import trainingRoutes from './routes/training';
import privateExerciseRoutes from './routes/privateUserExercise';
import globalExerciseRoutes from './routes/globalUserExercise';
import userRoutes from './routes/user';
import training from './controllers/training';
import { verify } from 'jsonwebtoken';
import verifyToken from '../public/js/verifyToken';

const NAMESPACE = 'Server';
const router = express();

/** Configure the EJS */
router.set('view engine', 'ejs');
router.set('views', path.join(__dirname, '../views'));
router.use(express.static(path.join(__dirname, '../public')));

/** Connect to Mongo */
mongoose
    .connect(config.mongo.url, config.mongo.options)
    .then((result) => {
        logging.info(NAMESPACE, 'Connected to mongoDB!');
    })
    .catch((error) => {
        logging.error(NAMESPACE, error.message, error);
    });

/** Logging the request */
router.use((req, res, next) => {
    logging.info(NAMESPACE, `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
        logging.info(NAMESPACE, `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}], STATUS - [${res.statusCode}]`);
    });

    next();
});

/** Parse the request */
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

/** Rules of our API */
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST PUT');
        return res.status(200).json({});
    }

    next();
});

/** Routes of our API*/
router.use('/api', privateExerciseRoutes);
router.use('/api', globalExerciseRoutes);
router.use('/api', trainingRoutes);
router.use('/api', userRoutes);

/** Routes of our site */
router.get('/', (req, res) => res.render('pages/login'));
router.get('/login', (req, res) => res.render('pages/login'));
router.get('/register', (req, res) => res.render('pages/register'));
router.get('/dashboard', (req, res) => res.render('pages/dashboard'));
router.get('/dashboard/:date', (req, res) => res.render('pages/training', { trainingDate: req.params.date }));

/** Create the server */
const httpServer = http.createServer(router);
httpServer.listen(config.server.port, () => logging.info(NAMESPACE, `Server running on ${config.server.hostname}:${config.server.port}`));
