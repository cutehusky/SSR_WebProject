import {DBConfig} from "./Utils/DBConfig";

async function InitialDatabase()
{
    let k = 1;
    for (let i = 1; i <= 20; i++) {
        await DBConfig("category").insert({name: "test category " + i});
        for (let j = 1; j <= 20; j++) {
            await DBConfig("subcategory").insert({name: "test subcategory " + k, CategoryID: i});
            k++;
        }
    }

    for (let i = 1; i <= 20; i++) {
        await DBConfig("tag").insert({name: "test tag " + i});
    }
}
InitialDatabase()