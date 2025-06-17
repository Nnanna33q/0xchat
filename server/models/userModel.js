import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    address: {
        type: String,
        unique: true
    },
    registrationDate: Date,
    lastLogin: Date,
    online: Boolean,
    avatar: {
        type: String,
        default: ''
    }
})

export const User = mongoose.model('User', userSchema);