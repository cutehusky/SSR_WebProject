import { DBConfig } from "./DBConfig";
import { getRole } from "./getRole";

export const getUsers = async (role: string): Promise<{ id: number; name: string; email: string; dateOfBirth: string; role: string
    , categories: any}[]> => {
    try {
        const query = DBConfig("user").select(
            "UserID as id",
            "FullName as name",
            "Email as email",
            DBConfig.raw("DATE_FORMAT(Dob, '%d/%m/%Y') as dateOfBirth"),
            DBConfig.raw("CASE Role WHEN 0 THEN 'User' WHEN 1 THEN 'Writer' WHEN 2 THEN 'Editor' WHEN 3 THEN 'Admin' ELSE 'Invalid' END as role")
            
        );
        if (role !== "all") {
            query.where("Role", getRole(role));
        }
        return query; // Trả về dữ liệu sau khi thực thi
    } catch (error) {
        console.error(error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};
