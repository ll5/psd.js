const LayerInfo = require('../layer_info');
class FillOpacity extends LayerInfo {
    constructor() {
        super(...arguments);
    }

    static shouldParse(key) {
        return key === 'iOpa';
    };

    parse() {
        this.value = this.file.readByte();
    };
};

module.exports = FillOpacity;
