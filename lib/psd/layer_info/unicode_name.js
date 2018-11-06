const LayerInfo = require('../layer_info');

class UnicodeName extends LayerInfo {
    constructor() {
        super(...arguments);
    }

    static shouldParse(key) {
        return key === 'luni';
    };

    parse() {
        var pos;
        pos = this.file.tell();
        this.data = this.file.readUnicodeString();
        this.file.seek(pos + this.length);
        return this;
    };
};

module.exports = UnicodeName;
