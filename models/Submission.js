const mongoose = require('mongoose');
const { Schema } = mongoose;

const submissionSchema = Schema({
    userName: { type: String, required: true, },
    userId: { type: mongoose.SchemaTypes.ObjectId, required: true, },
    courseId: { type: mongoose.SchemaTypes.ObjectId, required: true },
    assignmentId: { type: mongoose.SchemaTypes.ObjectId, required: true },
    fileCid: { type: String, required: true }
});

module.exports = mongoose.model('Submission', submissionSchema);