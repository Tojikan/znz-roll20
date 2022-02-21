import PromptSync from 'prompt-sync';
import { testset } from './src/data/loot.mjs';

const prompt = PromptSync();

const sets = {
    testset: testset
};


console.log("Available Loot Sets:");
console.log(Object.keys(sets));   

let set = prompt("Which set would you like to print?").trim();

if (set in sets){
    console.log(JSON.stringify(sets[set]));
} else {
    console.log('Invalid Set');
}


