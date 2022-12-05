const express = require('express');
const { unlink } = require('fs');
const mongoose = require('mongoose');
const studentRouter = express.Router();
const path = require('path');
const { Web3Storage, getFilesFromPath } = require('web3.storage');
const Course = require('../models/Course');
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
        const fileData = req.files.assignment
        console.log(typeof fileData);
        const STORAGE_TOKEN = process.env.IPFS_STORAGE_TOKEN;

        const uploadPath = path.join(__dirname, '../', 'tmp/', fileData.name);
        fileData.mv(uploadPath, (err) => {
            if (err) {
                console.log('File upload error', err);
            }
        });
        const file = await getFilesFromPath(uploadPath);
        const client = new Web3Storage({ token: STORAGE_TOKEN });
        const cid = await client.put(file, { name: fileData.name });
        console.log(cid);
        unlink(uploadPath, (err) => {
            if (err) {
                console.log('Error deleting file');
            } else {
                console.log('File deleted from temp directory');
            }
        });
        return res.status(201).json({ err: false, msg: 'Uploaded assignment' });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ err: true, msg: e });
    }
});

module.exports = studentRouter;