


export function randomize(action, field, options){

    on(`clicked:${action}`, function(){ 
        const random = Math.floor(Math.random() * options.length);

        const value = options[random];
        setAttrs({
            [field]: value
        });
    });
}