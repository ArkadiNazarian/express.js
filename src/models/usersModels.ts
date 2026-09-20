import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: [true, 'Email already exists'],
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        select: false
    },
    confirm_password: {
        type: String,
        required: [true, 'Please provide a confirm password'],
        validate: {
            validator: function (val: string) {
                return val === this.password
            },
            message: "Password and confirm password must match"
        }
    },
    photo: String
});

userSchema.pre('save', async function () {

    if (!this.isModified('password')) return;

    this.password = await bcrypt.hash(this.password, 12);
    this.confirm_password = '';

})

export const User = mongoose.model('User', userSchema);