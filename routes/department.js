const express = require('express');
const mongoose = require('mongoose');
const deptRouter = express.Router();
const Department = require('../models/Department');
const Course = require('../models/Course');
const { validateToken } = require('../services/auth');
const Assignment = require('../models/Assignment');

deptRouter.get('/all', async (req, res) => {
    try {
        const depts = await Department.find({});
        return res.status(200).json({ err: false, depts });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ err: true, msg: e });
    }
});

deptRouter.get('/courses', validateToken, async (req, res) => {
    try {
        const { userId, deptId } = req.user;

        const courses = await Course.find({ createdBy: userId, deptId });
        return res.status(200).json({ err: false, data: courses });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ err: true, msg: e });
    }
});

deptRouter.get('/assignments/:courseId', validateToken, async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const assignments = await Assignment.find({ courseId });
        return res.status(200).json({ err: false, data: assignments });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ err: true, msg: e });
    }
});

deptRouter.get('/courses/enrollments', validateToken, async (req, res) => {
    try {
        const { userId, deptId } = req.user;

        const courses = await Course.find({ deptId });
        return res.status(200).json({ err: false, data: courses });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ err: true, msg: e });
    }
});

deptRouter.get('/course/:id', validateToken, async (req, res) => {
    try {
        const { deptId } = req.user;
        const courseId = new mongoose.Types.ObjectId(req.params.id);

        const course = await Course.findOne({ courseId, deptId });
        return res.status(200).json({ err: false, data: course });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ err: true, msg: e });
    }
});

module.exports = deptRouter;