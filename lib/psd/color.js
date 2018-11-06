const Util = require('./util');

module.exports = {
    cmykToRgb: function(c, m, y, k) {
        let r = Util.clamp((65535 - (c * (255 - k) + (k << 8))) >> 8, 0, 255);
        let g = Util.clamp((65535 - (m * (255 - k) + (k << 8))) >> 8, 0, 255);
        let b = Util.clamp((65535 - (y * (255 - k) + (k << 8))) >> 8, 0, 255);
        return [r, g, b];
    }
};
