const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const studentRouter = require('./routes/student');
const mongoose = require('mongoose');
const profRouter = require('./routes/professor');
const deptRouter = require('./routes/department');
const authRouter = require('./routes/auth');
const { validateToken } = require('./services/auth');

require('dotenv').config();
const PORT = 5000;

const initServer = () => {
    const app = express();

    dotenv.config();
    app.use(logger('dev'));
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(fileUpload({ useTempFiles: true, tempFileDir: '/tmp/' }));

    app.use('/auth', authRouter);
    app.use('/student', validateToken, studentRouter);
    app.use('/prof', validateToken, profRouter);
    app.use('/dept', deptRouter);

    app.listen(PORT, () => {
        console.log('Server running in port 5000');
    });
}

const initDBConnection = () => {
    mongoose.connect('mongodb://127.0.0.1:27017/peercanvas', () => {
        console.log('Connected to DB');
    });
}

initServer();
initDBConnection();