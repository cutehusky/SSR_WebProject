import { NextFunction, Request, Response } from 'express';
import { DBConfig } from '../Utils/DBConfig';
import bcrypt from 'bcryptjs';
import * as userService from '../Services/UserPasswordService';
import { UserRole } from '../Models/UserData';
import { addPremium, createUser } from '../Services/AdminUserService';
import nodemailer from 'nodemailer';

export class UserController {
    //Kiểm tra người dùng đã đăng nhập chưa
    isLoggedIn(req: Request, res: Response, next: NextFunction) {
        if (!req.session.authUser) {
            return res.redirect('/');
        }
        next();
    }
    // /user/login
    async logIn(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ error: 'Email and Password are required' });
        }

        try {
            // Kiểm tra người dùng từ database
            const user = await userService.getUserByEmail(email);

            if (!user || user.role === UserRole.Invalid) {
                return res.status(404).json({
                    error: 'User not found',
                    message: 'Please check your email',
                });
            }

            // Kiểm tra mật khẩu người dùng
            const isPasswordValid = await bcrypt.compare(
                password,
                user.password
            );
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Password is incorrect' });
            }

            // Lưu thông tin người dùng vào session
            req.session.authUser = user;

            // Redirect về URL trước đó nếu có
            const retUrl = req.session.retUrl || '/';
            req.session.retUrl = undefined;
            // return res.redirect(retUrl);
            return res.status(200).json({ successUrl: retUrl });
        } catch (error) {
            console.error('Login Error:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    // /user/register
    async register(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> {
        const {
            email,
            password,
            fullname,
        }: { email: string; password: string; fullname: string } = req.body;
        console.log(email, password, fullname);

        const dob = new Date().toISOString().slice(0, 10);

        // Kiểm tra các trường dữ liệu
        if (!email || !password || !fullname || !dob) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Kiểm tra user có bị trùng email (tồn tại) hay không
        const user = await userService.getUserByEmail(email);

        if (user) {
            return res.status(409).json({
                error: 'Account already exists',
                message: 'Please check your email',
            });
        }

        try {
            // Mã hóa mật khẩu
            const hashedPassword = await bcrypt.hash(password, 10);

            // Tạo người dùng mới
            const newUser = {
                fullname,
                email,
                password: hashedPassword,
                dob: dob,
                role: UserRole.User,
            };

            // Tạo mới người dùng trong DB
            await createUser(newUser, null);
            const userDb = await userService.getUserByEmail(email);

            // Lưu thông tin người dùng vào session sau khi đăng ký thành công
            req.session.authUser = userDb;
            // Redirect đến trang cập nhật thông tin người dùng
            // res.redirect('/user/profile');
            return res.status(200).json({ successUrl: '/user/profile' });
        } catch (error) {
            console.error('Registration Error:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    // /user/register-with-google
    async googleRegister(req: Request, res: Response): Promise<void> {
        // console.log(req.user);

        const { displayName, email } = req.user as {
            displayName: string;
            email: string;
        };

        if (!displayName || !email) {
            res.redirect('/404');
        }

        try {
            // Check the existance of the user
            const user = await userService.getUserByEmail(email);

            if (!user) {
                const newUser = {
                    fullname: displayName,
                    email: email,
                    passowrd: null,
                    dob: null,
                    role: 'User',
                };
                console.log(newUser);

                await createUser(newUser, null);

                const userDB = await userService.getUserByEmail(email);
                console.log(userDB);

                if (!userDB) {
                    res.redirect('/404');
                }

                req.session.authUser = userDB;

                // Redirect về URL trước đó nếu có
                const retUrl = req.session.retUrl || '/';
                req.session.retUrl = undefined;

                if (
                    req.session.authUser &&
                    req.session.authUser.role === UserRole.Editor
                )
                    req.session.retUrl = '/editor/articles';

                res.redirect(retUrl);
            } else {
                // Lưu thông tin người dùng vào session sau khi đăng ký thành công
                req.session.authUser = user;

                // Redirect về URL trước đó nếu có
                const retUrl = req.session.retUrl || '/';
                req.session.retUrl = undefined;
                if (req.session.authUser.role === UserRole.Editor)
                    req.session.retUrl = '/editor/articles';
                res.redirect(retUrl);
            }
        } catch (error) {
            res.redirect('/404');
        }
    }

    // /user/forgot-password/
    async forgotPassword(req: Request, res: Response) {
        const userId = req.params.id;
        res.render('User/ForgotPasswordView', {
            customCss: ['User.css'],
        });
    }

    async forgotPasswordPost(req: Request, res: Response) {
        const { otp, newPassword, email } = req.body;
        const user = await DBConfig('user').where('Email', email).first();
        if (otp != user.otp) {
            res.render('User/ForgotPasswordView', {
                customCss: ['User.css'],
                errorOTP: 'Mã OTP không chính xác, vui lòng thử lại.',
                otp: {
                    email,
                    OTP: otp,
                    OTPExpires: user.otpExpiration,
                },
            });
        }
        if (new Date() > new Date(user.otpExpiration)) {
            res.render('User/ForgotPasswordView', {
                customCss: ['User.css'],
                errorOTP: 'Mã OTP đã hết hạn, vui lòng thử lại.',
                otp: {
                    email,
                    OTP: otp,
                    OTPExpires: user.otpExpiration,
                },
            });
        }
        try {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await DBConfig('user').where('Email', email).update({
                Password: hashedPassword,
                otp: null,
                otpExpiration: null,
            });
            res.render('User/ForgotPasswordView', {
                customCss: ['User.css'],
                message: 'Mật khẩu đã được thay đổi thành công!',
            });
        } catch (error) {
            console.error('Forgot Password Error:', error);
            res.render('User/ForgotPasswordView', {
                customCss: ['User.css'],
                error: 'Không thể thay đổi mật khẩu, vui lòng thử lại sau.',
            });
        }
    }
    // /user/forgot-password-email/
    async forgotPasswordEmail(req: Request, res: Response) {
        if (req.session.authUser) {
            req.session.authUser = null;
        }
        res.render('User/ForgotPasswordEmailView', {
            customCss: ['User.css'],
        });
    }
    async forgotPasswordEmailPost(req: Request, res: Response) {
        const { email } = req.body;
        const user = await DBConfig('user').where('Email', email).first();
        if (!user) {
            return res.render('User/ForgotPasswordEmailView', {
                customCss: ['User.css'],
                error: 'Email không tồn tại trong hệ thống.',
            });
        }
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'nguyengiakiet0987654321@gmail.com',
                pass: 'fxqi kcba bklr wpvj',
            },
            logger: true,
            debug: true,
        });
        try {
            const OTP = Math.floor(100000 + Math.random() * 900000);
            const OTPExpires = new Date(Date.now() + 3 * 60 * 60 * 1000); // 3 giờ

            // Lưu OTP vào database
            await DBConfig('user')
                .where('Email', email)
                .update({ otp: OTP, otpExpiration: OTPExpires });

            // Gửi email
            const info = await transporter.sendMail({
                from: '"Reset password" <nguyengiakiet0987654321@gmail.com>',
                to: email,
                subject: 'SSR | OTP',
                text: 'Đây là email để lấy lại mật khẩu của bạn.',
                html: `
                    <p>Dear ${email},</p>
                    <p>You have selected ${email} as your name verification page:</p>
                    <h1> ${OTP} </h1>
                    <p>This code will expire three hours after this email was sent</p>
                    <p>If you did not make this request, you can ignore this</p>
                `,
            });
            console.log('Email sent: ' + info.response);

            res.render('User/ForgotPasswordView', {
                customCss: ['User.css'],
                message:
                    'Email đã được gửi, vui lòng kiểm tra hòm thư của bạn!',
                otp: {
                    email,
                },
            });
        } catch (error) {
            console.error('Error sending email:', error);
            res.render('User/ForgotPasswordView', {
                customCss: ['User.css'],
                error: 'Không thể gửi email, vui lòng thử lại sau.',
            });
        }
    }
    // /user/resent-otp
    async resentOTP(req: Request, res: Response) {
        const { email } = req.body;
        const user = await DBConfig('user').where('Email', email).first();
        if (!user) {
            return res.render('User/ForgotPasswordEmailView', {
                customCss: ['User.css'],
                error: 'Email không tồn tại trong hệ thống.',
            });
        }
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'nguyengiakiet0987654321@gmail.com',
                pass: 'fxqi kcba bklr wpvj',
            },
            logger: true,
            debug: true,
        });
        try {
            const OTP = user.otp;
            // Gửi email
            const info = await transporter.sendMail({
                from: '"Reset password" <nguyengiakiet0987654321@gmail.com>',
                to: email,
                subject: 'SSR | OTP',
                text: 'Đây là email để lấy lại mật khẩu của bạn.',
                html: `
                    <p>Dear ${email},</p>
                    <p>You have selected ${email} as your name verification page:</p>
                    <h1> ${OTP} </h1>
                    <p>This code will expire three hours after this email was sent</p>
                    <p>If you did not make this request, you can ignore this</p>
                `,
            });
            console.log('Email sent: ' + info.response);

            res.render('User/ForgotPasswordView', {
                customCss: ['User.css'],
                message:
                    'Email đã được gửi, vui lòng kiểm tra hòm thư của bạn!',
                otp: {
                    email,
                },
            });
        } catch (error) {
            console.error('Error sending email:', error);
            res.render('User/ForgotPasswordView', {
                customCss: ['User.css'],
                error: 'Không thể gửi email, vui lòng thử lại sau.',
            });
        }
    }

    // /user/profile
    async getUserProfile(req: Request, res: Response) {
        if (!req.session.authUser) {
            res.redirect('/404');
            return;
        }
        const Profile = await userService.getProfile(req.session.authUser.id);
        res.render('User/UserProfileView', {
            customCss: ['User.css'],
            Profile,
        });
    }

    // /user/reset-password
    async resetPassword(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> {
        try {
            // Check if user is logged in
            const user = req.session.authUser;
            if (!user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const { oldPassword, newPassword } = req.body;
            console.log(oldPassword, newPassword);

            // Check if current password is correct
            const isPasswordValid = await bcrypt.compare(
                oldPassword,
                user.password
            );
            if (!isPasswordValid) {
                return res
                    .status(400)
                    .json({ error: 'Current password is incorrect' });
            }

            // Update the password
            await userService.updatePassword(user, newPassword);
            res.redirect('/user/profile');
            // return res
            //     .status(200)
            //     .json({ message: 'Password reset successfully' });
        } catch (error) {
            next(error);
        }
    }

    // /user/reset-password-by-otp
    async resetPasswordByOTP(req: Request, res: Response) {
        try {
            const { email, otp, newPassword } = req.body;

            const isOTPValid = userService.verifyOTP(email, otp);
            if (!isOTPValid) {
                return res.status(400).json({ error: 'Invalid OTP' });
            }

            // Update the password
            await userService.updatePassword(email, newPassword);
            return res
                .status(200)
                .json({ message: 'Password reset successfully' });
        } catch (error) {
            console.error('Reset Password Error:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    // /user/send-otp
    async sendOTP(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> {
        try {
            const { email } = req.body;
            // console.log(email);
            await userService.sendOTP(email);
            return res.status(200).json({ message: 'OTP sent successfully' });
        } catch (error) {
            console.error('Send OTP Error:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    // /user/update-profile
    async updateProfile(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> {
        try {
            // Check if user is logged in
            if (!req.session.authUser) {
                res.redirect('/404');
                return;
            }

            const user = req.session.authUser;
            if (!user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const { email, name, dob } = req.body;
            // console.log(email, name, dob);

            // Check if email already exists
            const userInfo = await userService.getUserByEmail(email);
            const originalEmail = req.session.authUser.email;

            if (userInfo && userInfo.email !== originalEmail) {
                if (!req.session.authUser) {
                    res.redirect('/404');
                    return;
                }

                const Profile = await userService.getProfile(
                    req.session.authUser.id
                );

                Profile.email = email;

                return res.render('User/UserProfileView', {
                    errorEmail: true,
                    Profile,
                    customCss: ['User.css'],
                });
            }

            await userService.updateProfile(user.id, email, name, dob);

            if (user.role === UserRole.Writer) {
                const penName = req.body.penName as string;
                if (!penName) return;
                const exist = await DBConfig('writer')
                    .where('WriterID', user.id)
                    .first();
                if (exist)
                    await DBConfig('writer')
                        .where('WriterID', user.id)
                        .update({ Alias: penName });
                else
                    await DBConfig('writer').insert({
                        WriterID: user.id,
                        Alias: penName,
                    });
            }
            res.redirect('/user/profile');
        } catch (error) {
            console.error('Update Profile Error:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async addPremium(req: Request, res: Response) {
        if (
            !req.session.authUser ||
            req.session.authUser.role !== UserRole.User
        ) {
            res.redirect('/404');
            return;
        }
        await addPremium(req.session.authUser.id);
        const referer = req.get('Referer') || '/';
        res.redirect(referer);
    }
}
