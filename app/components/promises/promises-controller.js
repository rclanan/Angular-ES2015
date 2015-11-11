class PromisesController {

    constructor() {
        function getPromise(val) {
            return new Promise(function (resolve, reject) {
                if (val) {
                    resolve(21);
                } else {
                    reject(11);
                }
            });
        }

        getPromise(true).then(function (val) {
            this.resolve = val;
        });

        getPromise(false).then(function (val) {
            console.log(val);
        }, function (val) {
            this.reject = val;
        });
    }
}

export default PromisesController;
