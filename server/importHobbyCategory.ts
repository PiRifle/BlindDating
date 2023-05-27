import { HobbyCategory } from "../models/HobbyCategories";
import { Hobby } from "../models/Hobby";
import { HobbyTheme } from "./importServerData";

// const hobbyData: HobbyTheme[] = import("../docs/hobbies_converted.json").default
// const SchoolData 

export async function importHobbyCategory(hobbyCategory: HobbyTheme) {

    const category = await HobbyCategory.create({
        name: hobbyCategory.theme
    });

    hobbyCategory.data.forEach(async (data) => {
        await Hobby.create({
            name: data.value,
            description: data.label,
            category: category,
        });
    });
    console.log(hobbyCategory.theme);

}
