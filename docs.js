
import abilities from "./src/data/abilities.js";
import flaws from "./src/data/flaws.js";
import * as fs from 'fs';

function sort(a,b){
    if ( a.key < b.key ){
        return -1;
    }
    if ( a.key > b.key ){
        return 1;
    }
    return 0;
}


let ability = abilities.sort(sort);
let flaw = flaws.sort(sort);


let ab = JSON.stringify(ability);
let fl = JSON.stringify(flaw);


fs.writeFileSync('./docs/_data/abilities.json', ab);
fs.writeFileSync('./docs/_data/flaws.json', fl);
console.log('Copied data files to docs');