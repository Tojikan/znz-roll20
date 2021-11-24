
import { capitalizeFirstLetter } from "../znzlib";
import { getAttrVal } from "./r20lib";






export class Model {
    constructor(template){
        this.template = template;
    }


    export(){
        
    }
}



class Field {
    constructor(id, props){
        this.id = id;
        this.props = props;
    }

    toJson() {
        return {
            ...this.props,
            id: this.id,
            label: ('label' in this.props) ? this.props.label : capitalizeFirstLetter(this.id)
        }
    }
}