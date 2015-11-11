class SpreadController {

    constructor() {
        //apply to spread
        let max = Math.max(...[1, 2, 3, 4]);
        this.max = max;

        //concat to spread
        let array1 = [1, 2, 3];
        let array2 = [4, 5, 6];
        let concatArray = [...array1, ...array2];
        this.array = concatArray;
    }
}

export default SpreadController;
