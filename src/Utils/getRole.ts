import exp from "constants";
import { DBConfig } from "./DBConfig";

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
export const getRole = (role: string): number => {
    switch (role) {
        case "User":
            return 0;
        case "Writer":
            return 1;
        case "Editor":
            return 2;
        case "Admin":
            return 3;
        default:
            return -1;
    }
}