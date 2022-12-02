const express = require('express');
const { Student, Professor } = require('../models/User');
const userRouter = express.Router();

userRouter.post('/createAcc', async (req, res) => {
    try {
        const data = req.body;
        const dbData = { name: data.name, deptId: data.deptId };
        if (data.accountType === 'student') {
            const student = Student(dbData);
            student.save();
        } else {
            const professor = Professor(dbData);
            professor.save();
        }
        return res.status(201).json({ err: false, msg: 'Account created' });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ err: true, msg: e });
    }
});

module.exports = userRouter;