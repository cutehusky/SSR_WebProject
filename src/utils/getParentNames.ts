export const getParentNames = (subCategories: { id: number; name: string; parentName: string; parentId: number }[]): Object[] => {
  // Lấy ra tất cả các giá trị của parentName
  const parentNames = subCategories.map((subCategory) => {
    return {
      id: subCategory.parentId,
      name: subCategory.parentName,
    };
  });
  
  // Loại bỏ các giá trị trùng lặp bằng cách sử dụng reduce
  const uniqueParentNames = parentNames.reduce((accumulator: { id: number; name: string }[], current) => {
    // Kiểm tra nếu đối tượng đã có trong accumulator hay chưa
    if (!accumulator.some(item => item.id === current.id && item.name === current.name)) {
      accumulator.push(current);
    }
    return accumulator;
  }, []);
  
  return uniqueParentNames;
};
