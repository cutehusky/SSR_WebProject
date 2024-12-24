import { DBConfig } from "./DBConfig";

export const getTags = (): Promise<{name: string, id: number}[]> => {
    return DBConfig('TAG').select('TagID as id', 'Name as name');
};
