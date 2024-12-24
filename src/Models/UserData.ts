export interface UserData {
    id: number;
    fullname: string;
    email: string;
    password: string;
    dob: string;
    role: string | UserRole;
}

export enum UserRole {
    Invalid= -1,
    User,
    Writer,
    Editor,
    Admin
}