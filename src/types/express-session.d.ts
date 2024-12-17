// session.d.ts
import 'express-session';

declare module 'express-session' {
    interface SessionData {
        authUser?: any; // hoặc kiểu cụ thể hơn, ví dụ User
        retUrl?: string;
    }
}
