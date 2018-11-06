
const LayerInfo = require('../layer_info');

const Descriptor = require('../descriptor');

class Metadata extends LayerInfo {
    constructor() {
        super(...arguments);
    }

    static shouldParse(key) {
        return key === 'shmd';
    };

    parse() {
        let count = this.file.readInt();
        let results = [];
        for(let i = 0;i < count; i++) {
            this.file.seek(4, true);
            let key = this.file.readString(4);
            let copyOnSheetDup = this.file.readByte();
            this.file.seek(3, true);
            let len = this.file.readInt();
            let end = this.file.tell() + len;
            if(key === 'cmls') {
                this.parseLayerComps();
            }
            results.push(this.file.seek(end));
        }
        return results;
    };

    parseLayerComps() {
        this.file.seek(4, true);
        this.data.layerComp = new Descriptor(this.file).parse();
    };
};

module.exports = Metadata;
