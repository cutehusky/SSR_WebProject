import {DBConfig as db} from "../Utils/DBConfig";
import {UserData, UserRole} from "../Models/UserData";

const datePremium = 10; //min
import {getRole, getRoleName} from "../Utils/getRole";

export const createUser = async (userData: any): Promise<void> => {
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
        Role: getRole(userData.role as string),
        isAdministator: userData.role === "Admin" ? 1:0
      });
      
    if(userData.role === "Writer")
      await db("WRITER").insert({WriterID: id, Alias: userData.fullname})
    else if (userData.role === "Editor")
      await db("EDITOR").insert({EditorID: id})
    else if(userData.role === "User")
      await db("SUBSCRIBER").insert({SubscriberID: id,
        DateExpired: new Date(Date.now() + datePremium * 1000 * 60), });

  } catch (error : any) {
    console.log(error);
    throw new Error('Failed to create user.' + error.message);
  }
}

export const updateUser = async (userData: UserData, category_add : number[] , category_remove:number[]): Promise<void> => {
    // Kiểm tra xem user đã tồn tại chưa
    const userExists = await db('USER').where('UserID', userData.id).first();
    if (!userExists) {
        throw new Error(`User with ID ${userData.id} does not exist.`);
    }

    try {
      if(userExists.Role === 2){
        for(let i = 0; i < category_add.length; i++){
          const exit = await db("EDITOR_CATEGORY").where({EditorID: userData.id, CategoryID: category_add[i]}).first()
          if(!exit)
            await db("EDITOR_CATEGORY").insert({EditorID: userData.id, CategoryID: category_add[i]})
        }
        for(let i = 0; i < category_remove.length; i++){
          await db("EDITOR_CATEGORY").where({EditorID: userData.id, CategoryID: category_remove[i]}).delete()
        }
      }
      if(userExists.Role !== getRole(userData.role as string)){
        // xóa role ở bảng khác
        if(userExists.Role === 1)
          await db("WRITER").where("WriterID", userData.id).delete()
        else if(userExists.Role === 2){
          await db("EDITOR_CATEGORY").where("EditorID", userData.id).delete()
          await db("EDITOR").where("EditorID", userData.id).delete()
        }
        else if(userExists.Role === 0)
          await db("SUBSCRIBER").where("SubscriberID", userData.id).delete()
        else if(userExists.Role === 3)
          await db("USER").where("UserID", userData.id).update("isAdministator", 0)
        
        // nếu update role thì phải update bảng khác
        if(userData.role === "Writer")
          await db("WRITER").insert({WriterID: userData.id, Alias: userData.fullname})
        else if (userData.role === "Editor"){
          await db("EDITOR").insert({EditorID: userData.id})
          for(let i = 0; i < category_add.length; i++){
            const exit = await db("EDITOR_CATEGORY").where({EditorID: userData.id, CategoryID: category_add[i]}).first()
            if(!exit)
              await db("EDITOR_CATEGORY").insert({EditorID: userData.id, CategoryID: category_add[i]})
          }
        }
        else if(userData.role === "User")
          await db("SUBSCRIBER").insert({SubscriberID: userData.id,
            DateExpired: new Date(Date.now() + datePremium * 1000 * 60), })
      }

        // Update user trong database
        await db('USER').where('UserID', userData.id).update({
            FullName: userData.fullname,
            Email: userData.email,
            Password: userData.password,
            DOB: userData.dob || null,
            Role: getRole(userData.role as string),
        });
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

export const addPremium = async (id: number)=> {
    let date = await db("subscriber").where({SubscriberID: id}).first();
    if (date.DateExpired.getTime() > Date.now()) {
        await db("subscriber").where({SubscriberID: id}).update({"DateExpired":
                new Date(date.DateExpired.getTime() + datePremium * 1000 * 60)});
    } else {
        await db("subscriber").where({SubscriberID: id}).update({"DateExpired":
                new Date(Date.now() + datePremium * 1000 * 60)});
    }
}