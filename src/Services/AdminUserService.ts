import {DBConfig as db} from "../Utils/DBConfig";
import {UserData} from "../Models/UserData";

export const createUser = async (userData: UserData): Promise<void> => {
  // Kiểm tra xem user đã tồn tại chưa
  const userExists = await db('USER').where('Email', userData.email).first();
  if (userExists) {
    throw new Error(`User with ID ${userData.id} already exists.`);
  }

  try {
    // Insert user vào database
    const [id] = await db('USER').insert({
        FullName: userData.fullname,
        Email: userData.email,
        Password: userData.password,
        DOB: userData.dob || null,
        Role: userData.role,
        isAdministator: userData.role === "Admin"
      });
      
    await db("SUBSCRIBER").insert({SubscriberID: id, DateExpired: new Date(0), })
  } catch (error : any) {
    console.log(error);
    throw new Error('Failed to create user.' + error.message);
  }
}

export const updateUser = async (userData: UserData): Promise<void> => {
    // Kiểm tra xem user đã tồn tại chưa
    const userExists = await db('USER').where('UserID', userData.id).first();
    if (!userExists) {
        throw new Error(`User with ID ${userData.id} does not exist.`);
    }
    
    try {
        // Update user trong database
        await db('USER').where('UserID', userData.id).update({
            FullName: userData.fullname,
            Email: userData.email,
            Password: userData.password,
            DOB: userData.dob,
            Role: userData.role
        })
    } catch (error : any) {
        console.log(error);
        throw new Error('Failed to update user.');
    }
    };

export const deleteUser = async (id: number): Promise<void> => {
    try {       
        // Kiểm tra xem user có tồn tại không
        const userExists = await db('USER').where('UserID', id).first();
        if (!userExists) {
            throw new Error(`User with ID ${id} does not exist.`);
        }
        
        // Xóa user khỏi database
        await db('USER').where('UserID', id).delete();
    } catch (error : any) {
        console.log(error);
        throw new Error('Failed to delete user.');
    }
    };
