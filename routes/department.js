const express = require('express');
const deptRouter = express.Router();
const Department = require('../models/Department');

deptRouter.get('/all', async (req, res) => {
    try {
        const depts = await Department.find({});
        return res.status(200).json({ err: false, depts });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ err: true, msg: e });
    }
});

deptRouter.get('/allCourses', async (req, res) => {
    try {
        const courses = await Course.find({ did: req.body.did });
        return res.status(200).json({ err: false, data: courses });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ err: true, msg: e });
    }
});

module.exports = deptRouter;