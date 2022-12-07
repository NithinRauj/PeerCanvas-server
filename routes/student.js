const express = require('express');
const mongoose = require('mongoose');
const studentRouter = express.Router();
const Course = require('../models/Course');
const Submission = require('../models/Submission');
const { Student } = require('../models/User');

studentRouter.post('/enroll', async (req, res) => {
    try {
        const data = req.body;
        const userId = new mongoose.Types.ObjectId(req.user.userId);
        await Student.updateOne({ id: userId }, { $addToSet: { courses: [data.courseId] } });
        return res.status(201).json({ err: false, msg: 'Enrolled in course!' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ err: true, msg: err });
    }
});

studentRouter.get('/enrolledCourses', async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.userId);
        const student = await Student.findOne({ id: userId });
        let courses = [];
        for (let id of student.courses) {
            console.log(id);
            const course = await Course.findOne({ _id: new mongoose.Types.ObjectId(id) });
            courses.push(course);
        }
        return res.status(200).json({ err: false, data: courses });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ err: true, msg: err });
    }
});

studentRouter.post('/uploadSubmission', async (req, res) => {
    try {
        const submissionData = req.body;
        const submission = new Submission({ ...submissionData, grade: 0 });
        await submission.save();
        return res.status(201).json({ err: false, msg: 'Created submission' });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ err: true, msg: e });
    }
});

module.exports = studentRouter;