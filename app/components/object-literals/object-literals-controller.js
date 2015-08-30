class ObjectLiteralsController {

    constructor() {
        let vm = this;

        //shorthand functions
        let functionObj = {
            first: 'Michael',
            last: 'Jordan',
            name() {return this.first + ' ' + this.last;}
        };
        vm.shortFunction = functionObj.name(); //Michael Jordan

        //shorthand property
        let first = 'Tracy';
        let last = 'McGrady';

        let obj = {first, last};
        vm.property = obj; //{"first":"Tracy","last":"McGrady"}

        //computed property
        let propKey = 'user';
        let computedObj = {
            [propKey]: true,
            ['f'+'irst']: 'Sam'
        };

        if (computedObj.user) {
            vm.computed = computedObj.first; //Sam
        }
    }
}

export default ObjectLiteralsController;
