const LayerInfo = require('../layer_info');

class NestedSectionDivider extends LayerInfo {
    constructor(layer, length) {
        super(layer, length);
        this.isFolder = false;
        this.isHidden = false;
    }

    static shouldParse = function(key) {
        return key === 'lsdk';
    };


    parse() {
        let code = this.file.readInt();
        switch (code) {
        case 1:
        case 2:
            this.isFolder = true;
            break;
        case 3:
            this.isHidden = true;
            break;
        }
    };
};
module.exports = NestedSectionDivider;
