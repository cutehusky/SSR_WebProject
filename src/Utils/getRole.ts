import exp from "constants";
import { DBConfig } from "./DBConfig";
import { UserData, UserRole } from "../Models/UserData";

// chuyển từ 0 sang user, 1 sang writer, 2 sang editor, 3 sang admin
export const getRoleName = (role: number): string => {
    switch (role) {
        case 0:
            return "User";
        case 1:
            return "Writer";
        case 2:
            return "Editor";
        case 3:
            return "Admin";
        default:
            return "Invalid";
    }
}
export const getRole = (role: string): UserRole => {

    switch (role) {
        case "User":
            return UserRole.User;
        case "Writer":
            return UserRole.Writer;
        case "Editor":
            return UserRole.Editor;
        case "Admin":
            return UserRole.Admin;
        default:
            return UserRole.Invalid;
    }
}