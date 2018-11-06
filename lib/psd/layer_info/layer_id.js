const LayerInfo = require('../layer_info');

class LayerId extends LayerInfo{
    constructor() {
        super(...arguments);
    }

    static shouldParse(key) {
        return key === 'lyid';
    };

    parse() {
        this.id = this.file.readInt();
    };
}

module.exports = LayerId
