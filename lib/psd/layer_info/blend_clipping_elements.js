const LayerInfo = require('../layer_info');

class BlendClippingElements extends LayerInfo {
    constructor() {
        super(...arguments);
    }

    static shouldParse(key) {
        return key === 'clbl';
    };

    parse() {
        this.enabled = this.file.readBoolean();
        return this.file.seek(3, true);
    };
}

module.exports = BlendClippingElements;
