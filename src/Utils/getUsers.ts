import { DBConfig } from './DBConfig';
import { getRole } from './getRole';

export const getUsers = async (
    role: string,
    offset: number,
    limit: number
): Promise<{
        id: number;
        name: string;
        email: string;
        dateOfBirth: string;
        role: string;
        categories: any,
        upPremium: boolean;
}[]> => {
    try {
        const query = DBConfig('user').select(
            'UserID as id',
            'FullName as name',
            'Email as email',
            DBConfig.raw("DATE_FORMAT(Dob, '%d/%m/%Y') as dateOfBirth"),
            DBConfig.raw("CASE Role WHEN 0 THEN 'User' WHEN 1 THEN 'Writer' WHEN 2 THEN 'Editor' WHEN 3 THEN 'Admin' ELSE 'Invalid' END as role")
        );
        if (role !== "all") {
            query.where("Role", getRole(role));
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
        const query = DBConfig('user');

        if (role !== 'all') {
            query.where('Role', role);
        }

        const result = await query.count('* as count').first(); // Thực thi truy vấn
        console.log(result);
        return parseInt(result?.count as string, 10) || 0; // Trả về dữ liệu sau khi thực thi
    } catch (error) {
        console.error(error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};
