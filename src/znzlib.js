

export function capitalizeFirstLetter(str){
    return str.charAt(0).toUpperCase() + str.slice(1);
}


export function isObject(obj){
    try {
        return obj.constructor.name === "Object";
    } catch (e) {
        return false;
    }
}