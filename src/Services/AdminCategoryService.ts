import { Category } from './AdminArticleService';
import { DBConfig } from "../Utils/DBConfig";

export const countCategories = async (): Promise<number> => {
    const result = await DBConfig('CATEGORY').count('CategoryID as count');
    return parseInt(result[0].count as string); 
};


export const GetCategories = async () => {
    return DBConfig('CATEGORY').select('CategoryID as id', 'Name as name');
}

export const countSubCategories = async (categoryId: number): Promise<any> => {
    if(categoryId === -1) {
        return DBConfig('SUBCATEGORY').count('SubCategoryID as count');
    }
    return DBConfig('SUBCATEGORY').where('CategoryID', categoryId).count('SubCategoryID as count');
}

export const GetCategoriesPage = async (offset: number = 0, limit: number = 10): Promise<any> => {
    return DBConfig('CATEGORY').select('CategoryID as id', 'Name as name').limit(limit).offset(offset);
}

export const GetSubCategories = (
    categoryID: number,
    offset: number = 0,  
    limit: number = 10  
): Promise<
    {
        id: number;
        name: string;
        parentName: string;
        parentId: number;
        fullname: string;
    }[]
> => {
    const query = DBConfig('CATEGORY')
        .join(
            'SUBCATEGORY',
            'CATEGORY.CategoryID',
            '=',
            'SUBCATEGORY.CategoryID'
        )
        .select(
            'SubCategoryID as id',
            'CATEGORY.CategoryID as parentId',
            'SUBCATEGORY.Name as name',
            'CATEGORY.Name as parentName',
            DBConfig.raw(
                'CONCAT(CATEGORY.Name, " / ", SUBCATEGORY.Name) as fullname'
            )
        );
    // Nếu categoryID khác -1, lọc theo categoryID
    if (categoryID !== -1) {
        query.where('CATEGORY.CategoryID', '=', categoryID);
    }

    // Áp dụng phân trang
    query.limit(limit).offset(offset);

    return query;
};