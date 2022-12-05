const mongoose = require('mongoose');
const { Schema } = mongoose;

const assignmentSchema = Schema({
    name: { type: String, required: true, unique: true },
    courseId: { type: mongoose.SchemaTypes.ObjectId, required: true },
    deptId: { type: mongoose.SchemaTypes.ObjectId, required: true },
    fileCid: { type: String, required: true }
});

module.exports = mongoose.model('Assignment', assignmentSchema);