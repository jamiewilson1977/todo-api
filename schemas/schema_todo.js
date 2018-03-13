module.exports.todoSchema = {
    id: {
        type: String,
        hashKey: true
    },
    text: {
        type: String,
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
