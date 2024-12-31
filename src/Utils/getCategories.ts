import { DBConfig } from "./DBConfig";

export const getCategories = async (): Promise<{
  id: number;
  name: string;
}[]> => {
  return DBConfig("category").select("CategoryID as id", "Name as name");
}