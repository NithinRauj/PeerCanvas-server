const mongoose = require('mongoose');
const { Schema } = mongoose;

const courseSchema = Schema({
    name: { type: String, required: true, unique: true },
    courseCode: { type: String, required: true, unique: true },
    deptId: { type: mongoose.SchemaTypes.ObjectId, required: true },
    createdBy: { type: mongoose.SchemaTypes.ObjectId, required: true }
});

module.exports = mongoose.model('Course', courseSchema);