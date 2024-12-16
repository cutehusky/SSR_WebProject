import {DBConfig as db} from "../utils/DBConfig";


export interface UserData {
  id: number;
  fullname: string;
  email: string;
  password: string;
  dob: string;
  isAdministator: number;
}

export const getUserByEmail = async (email: string): Promise<UserData | null> => {
  const user = await db("USER").where("Email", email).first();
  if (!user) return null;
  return {
    id: user.UserID,
    fullname: user.Fullname,
    email: user.Email,
    password: user.Password,
    dob: user.DOB,
    isAdministator: user.isAdministator,
  };
};

export const createUser = async (userData: UserData): Promise<void> => {
  // Kiểm tra xem user đã tồn tại chưa
  const userExists = await db('USER').where('Email', userData.email).first();
  if (userExists) {
    throw new Error(`User with ID ${userData.id} already exists.`);
  }

  try {
    // Insert user vào database
    await db('USER').insert({
        Fullname: userData.fullname,
        Email: userData.email,
        Password: userData.password,
        DOB: userData.dob,
        isAdministator: userData.isAdministator,
      });
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
            UserID: userData.id,
            Fullname: userData.fullname,
            Email: userData.email,
            Password: userData.password,
            DOB: userData.dob,
            isAdministator: userData.isAdministator,
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