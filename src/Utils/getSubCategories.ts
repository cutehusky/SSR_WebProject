import { DBConfig } from './DBConfig';

export const GetSubCategories = (categoryID : number): Promise<
    {
        id: number;
        name: string;
        parentName: string;
        parentId: number;
        fullname: string;
    }[]
> => {
    const query = DBConfig('category')
        .join(
            'subcategory',
            'category.CategoryID',
            '=',
            'subcategory.CategoryID'
        )
        .select(
            'SubCategoryID as id',
            'category.CategoryID as parentId',
            'subcategory.Name as name',
            'category.Name as parentName',
            DBConfig.raw(
                'concat(category.Name, " / ", subcategory.Name) as fullname'
            )
        );
    if (categoryID !== -1) {
        query.where('category.CategoryID', '=', categoryID);
    }

    return query;
};
