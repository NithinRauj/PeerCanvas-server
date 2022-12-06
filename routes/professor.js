const express = require('express');
const mongoose = require('mongoose');
const profRouter = express.Router();
const Assignment = require('../models/Assignment');
const Course = require('../models/Course');
const { Professor } = require('../models/User');


profRouter.post('/createCourse', async (req, res) => {
    try {
        const data = req.body;
        const profId = new mongoose.Types.ObjectId(data.createdBy);
        const deptId = new mongoose.Types.ObjectId(data.deptId);

        const prof = await Professor.findOneAndUpdate({ id: profId, deptId }, { courses: [data.courseCode] });
        if (prof) {
            const course = Course({
                name: data.courseName,
                courseCode: data.courseCode,
                deptId: data.deptId,
                createdBy: data.createdBy
            });
            await course.save();

            return res.status(201).json({ err: false, msg: 'Created Course' });
        } else {
            return res.status(404).json({ err: true, msg: 'Course can\'t be created' });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({ err: true, msg: e });
    }
});

profRouter.post('/createAssignment', async (req, res) => {
    try {
        const deptId = req.user.deptId;
        const data = req.body;
        const assignmentData = { name: data.name, courseId: data.courseId, deptId, fileCid: data.cid };
        const assignment = new Assignment(assignmentData);
        await assignment.save();
        return res.status(201).json({ err: false, msg: 'Created assignment' });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ err: true, msg: e });
    }
});

module.exports = profRouter;