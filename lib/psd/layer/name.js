const Util = require('../util');

module.exports = {
    parseLegacyLayerName: function() {
        let len = Util.pad4(this.file.readByte());
        this.legacyName = this.file.readString(len);
    }
};
