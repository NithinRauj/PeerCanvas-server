const express = require('express');
const authRouter = express.Router();
const bcrypt = require('bcrypt');
const { Student, Professor } = require('../models/User');
const { generateToken } = require('../services/auth');


authRouter.post('/signup', async (req, res) => {
    try {
        let userData = req.body;
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        userData = {
            ...userData,
            password: hashedPassword
        };
        console.log(userData);
        if (userData.accountType === 'student') {
            const student = Student(userData);
            student.save();
        } else {
            const professor = Professor(userData);
            professor.save();
        }
        return res.status(201).json({ err: false, msg: 'signup successful!' });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ err: true, msg: e });
    }

});

authRouter.post('/signin', async (req, res) => {
    try {
        const data = req.body;
        const user = data.accountType === 'student' ? await Student.findOne({ name: data.name }) : await Professor.findOne({ name: data.name });
        if (!user) {
            return res.status(404).send({ err: true, msg: 'user not found' });
        } else {
            console.log(user.password, data.password)
            const isValid = await bcrypt.compare(data.password, user.password);
            if (isValid) {
                const accessToken = generateToken({ name: user.name, password: user.password });
                const userData = { name: user.name, userId: user.id, deptId: user.deptId, accessToken, type: data.accountType };
                return res.status(200).send({ err: false, msg: 'signin successful!', userData });
            } else {
                return res.status(404).send({ err: true, msg: 'invalid credentials' });
            }
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({ err: true, msg: e });
    }

});

authRouter.post('/logout', async (req, res) => {
    return res.status(200).send({ err: true, msg: 'logged out!' });
});

module.exports = authRouter;