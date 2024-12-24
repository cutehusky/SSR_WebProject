import {NextFunction, Request, Response} from "express";
import {DBConfig} from "../Utils/DBConfig";
import bcrypt from "bcryptjs";
import * as userService  from "../Services/UserPasswordService";
import { UserRole } from "../Models/UserData";
import { UserData } from "../Models/UserData";
import { createUser } from "../Services/AdminUserService";

export class UserController {
    // /user/login
    async logIn(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and Password are required" });
        }

        try {
            // Kiểm tra người dùng từ database
            const user = await userService.getUserByEmail(email);
            if (!user || user.role === UserRole.Invalid) {
                return res.status(404).json({ error: "User not found" });
            }

            // Kiểm tra mật khẩu người dùng
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: "Password is incorrect" });
            }

            // Lưu thông tin người dùng vào session
            req.session.authUser = user;

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

        // Kiểm tra các trường dữ liệu
        if (!email || !password || !fullname || !dob ) {
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
                role: "Subscriber"
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
    forgotPassword(req: Request, res: Response) {
        const userId = req.params.id;
        res.render('User/ForgotPasswordView',{
            customCss: ['User.css']});
    }

    // /user/profile/
    getUserProfile(req: Request, res: Response) {
        res.render('User/UserProfileView', {
            customCss: ['User.css']});
    }

    // /user/reset-password
    async resetPassword(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            // Check if user is logged in
            const user = req.session.authUser;
            if (!user) {
                return res.status(401).json({ error: "Unauthorized" });
            }

            const { oldPassword, newPassword } = req.body;
            console.log(
                oldPassword,
                newPassword
            );

            // Check if current password is correct
            const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ error: "Current password is incorrect" });
            }

            // Update the password
            await userService.updatePassword(user.email, newPassword);
            return res.status(200).json({ message: "Password reset successfully" });
        } catch (error) {
            next(error);
        }
    }

    // /user/reset-password-by-otp
    async resetPasswordByOTP(req: Request, res: Response) {
        try{
            const { email, otp, newPassword } = req.body;

            const isOTPValid = userService.verifyOTP(email, otp);
            if (!isOTPValid) {
                return res.status(400).json({ error: "Invalid OTP" });
            }

            // Update the password
            await userService.updatePassword(email, newPassword);
            return res.status(200).json({ message: "Password reset successfully" });
        } catch (error) {
            console.error("Reset Password Error:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    // /user/send-otp
    async sendOTP(req: Request, res: Response, next: NextFunction) : Promise<Response | void> {
        try{
            const { email } = req.body;
            // console.log(email);
            await userService.sendOTP(email);
            return res.status(200).json({ message: "OTP sent successfully" });
        } catch (error) {
            console.error("Send OTP Error:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    // /user/update-profile
    async updateProfile(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            // Check if user is logged in
            const user = req.session.authUser;
            if (!user) {
                return res.status(401).json({ error: "Unauthorized" });
            }

            const {email, name, dob } = req.body;
            console.log(
                email,
                name,
                dob
            );
            userService.updateProfile(user.id, email, name, dob);
        } catch (error) {
            console.error("Update Profile Error:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}
