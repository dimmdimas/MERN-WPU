import mongoose from "mongoose";
import { encrypt } from "../untils/encryption";
import { sendMail, renderMailHtml } from "../untils/mail/mail";
import { CLIENT_HOST, EMAIL_SMTP_USER } from "../untils/env";

export interface User {
    fullName: string;
    username: string;
    email: string;
    password: string;
    role: string;
    profilePicture: string;
    isActivated: boolean;
    activationCode: string;
    createdAt?: Date;
};

const Schema = mongoose.Schema;

const UserSchema = new Schema<User>({
    fullName: {
        type: Schema.Types.String,
        required: true
    },
    username: {
        type: Schema.Types.String,
        required: true,
        unique: true
    },
    email: {
        type: Schema.Types.String,
        required: true,
        unique: true
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

UserSchema.pre("save", function (next) {
    const user = this;

    user.password = encrypt(user.password);
    user.activationCode = encrypt(user.id);

    console.log(user.id, user.activationCode, user.username);
    next();
});

UserSchema.post("save", async function (doc, next) {
    try {
        const user = doc;

        console.log('Send Email', user);

        const contentMail = await renderMailHtml('registration-success', {
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
            activationLink: `${CLIENT_HOST}/auth/activation?code=${user.activationCode}`

        });

        await sendMail({
            from: EMAIL_SMTP_USER,
            to: user.email,
            subject: 'Account Activation',
            html: contentMail
        });
    } catch (error) {
        console.error(error);
    } finally {
        next();
    }
});

UserSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;