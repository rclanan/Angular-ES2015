class ProxiesController {

    // NOTE: Won't transpile. Only works in Firefox right now
    constructor() {
        let darthVader  = {
            name: 'Darth Vader',
            side: 'dark',
            weapon: 'lightsaber'
        };

        let proxyVader = new Proxy(darthVader, {
            get: function(target, property) {
                if (property === 'weapon') {
                    return target[property] + ' and the Force';
                } else {
                    return target[property];
                }
            },
            set: function(target, property, value) {
                if (property === 'name') {
                    console.log(`Can't change name`);
                } else {
                    target[property] = value;
                }
            }
        });

        this.vaderSide = proxyVader.side;
        this.vaderWeapon = proxyVader.weapon;
        proxyVader.name = 'Anakin';
        this.vaderName = proxyVader.name;
        proxyVader.side = 'light';
        this.vaderNewSide = proxyVader.side;
    }
}

export default ProxiesController;
