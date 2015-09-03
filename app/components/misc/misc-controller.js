class ArrowController {

    constructor() {
        let vm = this;

        forOf();

        function forOf () {
            var arr = [2, 4, 6];
            var result = '';

            // new - for-of
            for(let elem of arr) {
                result += elem + ' ';
            }


            //for-of would show 2 4 6 and for-in would show 0 1 2 
            //and any other property name. If there was an arr.foo
            //for-in would have a result of 0 1 2 foo
            
            
            vm.forOf = result;
        }
    }
}

export default ArrowController;
