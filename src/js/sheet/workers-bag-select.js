var bagTypes = {
    none: 5,
    tiny: 10,
    small: 25,
    medium: 40,
    large: 75
}


on("change:bagtype", function(eventInfo){
    getAttrs([
        "bagtype"
    ], function(value){
        let bag = value['bagtype'];

        if (bag in bagTypes){
            setAttrs({
                inventory_max_weight: bagTypes[bag]
            });
        }
    });
});