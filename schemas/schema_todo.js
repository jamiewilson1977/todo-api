module.exports.todoSchema = {
    id: {
        type: String,
        hashKey: true,
        minlength: 10
    },
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
};
