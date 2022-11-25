const express = require('express');
const { unlink } = require('fs');
const studentRouter = express.Router();
const path = require('path');
const { Web3Storage, getFilesFromPath } = require('web3.storage');

studentRouter.post('/uploadAssignment', async (req, res) => {
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