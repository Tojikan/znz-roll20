

class FieldGroup {
    constructor(id, fields = []){
        this.id = id;
        this.fields = fields;
    }

    toJson(){
        let result = {};

        for (let fld of this.fields){
            let fldjson = fld.toJson();
            result[fldjson.id] = fldjson;
        }

        return result;
    }
}

module.exports = FieldGroup;