export const testSubCategory = (): { id: number; name: string; parentName: string; parentId: number; fullname: string }[] => {
  let testSubCategory = [];
  let testCategory = [];
  let k = 0;
  for (let i = 0; i < 20; i++) {
    testCategory.push({
      id: i,
      name: "test category " + i,
    });
    for (let j = 0; j < 20; j++) {
      let parentName = "test category " + i;
      let name = "test subcategory " + k;
      testSubCategory.push({
        id: k,
        name: name,
        parentName: parentName,
        parentId: i,
        fullname: `${parentName} / ${name} `
      });
      k++;
    }
  }
  return testSubCategory;
}