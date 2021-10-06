const Field = require("./_field");
const FieldGroup = require("./_fieldGroup");

class SheetObject{
    
    constructor(fields){
        this.fields = fields;
    }

    getFields = function(){
        return this.fields.reduce((prev, cur)=>{
            if (cur instanceof Field || cur instanceof FieldGroup){
                prev[cur.id] = cur.toJson();
                return prev;
            } else {
                let combine = {...prev, ...cur};
                return combine;
            }
             
        }, {});
    }
}

module.exports = SheetObject;