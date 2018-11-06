const LayerInfo = require('../layer_info');

class BlendInteriorElements extends LayerInfo {
    constructor() {
        super(...arguments);
    }

    static shouldParse(key) {
        return key === 'infx';
    };

    parse() {
        this.enabled = this.file.readBoolean();
        return this.file.seek(3, true);
    };
};

module.exports = BlendInteriorElements;
