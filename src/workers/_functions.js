
/**
 * Stricter, regex based way to parse for ints.
 */
const filterInt = function(value){
    if (/^[-+]?(\d+)$/.test(value)) {
        return Number(value)
    } else {
        return NaN
    }
};


/* ===== PARAMETERS ==========
destinations = the name of the attribute that stores the total quantity
        can be a single attribute, or an array: ['total_cost', 'total_weight']
        If more than one, the matching fields must be in the same order. 
    section = name of repeating fieldset, without the repeating_
    fields = the name of the attribute field to be summed
          destination and fields both can be a single attribute: 'weight'
          or an array of attributes: ['weight','number','equipped']
*/
const repeatingSum = (destinations, section, fields) => {
    if (!Array.isArray(destinations)) destinations = [destinations.replace(/\s/g, '').split(',')];
    if (!Array.isArray(fields)) fields = [fields.replace(/\s/g, '').split(',')];
    getSectionIDs(`repeating_${section}`, idArray => {
        const attrArray = idArray.reduce((m, id) => [...m, ...(fields.map(field => `repeating_${section}_${id}_${field}`))], []);
        getAttrs([...attrArray], v => {
            const getValue = (section, id, field) => v[`repeating_${section}_${id}_${field}`] === 'on' ? 1 : parseFloat(v[`repeating_${section}_${id}_${field}`]) || 0;
            const commonMultipliers = (fields.length <= destinations.length) ? [] : fields.splice(destinations.length, fields.length - destinations.length);
            const output = {};
            destinations.forEach((destination, index) => {
                output[destination] = idArray.reduce((total, id) => total + getValue(section, id, fields[index]) * commonMultipliers.reduce((subtotal, mult) => subtotal * getValue(section, id, mult), 1), 0);
            });
            setAttrs(output);
        }); 
    }); 
};

/**
 * Given a number, spread it out and list all numbers preceding it.
 */
const sequenceNumber = (num, delim='') => {
    var result = '';

    if (!Number.isInteger(num)){
        return '';
    }

    for (let i = 0; i <= num; i++){
        result += i.toString();

        if (i < num && delim.length){
            result += delim;
        }
    }
    return result;
}