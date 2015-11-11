class ClassController {

    constructor() {
        let person = new Person('Bob');
        this.result = person.greet();

        let javaScript = new Language('javascript');
        this.language = javaScript.name;
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
