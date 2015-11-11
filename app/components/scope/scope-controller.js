class ScopeController {

    /*jshint -W038 */
    constructor($timeout) {
        Object.assign(this, {a: 0, b: 0, c: 0, varResult: '', letResult: ''});

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

            this.a = a;
            this.b = bValue;
            this.c = c;
        }

        function varTest() {
            for (var i = 0; i < 5; i++) {
                $timeout(function () {
                    this.varResult = this.varResult + i + ' ';
                }, i * 100);
            }
        }

        function letTest() {
            for (let i = 0; i < 5; i++) {
                $timeout(function () {
                    this.letResult = this.letResult + i + ' ';
                }, i * 100);
            }
        }
    }
}

ScopeController.$inject = ['$timeout'];

export default ScopeController;
