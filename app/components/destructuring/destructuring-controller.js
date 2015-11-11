class DestructuringController {

    constructor() {
        // list matching
        let [a, , b] = [1,2,3];

        let person = {
            first: 'Chris',
            last: 'Paul',
            phone: 333-444-5555,
            address: {
                city: 'Los Angeles',
                state: 'California'
            }
        };

        // object matching
        let {first, last} = person;
        this.match = first + ' ' + last;

        // object matching shorthand
        let {first: f, last: l} = person;
        this.matchShorthand = f + ' '  + l;

        let {first: firstName, last: lastName,
          address: {city: town}} = person;

        this.nestedObject = town;

        // Param Position
        function position({first: x}) {
            this.position = x;
        }
        position({first: 'Joe'});

        // Handles exception
        let [test] = [];
        this.test = test === undefined ? 'undefined' : test;

        // defaults
        let [testDefault = 'New York'] = [];    // jshint ignore:line
        this.testDefault = testDefault;
    }
}

export default DestructuringController;
