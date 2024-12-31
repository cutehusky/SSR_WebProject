import { get } from 'jquery';
import { DBConfig } from "./DBConfig";

export const getTags = (): Promise<{name: string, id: number}[]> => {
    return DBConfig('tag').select('TagID as id', 'Name as name');
};

export const getTagsById = (id: number): Promise<{name: string, id: number}[]> => {
    return DBConfig('tag').select('TagID as id', 'Name as name').where('TagID', id);
}

export const updateTagById = (id: number, name: string): Promise<void> => {
    return DBConfig('tag').where('TagID', id).update({Name: name });
}

export const deleteTagById = (id: number): Promise<void> => {
    return DBConfig('tag').where('TagID', id).del();
}

export const createTag = (name: string): Promise<void> => {
    return DBConfig('tag').insert({Name: name});
}

export const getTagByName = async (name: string): Promise<{name: string, id: number}[]> => {
    return DBConfig('tag').select('TagID as id', 'Name as name').where('Name', name);
}