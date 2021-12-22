const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    _listId:{
        type: mongoose.Types.ObjectId,
        required: true

    },
    title:{
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed:{
        type: Boolean,
        default: false,
    }
})

const Task = mongoose.model('Tasks', TaskSchema);

module.exports = {Task}