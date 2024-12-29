export interface UserData {
    id: number;
    fullname: string;
    email: string;
    password: string;
    dob: string;
    role: string | UserRole;
}

export enum UserRole {
    Invalid = -1,
    User = 'User',
    Writer = 'Writer',
    Editor = 'Editor',
    Admin = 'Admin',
}

// export enum UserRole {
//     Invalid = -1,
//     User = 0,
//     Writer = 1,
//     Editor = 2,
//     Admin = 3,
// }
