const express = require('express');
const { unlink } = require('fs');
const mongoose = require('mongoose');
const profRouter = express.Router();
const path = require('path');
const { Web3Storage, getFilesFromPath } = require('web3.storage');
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

profRouter.post('/uploadAssignment', async (req, res) => {
    try {
        const deptId = req.user.deptId;
        const data = req.body;
        const fileData = req.files.assignment;
        const uploadPath = path.join(__dirname, '../', 'tmp/', fileData.name);

        fileData.mv(uploadPath, (err) => {
            if (err) {
                console.log('File upload error', err);
            }
        });
        const file = await getFilesFromPath(uploadPath);
        const client = new Web3Storage({ token: process.env.IPFS_STORAGE_TOKEN });
        const cid = await client.put(file, { name: fileData.name });
        const assignmentData = { name: data.name, courseId: data.courseId, deptId, fileCid: cid };
        const assignment = new Assignment(assignmentData);
        await assignment.save();

        unlink(uploadPath, (err) => {
            if (err) {
                console.log('Error deleting file');
            } else {
                console.log('File deleted from temp directory');
            }
        });
        return res.status(201).json({ err: false, msg: 'Created assignment' });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ err: true, msg: e });
    }
});

module.exports = profRouter;