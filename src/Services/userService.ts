import {DBConfig, DBConfig as db} from "../Utils/DBConfig";


export interface UserData {
  id: number;
  fullname: string;
  email: string;
  password: string;
  dob: string;
  role: UserRole;
}

export const getUsernameById = async (id: number): Promise<string> => {
    const user = await db("USER").where("UserID", id).first();
    if (!user)
        return "";
    return user.FullName;
};

export const getWriterNameById = async (id: string): Promise<string> => {
    const user = await db("WRITER")
        .where("WriterID", id).first();
    if (!user)
        return "";
    return user.Alias;
};

export const getUserByEmail = async (email: string): Promise<UserData | null> => {
  const user = await db("USER").where("Email", email).first();
  if (!user) return null;
  return {
    id: user.UserID,
    fullname: user.FullName,
    email: user.Email,
    password: user.Password,
    dob: user.DOB,
    role:  await GetRoleOfUserById(user.UserID)
  };
};

export enum UserRole {
    Invalid= -1,
    User,
    Writer,
    Editor,
    Admin
}

export const GetRoleOfUserById = async (userId: string) => {
    const user = await db("USER").where("UserID", userId).first();
    if (!user)
        return UserRole.Invalid;
    if (user.isAdministator)
        return UserRole.Admin;
    const isWriter = await db("WRITER").where("WriterID", userId).count("* as num").first();
    if (isWriter && isWriter.num === 1)
        return UserRole.Writer;
    const isEditor = await db("EDITOR").where("EditorID", userId).count("* as num").first();
    if (isEditor && isEditor.num === 1)
        return UserRole.Editor;
    const isUser = await db("SUBSCRIBER").where("SubscriberID", userId).count("* as num").first();
    if (isUser && isUser.num === 1)
        return UserRole.User;
    return UserRole.Invalid;
}

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
        DOB: userData.dob
      });
    await db("SUBSCRIBER").insert({SubscriberID: id, DateExpired: new Date(0)})
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
            FullName: userData.fullname,
            Email: userData.email,
            Password: userData.password,
            DOB: userData.dob
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