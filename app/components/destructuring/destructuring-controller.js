class DestructuringController {

    constructor() {
        let vm = this;

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
        vm.match = first + ' ' + last;

        // object matching shorthand
        let {first: f, last: l} = person;
        vm.matchShorthand = f + ' '  + l;

        let {first: firstName, last: lastName, 
          address: {city: town}} = person;

        vm.nestedObject = town;

        // Param Position
        function position({first: x}) {
            vm.position = x;
        }
        position({first: 'Joe'});

        // Handles exception
        let [test] = []; 
        vm.test = test === undefined ? 'undefined' : test;

        // defaults
        let [testDefault = 'New York'] = [];    // jshint ignore:line
        vm.testDefault = testDefault;
    }
}

export default DestructuringController;
