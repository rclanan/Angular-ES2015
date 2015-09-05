class MapsSetsController {

    constructor() {
        let vm = this;

        // Map
        let map = new Map([['id', '1'],
                          ['first', 'Steve'],
                          ['last', 'Winston']]);
        
        map.set('phone', '333-444-5555');

        vm.map = '';
        for (let entry of map.entries()) {
            vm.map += `${entry[0]}: ${entry[1]}  `;
        }

        // Weak Map


        //WeakMap key must be an object
        //WeakMap key gets removed if object no longer used

        let [weakMap, key1, key2] = [new WeakMap(), {id: 1}, {id: 2}];

        weakMap.set(key1, 'fish');
        weakMap.set(key2, 'dog');

        vm.key = key1;  // {id: 1}
        vm.hasKey = weakMap.has(key1); // true
        vm.getKey1 = weakMap.get(key1); // fish

        key1 = {id: 2};
        vm.hasKeyCheck = weakMap.has(key1);


        // Sets
        let pizzaRestaurants = new Set();

        pizzaRestaurants.add('Papa Murphys').add('Papa Johns').add('Pizza Hut');

        vm.pizzaSize = pizzaRestaurants.size;
        vm.hasPizzaHut = pizzaRestaurants.has('Pizza Hut');

        let pizzaResult = '';
        for (let [key, value] of pizzaRestaurants.entries()) {
          pizzaResult += value + ' ';
        }
        vm.pizzaResult = pizzaResult;

        let array = [...pizzaRestaurants];
        vm.pizzaArray = array;

        // Weak Sets work the same was as Weak Maps, but for Sets
        // Basically values must be an object, and you can't iterate because there
        // might no longer be a reference to an object
    }
}

export default MapsSetsController;
