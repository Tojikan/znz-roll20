import { capitalize } from "../lib/znzlib";

capitalize

export class ItemTemplate {
    constructor(template){
        this.stats = template;
        this.variations = template.variations;

        delete this.stats.variations;
    }


    getItem(variation=''){
        let itm = {
            ...this.stats
        };

        let category = ('category' in itm) ? itm.category : 'Item';


        if (variation && variation in this.variations){
            itm = {
                ...itm,
                ...this.variations[variation],
            }

            category = capitalize(variation) + ' ' + category;
        } else {
            category = 'Common ' + category;
        }

        itm.category = category;
        return itm;
    }
}