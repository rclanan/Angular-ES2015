class TemplatesController {

    constructor() {
        //literals
        let [first, last, food] = ['Bob', 'Smith', 'Pizza'];

        let template = `This is ${first} ${last}.
        His favorite food is ${food}.`;

        let taggedTemplate = upper `This is ${first} ${last}.
        His favorite food is ${food}.`;

        function upper(strings, ...values){
            let result = '';

            for(let i = 0; i < strings.length; i++){
                result += strings[i];
                if(i < values.length){
                    result += values[i];
                }
            }

            return result.toUpperCase();
        }

        this.template = template;
        this.taggedTemplate = taggedTemplate;
    }
}

export default TemplatesController;
