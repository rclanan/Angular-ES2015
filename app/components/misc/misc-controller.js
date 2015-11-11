class MiscController {

    constructor() {
        forOf();

        objectAssign();

        function forOf () {
            let arr = [2, 4, 6];
            let result = '';

            // new - for-of
            for (let elem of arr) {
                result += `${elem} `;
            }

            //for-of would show 2 4 6 and for-in would show 0 1 2
            //and any other property name. If there was an arr.foo
            //for-in would have a result of 0 1 2 foo

            this.forOf = result;

            //includes
            const name = 'Josh Smith';
            this.includes = name.includes('mith');

            this.startsWith = name.startsWith('Josh');
            this.endsWith = name.endsWith('th');
            this.repeat = name.repeat(3);
        }

        function objectAssign () {
            const player = {first: 'Andrew', last: 'Luck'};
            const colts = {team: 'Colts', city: 'Indianapolis'};
            Object.assign(player, colts);

            console.log(player.team);


            const pacers = Object.assign({}, colts);
            pacers.team = 'Pacers';
            console.log(pacers.team);
        }
    }
}

export default MiscController;
