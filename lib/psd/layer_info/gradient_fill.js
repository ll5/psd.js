const LayerInfo = require('../layer_info');

const Descriptor = require('../descriptor');

class GradientFill extends LayerInfo {
    constructor() {
        super(...arguments);
    }

    static shouldParse(key) {
        return key === 'GdFl';
    };

    parse() {
        this.file.seek(4, true);
        this.data = new Descriptor(this.file).parse();
    };
}

module.exports = GradientFill;
