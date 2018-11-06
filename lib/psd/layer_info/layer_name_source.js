const LayerInfo = require('../layer_info');

class LayerNameSource extends LayerInfo {
    constructor() {
        super(...arguments);
    }

    static shouldParse(key) {
        return key === 'lnsr';
    };

    parse() {
        this.id = this.file.readString(4);
    };
}

module.exports = LayerNameSource;
