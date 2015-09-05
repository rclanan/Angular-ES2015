class GeneratorsController {

    constructor() {
        let vm = this;

        function *gen (x) {
            var y = 1 + (yield 2 * x);
            var z = 3 * (yield y);
            return x + y + z;
        }

        var foo = new gen(5);
        console.log(foo.next()); // {value: 10, done: false}
        console.log(foo.next(8)); // {value: 9, done: false}
        console.log(foo.next(13)); // {value: 53, done: true}    z is 13 * 3 = 39
                                   //  53 = 5 + 9 + 39
    }
}

export default GeneratorsController;
