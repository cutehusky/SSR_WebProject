import { DBConfig } from "./DBConfig";

export const getUsers = async (role: string, offset: number = 0, limit: number = 0): Promise<{ id: number; name: string; email: string; dateOfBirth: string; role: string }[]> => {
    try {
        const query = DBConfig("user").select(
            "UserID as id",
            "FullName as name",
            "Email as email",
            DBConfig.raw("DATE_FORMAT(Dob, '%d/%m/%Y') as dateOfBirth"),
            "Role as role"
        );
        //in ra mảng query
        
        if (role !== "all") {
            query.where("Role", role);
        }
        
        const result = await query.offset(offset).limit(limit); // Thực thi truy vấn
        console.log(result);
        return result; // Trả về dữ liệu sau khi thực thi
    } catch (error) {
        console.error(error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};

export const countUsers = async (role: string): Promise<number> => {
    try {
        const query = DBConfig("user").select(
            "UserID as id",
            "FullName as name",
            "Email as email",
            DBConfig.raw("DATE_FORMAT(Dob, '%d/%m/%Y') as dateOfBirth"),
            "Role as role"
        );

        if (role !== "all") {
            query.where("Role", role);
        }

        const result = await query.count("* as count").first(); // Thực thi truy vấn
        console.log(result);
        return result?.count as number || 0; // Trả về dữ liệu sau khi thực thi
    } catch (error) {
        console.error(error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};