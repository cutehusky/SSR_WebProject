import { DBConfig as db } from '../Utils/DBConfig';
import { UserData, UserRole } from '../Models/UserData';

const datePremium = 60 * 24 * 7; //min
import { getRole} from '../Utils/getRole';

export const createUser = async (userData: any, penName: string | null): Promise<void> => {
    // Kiểm tra xem user đã tồn tại chưa
    const userExists = await db('user').where('Email', userData.email).first();
    if (userExists) {
        throw new Error(`User with ID ${userData.id} already exists.`);
    }

    try {
        // Insert user vào database
        const [id] = await db('user').insert({
            FullName: userData.fullname,
            Email: userData.email,
            Password: userData.password,
            DOB: userData.dob || null,
            Role: getRole(userData.role as string),
            isAdministator: userData.role === 'Admin' ? 1 : 0,
        });

        console.log(userData.role);

        if (userData.role === UserRole.Writer)
            await db('writer').insert({
                WriterID: id,
                Alias: penName,
            });
        else if (userData.role === UserRole.Editor)
            await db('editor').insert({ EditorID: id });
        else if (userData.role === UserRole.User)
            await db('subscriber').insert({
                SubscriberID: id,
                DateExpired: new Date(Date.now()),
            });
    } catch (error: any) {
        console.log(error);
        throw new Error('Failed to create user.' + error.message);
    }
};

export const updateUser = async (
    userData: UserData,
    category_add: number[],
    category_remove: number[],
    penName: string | null
): Promise<void> => {
    // Kiểm tra xem user đã tồn tại chưa
    const userExists = await db('user').where('UserID', userData.id).first();
    if (!userExists) {
        throw new Error(`User with ID ${userData.id} does not exist.`);
    }

    try {
        if (userExists.Role !== getRole(userData.role as string)) {
            // xóa role ở bảng khác
            if (userExists.Role === 1){
                await db('writer').where('WriterID', userData.id).delete();
            }
            else if (userExists.Role === 2) {
                await db('editor_category')
                    .where('EditorID', userData.id)
                    .delete();
                await db('editor').where('EditorID', userData.id).delete();
            } else if (userExists.Role === 0)
                await db('subscriber')
                    .where('SubscriberID', userData.id)
                    .delete();
            else if (userExists.Role === 3)
                await db('user')
                    .where('UserID', userData.id)
                    .update('isAdministator', 0);
        }

        // nếu update role thì phải update bảng khác
        if (userData.role === 'Writer'){
            const exist = await db('writer').where('WriterID', userData.id).first();
            if (exist)
                await db('writer')
                    .where('WriterID', userData.id)
                    .update({ Alias: penName });
            else
                await db('writer').insert({ WriterID: userData.id, Alias: penName });
        }
        else if (userData.role === 'Editor') {
            const exit = await db('editor').where('EditorID', userData.id).first();
            if (!exit){
                await db('editor').insert({ EditorID: userData.id });
            }
            for (let i = 0; i < category_remove.length; i++) {
                await db('editor_category')
                    .where({
                        EditorID: userData.id,
                        CategoryID: category_remove[i],
                    })
                    .delete();}
                
            for (let i = 0; i < category_add.length; i++) {
                const exit = await db('editor_category')
                .where({
                    EditorID: userData.id,
                    CategoryID: category_add[i],
                })
                .first();
                if (!exit)
                    await db('editor_category').insert({
                EditorID: userData.id,
                CategoryID: category_add[i],
                });
            }
        } else if (userData.role === 'User'){
            const exit = await db('subscriber').where('SubscriberID', userData.id).first();
            if (exit)
                await db('subscriber')
                    .where('SubscriberID', userData.id)
                    .update({
                        DateExpired: new Date(
                            exit.DateExpired.getTime() + datePremium * 1000 * 60
                        ),
                    });
            else
                await db('subscriber').insert({
                    SubscriberID: userData.id,
                    DateExpired: new Date(Date.now() + datePremium * 1000 * 60),
                });
        } else if (userData.role === 'Admin')
            await db('user')
                .where('UserID', userData.id)
                .update('isAdministator', 1);
    
    // Update user trong database
    await db('user')
        .where('UserID', userData.id)
        .update({
            FullName: userData.fullname,
            Email: userData.email,
            Password: userData.password,
            DOB: userData.dob || null,
            Role: getRole(userData.role as string),
        });
    } catch (error: any) {
        console.log(error);
        throw new Error('Failed to update user.');
    }
};

export const deleteUser = async (id: number): Promise<void> => {
    try {
        // Kiểm tra xem user có tồn tại không
        const userExists = await db('user').where('UserID', id).first();
        if (!userExists) {
            throw new Error(`User with ID ${id} does not exist.`);
        }

        // Xóa user khỏi database
        await db('user').where('UserID', id).delete();
    } catch (error: any) {
        console.log(error);
        throw new Error('Failed to delete user.');
    }
};

export const addPremium = async (id: number) => {
    let date = await db('subscriber').where({ SubscriberID: id }).first();
    if (date.DateExpired.getTime() > Date.now()) {
        await db('subscriber')
            .where({ SubscriberID: id })
            .update({
                DateExpired: new Date(
                    date.DateExpired.getTime() + datePremium * 1000 * 60
                ),
            });
    } else {
        await db('subscriber')
            .where({ SubscriberID: id })
            .update({
                DateExpired: new Date(Date.now() + datePremium * 1000 * 60),
            });
    }
};
