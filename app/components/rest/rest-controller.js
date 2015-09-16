class RestController {

    constructor() {
        let vm = this;

        function add(...args) {
          let result = 0;
          
          args.forEach((n) => {
            result += n;
          });
          
          return result;
        }

        vm.result = add(2, 4, 6); //12
    }
}

export default RestController;
