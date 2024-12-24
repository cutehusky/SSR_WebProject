// session.d.ts
import 'express-session';
import {UserData} from "../Services/AdminUserService";

declare module 'express-session' {
    interface SessionData {
        authUser?: UserData | null; // hoặc kiểu cụ thể hơn, ví dụ User
        retUrl?: string;
    }
}
