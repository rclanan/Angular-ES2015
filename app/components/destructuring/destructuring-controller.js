class DestructuringController {

    constructor() {
        let vm = this;

        // list matching
        let [a, , b] = [1,2,3];

        let person = {
            first: 'Chris',
            last: 'Paul',
            phone: 333-444-5555
        };

        // object matching
        let {first, last} = person;
        vm.match = first + ' ' + last;

        // object matching shorthand
        let {first: f, last: l} = person;
        vm.matchShorthand = f + ' '  + l;

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
