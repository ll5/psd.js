const LayerInfo = require('../layer_info');

const PathRecord = require('../path_record');

class VectorMask extends LayerInfo {
    constructor(layer, length) {
        super(layer, length);
        this.invert = null;
        this.notLink = null;
        this.disable = null;
        this.paths = [];
    }

    static shouldParse(key) {
        return key === 'vmsk' || key === 'vsms';
    };

    parse() {
        var i, j, numRecords, record, ref, results, tag;
        this.file.seek(4, true);
        tag = this.file.readInt();
        this.invert = (tag & 0x01) > 0;
        this.notLink = (tag & (0x01 << 1)) > 0;
        this.disable = (tag & (0x01 << 2)) > 0;
        numRecords = (this.length - 10) / 26;
        results = [];
        for(i = j = 0, ref = numRecords; ref >= 0 ? j < ref : j > ref; i = ref >= 0 ? ++j : --j) {
            record = new PathRecord(this.file);
            record.parse();
            results.push(this.paths.push(record));
        }
        return results;
    };

    export() {
        return {
            invert: this.invert,
            notLink: this.notLink,
            disable: this.disable,
            paths: this.paths.map(function(p) {
                return p['export']();
            })
        };
    };
};

module.exports = VectorMask;
