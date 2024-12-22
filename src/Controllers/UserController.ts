import {Response, Request, NextFunction} from "express";
import {DBConfig} from "../Utils/DBConfig";
import bcrypt from "bcryptjs";
import {getUserByEmail, createUser, UserData} from "../Services/userService";
import nodemailer from 'nodemailer';


export class UserController {
    // /user/login
    async logIn(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const { email, password } = req.body;
        console.log(email, password);

        if (!email || !password) {
            return res.status(400).json({ error: "Email and Password are required" });
        }

        try {
            // Kiểm tra người dùng từ database
            const user = await getUserByEmail(email);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            // Kiểm tra mật khẩu người dùng
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: "Password is incorrect" });
            }

            // Lưu thông tin người dùng vào session
            req.session.authUser = user;
            console.log(req.session.authUser);

            // Redirect về URL trước đó nếu có
            const retUrl = req.session.retUrl || '/';
            req.session.retUrl = undefined;
            return res.redirect(retUrl);

        } catch (error) {
            console.error("Login Error:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    // /user/register
    async register(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const { email, password, fullname}: { email: string, password: string, fullname: string} = req.body;

        const dob = new Date().toISOString().slice(0, 10);
        const isAdministator = false;
        
        console.log(email, password, fullname, dob, isAdministator);

        // Kiểm tra các trường dữ liệu
        if (!email || !password || !fullname || !dob || typeof isAdministator === 'undefined') {
            return res.status(400).json({ error: "All fields are required" });
        }

        try {
            // Kiểm tra xem người dùng đã tồn tại chưa
            const userExists = await DBConfig("USER").where("Email", email).first();
            if (userExists) {
                return res.status(400).json({ error: "Email already in use" });
            }

            // Mã hóa mật khẩu
            const hashedPassword = await bcrypt.hash(password, 10);

            // Tạo người dùng mới
            const newUser: UserData = {
                id: Date.now(),  // Tạo ID theo thời gian (hoặc bạn có thể dùng UUID hoặc auto increment từ DB)
                fullname,
                email,
                password: hashedPassword,
                dob : dob,
                isAdministator: isAdministator ? 1 : 0, // Nếu là admin thì là 1, ngược lại là 0
            };

            // Tạo mới người dùng trong DB
            await createUser(newUser);

            // Lưu thông tin người dùng vào session sau khi đăng ký thành công
            req.session.authUser = newUser;

            // Redirect đến trang profile hoặc trang chính
            return res.redirect('/home');
        } catch (error) {
            console.error("Registration Error:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
    
    // /user/forgot-password/
    async forgotPassword(req: Request, res: Response) {
        const userId = req.params.id;
        console.log(req.session.authUser);
        res.render('User/ForgotPasswordView',{
            customCss: ['User.css']});
    }

    async forgotPasswordPost(req: Request, res: Response) {
        const { otp, newPassword, otpCheck, email, expires } = req.body;
        if(otp != otpCheck) {
            res.render('User/ForgotPasswordView', {
                customCss: ['User.css'],
                errorOTP: 'Mã OTP không chính xác, vui lòng thử lại.',
                otp: {
                    email,
                    OTP: otp,
                    OTPExpires: expires,
                }
            });
        }

        if (new Date() > new Date(expires)) {
            res.render('User/ForgotPasswordView', {
                customCss: ['User.css'],
                errorOTP: 'Mã OTP đã hết hạn, vui lòng thử lại.',
                otp: {
                    email,
                    OTP: otp,
                    OTPExpires: expires,
                }
            });
        }

        try {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await DBConfig("USER").where("Email", email).update({ Password: hashedPassword });

            res.render('User/ForgotPasswordView', {
                customCss: ['User.css'],
                message: 'Mật khẩu đã được thay đổi thành công!',
            });
        } catch (error) {
            console.error("Forgot Password Error:", error);
            res.render('User/ForgotPasswordView', {
                customCss: ['User.css'],
                error: 'Không thể thay đổi mật khẩu, vui lòng thử lại sau.',
            });
        }
    }

    // /user/forgot-password-email/
    async forgotPasswordEmail(req: Request, res: Response) {
        const userId = req.params.id;
        console.log(req.session.authUser);

        res.render('User/ForgotPasswordEmailView',{
            customCss: ['User.css']});
    }

    async forgotPasswordEmailPost(req: Request, res: Response) {
        const { email } = req.body;

        const user = await DBConfig("USER").where("Email", email).first();
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
                message: 'Email đã được gửi, vui lòng kiểm tra hòm thư của bạn!',
                otp: {
                    email,
                    OTP,
                    OTPExpires,
                }
            });
        } catch (error) {
            console.error('Error sending email:', error);

            res.render('User/ForgotPasswordView', {
                customCss: ['User.css'],
                error: 'Không thể gửi email, vui lòng thử lại sau.',
            });
        }
    }

    // /user/profile/:id
    getUserProfile(req: Request, res: Response) {
        const userId = req.params.id;
        res.render('User/UserProfileView', {
            customCss: ['User.css']});
    }

    // /user/reset-password
    resetPassword(req: Request, res: Response) {

    }

    // /user/reset-password-by-otp
    resetPasswordByOTP(req: Request, res: Response) {

    }

    // /user/send-otp
    sendOTP(req: Request, res: Response) {

    }
}
