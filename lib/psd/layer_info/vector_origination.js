
const LayerInfo = require('../layer_info');

const Descriptor = require('../descriptor');

class VectorOrigination extends LayerInfo {
    constructor() {
        super(...arguments);
    }

    static shouldParse(key) {
        return key === 'vogk';
    }

    parse() {
        this.file.seek(8, true);
        this.data = new Descriptor(this.file).parse();
    }
};


module.exports = VectorOrigination;
