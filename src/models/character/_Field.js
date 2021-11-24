import { capitalizeFirstLetter } from "../../znzlib";

export class Field {
    constructor(id, props){
        this.id = id;
        this.props = props;
    }

    // Export Field into JSON
    export() {
        return {
            ...this.props,
            id: this.id,
            label: ('label' in this.props) ? this.props.label : capitalize(this.id)
        }
    }
}


export class ListField extends Field{

}

export class MaxField extends Field {

}