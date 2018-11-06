const LayerInfo = require('../layer_info');

const Descriptor = require('../descriptor');

class ObjectEffects extends LayerInfo {
    constructor() {
        super(...arguments);
    }

    static shouldParse(key) {
        return key === 'lfx2';
    };

    parse() {
        this.file.seek(8, true);
        this.data = new Descriptor(this.file).parse();
    };
};

module.exports = ObjectEffects;
