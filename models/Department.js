const mongoose = require('mongoose');
const { Schema } = mongoose;

const departmentSchema = Schema({
    name: { type: String, required: true }
});

module.exports = mongoose.model('Department', departmentSchema);