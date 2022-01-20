

/**
 * Gets a rowID from a button click on a sheet worker.
 * @param {*} eventInfo 
 * @returns 
 */
export const getButtonRowId = function(eventInfo){
    var underscoreIndex = eventInfo.sourceAttribute.lastIndexOf("_");
    return eventInfo.sourceAttribute.substr(0, underscoreIndex);
};
