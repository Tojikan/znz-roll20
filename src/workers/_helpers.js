
export const getButtonRowId = function(eventInfo){
    var underscoreIndex = eventInfo.sourceAttribute.lastIndexOf("_");
    return eventInfo.sourceAttribute.substr(0, underscoreIndex);
};