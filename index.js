const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const studentRouter = require('./routes/student');

const PORT = 5000;
const app = express();

dotenv.config();
app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload({ useTempFiles: true, tempFileDir: '/tmp/' }));

app.use('/student', studentRouter);

app.listen(PORT, () => {
    console.log('Server running in port 5000');
});
