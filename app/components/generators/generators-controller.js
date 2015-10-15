class GeneratorsController {

    constructor() {
        let vm = this;

        function *genNumbers () {
            yield 1;
            yield 2;
            yield 3;
            return 4;
        }
        // the return value doesn't get hit in a loop
        // Once a loop sees done:false it doesn't extract a final value
        let numbers = new genNumbers ();
        for (let n of numbers) {
            console.log(n); //1 2 3   Doesn't display 4
        }

        function *gen (x) {
            let y = 1 + (yield 2 * x);
            let z = 3 * (yield y);
            return x + y + z;
        }

        var foo = new gen(5);
        console.log(foo.next()); // {value: 10, done: false}
        console.log(foo.next(8)); // {value: 9, done: false}
        console.log(foo.next(13)); // {value: 53, done: true}    z is 13 * 3 = 39
                                   //  53 = 5 + 9 + 39


        let promise = (x) => new Promise((resolve, reject) => resolve(x));

        function* genPromise () {
          var x = yield promise('The Promise Resolved!');
          vm.genPromise = x;
        }

        var fooPromise = new genPromise();

        fooPromise.next().value.then(x => fooPromise.next(x));

    }
}

export default GeneratorsController;
