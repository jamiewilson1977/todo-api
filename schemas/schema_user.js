module.exports.userSchema = {
    email: {
        type: String,
        hashKey: true,
        minlength: 1,
        trim: true
    }
};
