

class Field {
    constructor(id, props={}, label='',){
        this.id = id;
        this.props = props;
        this.label = label.length ? label : this.id.charAt(0).toUpperCase() + this.id.slice(1);
    }

    toJson(){
        return {
            id: this.id,
            label: this.label,
            ...this.props
        }
    }
}


module.exports = Field;