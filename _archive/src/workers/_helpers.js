
export const getButtonRowId = function(eventInfo){
    var underscoreIndex = eventInfo.sourceAttribute.lastIndexOf("_");
    return eventInfo.sourceAttribute.substr(0, underscoreIndex);
};

/**
 * Given a number, spread it out and list all numbers preceding it.
 */
 export const sequenceNumber = (num, delim='', flip=false) => {
    var result = '';

    if (!Number.isInteger(num)){
        return '';
    }

    //descending order
    if (flip){
        for (let i = num; i >= 0; i--){
            result += i.toString();
    
            if (i > 0 && delim.length){
                result += delim;
            }
        }
    } else {
        //ascneding order
        for (let i = 0; i <= num; i++){
            result += i.toString();
    
            if (i < num && delim.length){
                result += delim;
            }
        }
    }

    return result;
}