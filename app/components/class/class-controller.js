class ClassController {

    constructor() {
        let vm = this;

        let person = new Person('Bob');
        vm.result = person.greet();

        let javaScript = new Language('javascript');
        vm.language = javaScript.name;
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

let firstSymbol = Symbol();

class Language {
    constructor(name) {
        this[firstSymbol] = name;
    }

    get name() {
        return this[firstSymbol];
    }
}

export default ClassController;
