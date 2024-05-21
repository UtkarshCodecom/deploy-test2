const mongoose = require('mongoose');

// Define the task schema
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        
    },
    description: {
        type: String,
     
    },
    status: {
        type: Number,
        default: 0 // You can define your own status codes, e.g., 0 for pending, 1 for completed, etc.
    },
    users:[
        {
            name:{
                type:String,
            },
            user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Reference to the User model
           
        },
    }
    ],
    deadline: {
        type: Object,
       
    }
}, { timestamps: true });

// Define the Task model
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
