class RestController {

    constructor() {
        function add(...args) {
          let result = 0;

          args.forEach((n) => {
            result += n;
          });

          return result;
        }

        this.result = add(2, 4, 6); //12
    }
}

export default RestController;
