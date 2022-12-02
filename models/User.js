const mongoose = require('mongoose');
const { Schema } = mongoose;

const professorSchema = new Schema({
    name: { type: String, required: true },
    deptId: { type: mongoose.SchemaTypes.ObjectId, required: true },
    courses: [{ type: String }]
});

const studentSchema = new Schema({
    name: { type: String, required: true },
    deptId: { type: mongoose.SchemaTypes.ObjectId, required: true },
    courses: [{ type: String }]
});

module.exports = {
    Professor: mongoose.model('Professor', professorSchema),
    Student: mongoose.model('Student', studentSchema)
};