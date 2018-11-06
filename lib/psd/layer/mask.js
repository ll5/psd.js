const Mask = require('../mask');

module.exports = {
    parseMaskData: function() {
        this.mask = new Mask(this.file).parse();
    }
};
