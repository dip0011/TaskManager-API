const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    description:{
        type:String,
        required: true,
        trim: true
    },
    compeleted:{
        type:Boolean,
        default: false
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
},{
    timestamps: true
});

// Create tasks collection
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;