class ClassController {

    constructor() {
        let vm = this;

        let person = new Person('Bob');
        vm.result = person.greet();
    }
}

class Person { 
    constructor(firstName) {
        this._first = firstName;
    }
    
    get first() {
        return this._first;
    }
    
    greet() {
        return 'Hello, ' + this.first;
    }                                               
}

export default ClassController;
