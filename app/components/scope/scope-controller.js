class ScopeController {
   
    /*jshint -W038 */
    constructor($timeout) {
        let vm = this;

        Object.assign(vm, {a: 0, b: 0, c: 0, varResult: '', letResult: ''});

        letAndVarDemo();
        varTest();
        letTest();

        function letAndVarDemo () {
            c = 'var test';

            let a = 5;

            if (a === 5) {
                var bValue = b ? 3 : 'Exception';

                let b = 4;
                var c = 'var test 1';
            }

            vm.a = a;
            vm.b = bValue;
            vm.c = c;
        }
        
        function varTest() {
            for (var i = 0; i < 5; i++) {
                $timeout(function () {
                    vm.varResult = vm.varResult + i + ' ';
                }, i * 100);
            }
        }

        function letTest() {
            for (let i = 0; i < 5; i++) {
                $timeout(function () {
                    vm.letResult = vm.letResult + i + ' ';
                }, i * 100);
            }
        }
    }
}

ScopeController.$inject = ['$timeout'];

export default ScopeController;
