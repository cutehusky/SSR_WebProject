export const testSubCategory = (): { id: number; name: string; parentName: string; parentId: number }[] => {
  let testSubCategory = [];
  let testCategory = [];
  for (let i = 0; i < 20; i++) {
    testCategory.push({
      id: i,
      name: "test category " + i,
    });
    for (let j = 0; j < 20; j++) {
      testSubCategory.push({
        id: j,
        name: "test subcategory " + j,
        parentName: "test category " + i,
        parentId: i,
      });
    }
  }
  return testSubCategory;
}