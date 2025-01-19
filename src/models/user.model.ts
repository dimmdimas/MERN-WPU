import mongoose from "mongoose";
import { encrypt } from "../untils/encryption";

export interface User {
    fullName: string;
    username: string;
    email: string;
    password: string;
    role: string;
    profilePicture: string;
    isActivated: boolean;
    activationCode: string;
};

const Schema = mongoose.Schema;

const UserSchema = new Schema<User>({
    fullName: {
        type: Schema.Types.String,
        required: true
    },
    username: {
        type: Schema.Types.String,
        required: true
    },
    email: {
        type: Schema.Types.String,
        required: true
    },
    password: {
        type: Schema.Types.String,
        required: true
    },
    role: {
        type: Schema.Types.String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    profilePicture: {
        type: Schema.Types.String,
        default: "user.jpg"
    },
    isActivated: {
        type: Schema.Types.Boolean,
        default: false
    },
    activationCode: {
        type: Schema.Types.String,
    }
}, {
    timestamps: true
});

UserSchema.pre("save", function (next){
    const user = this;

    user.password = encrypt(user.password);
    next();
});

UserSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;