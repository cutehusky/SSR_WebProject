import { DBConfig as db } from '../Utils/DBConfig';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import { UserData, UserRole } from '../Models/UserData';
import { getRoleName } from '../Utils/getRole';

export const getUsernameById = async (id: number): Promise<string> => {
    const user = await db('user').where('UserID', id).first();
    if (!user) return '';
    return user.FullName;
};

export const getWriterNameById = async (id: string): Promise<string> => {
    const user = await db('writer').where('WriterID', id).first();
    if (!user) return '';
    return user.Alias;
};

export const GetRoleOfUserById = async (userId: string) => {
    const user = await db('user').where('UserID', userId).first();
    if (!user) return UserRole.Invalid;
    if (user.isAdministator) return UserRole.Admin;
    const isWriter = await db('writer')
        .where('WriterID', userId)
        .count('* as num')
        .first();
    if (isWriter && isWriter.num === 1) return UserRole.Writer;
    const isEditor = await db('editor')
        .where('EditorID', userId)
        .count('* as num')
        .first();
    if (isEditor && isEditor.num === 1) return UserRole.Editor;
    const isUser = await db('subscriber')
        .where('SubscriberID', userId)
        .count('* as num')
        .first();
    if (isUser && isUser.num === 1) return UserRole.User;
    return UserRole.Invalid;
};

export const getUserByEmail = async (
    email: string
): Promise<UserData | null> => {
    let user = await db('user')
        .where('Email', email)
        .select(
            'UserID as id',
            'FullName as fullname',
            'Email as email',
            'Password   as password',
            db.raw("DATE_FORMAT(Dob, '%d/%m/%Y') as dateOfBirth"),
            db.raw(
                "CASE Role WHEN 0 THEN 'User' WHEN 1 THEN 'Writer' WHEN 2 THEN 'Editor' WHEN 3 THEN 'Admin' ELSE 'Invalid' END as role"
            )
        )
        .first();

    if (!user) return null;
    if (user.role === 'Writer') {
        let writer = await db('writer').where({ WriterID: user.id }).first();
        return {
            id: user.id,
            fullname: user.fullName,
            email: user.email,
            password: user.password,
            dob: user.dateOfBirth,
            role: user.role,
            penName: writer.Alias,
        };
    }
    return {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        password: user.password,
        dob: user.dateOfBirth,
        role: user.role,
    };
};

export const updatePassword = async (
    userData: any,
    newPassword: string
): Promise<void> => {
    try {
        // Kiểm tra xem user có tồn tại không
        const user = await db('user').where('Email', userData.email).first();
        if (!user) {
            throw new Error(
                `User with email ${userData.email} does not exist.`
            );
        }
        const hashPassword = await bcrypt.hash(newPassword, 10);

        userData.password = hashPassword;

        // Update password trong database
        await db('user').where('Email', userData.email).update({
            Password: hashPassword,
            otp: null, // Clear OTP and expiration time after password reset
            otpExpiration: null,
        });
        console.log('Password updated successfully');
    } catch (error: any) {
        console.log(error);
        throw new Error('Failed to update password.');
    }
};

export const sendOTP = async (email: string): Promise<string> => {
    try {
        // Generate a secure OTP
        const otp = crypto.randomInt(100000, 999999).toString();

        // Hash the OTP before storing it
        // const hashedOtp = await bcrypt.hash(otp, 10);

        // Store hashed OTP in the database with an expiration time
        await db('user')
            .where('Email', email)
            .update({
                otp: otp,
                otpExpiration: new Date(Date.now() + 15 * 60 * 1000), // OTP valid for 15 minutes
            });
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'OTP for password reset',
            text: `Your OTP is ${otp}`,
        };
        await transporter.sendMail(mailOptions);
        return otp;
    } catch (error: any) {
        console.log(error);
        throw new Error('Failed to send OTP.');
    }
};

export const verifyOTP = async (
    email: string,
    otp: string
): Promise<boolean> => {
    try {
        const user = await db('user').where('Email', email).first();
        if (!user) {
            throw new Error('User not found.');
        }

        // Check if OTP is valid and not expired
        const isOtpValid = await bcrypt.compare(otp, user.otp);
        if (isOtpValid && new Date(user.otpExpiration) > new Date()) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        throw new Error('Failed to verify OTP.');
    }
};
export const updateProfile = async (
    id: number,
    email: string,
    name: string | null,
    dob: string | null
): Promise<void> => {
    try {
        // Kiểm tra xem user có tồn tại không
        const userExists = await db('user').where('UserID', id).first();
        if (!userExists) {
            throw new Error(`User with ID ${id} does not exist.`);
        }

        // Update user trong database
        await db('user')
            .where('UserID', id)
            .update({
                FullName: name || null,
                Email: email || null,
                DOB: dob || null,
            });
    } catch (error: any) {
        console.log(error);
        throw new Error('Failed to update user.');
    }
};
export const getProfile = async (
    id: number
): Promise<{
    id: number;
    fullname: string;
    email: string;
    password: string;
    dateOfBirth: string;
    penName?: string;
}> => {
    try {
        // Kiểm tra xem user có tồn tại không
        const user = await db('user')
            .where('UserID', id)
            .select(
                'UserID as id',
                'FullName as fullName',
                'Email as email',
                'Password   as password',
                db.raw("DATE_FORMAT(Dob, '%d/%m/%Y') as dateOfBirth"),
                db.raw(
                    "CASE Role WHEN 0 THEN 'User' WHEN 1 THEN 'Writer' WHEN 2 THEN 'Editor' WHEN 3 THEN 'Admin' ELSE 'Invalid' END as role"
                )
            )
            .first();
        if (!user) {
            throw new Error(`User with ID ${id} does not exist.`);
        }
        return {
            id: user.id,
            fullname: user.fullName,
            email: user.email,
            password: user.password,
            dateOfBirth: user.dateOfBirth,
            penName:
                user.role === 'Writer'
                    ? await getWriterNameById(user.id)
                    : undefined,
        };
    } catch (error: any) {
        console.log(error);
        throw new Error('Failed to get user.');
    }
};
