const LayerInfo = require('../layer_info');

class Locked extends LayerInfo{
    constructor(layer, length) {
        super(layer, length);
        this.transparencyLocked = false;
        this.compositeLocked = false;
        this.positionLocked = false;
        this.allLocked = false;
    }


    static shouldParse(key) {
        return key === 'lspf';
    };

    parse() {
        let locked = this.file.readInt();
        this.transparencyLocked = (locked & (0x01 << 0)) > 0 || locked === -2147483648;
        this.compositeLocked = (locked & (0x01 << 1)) > 0 || locked === -2147483648;
        this.positionLocked = (locked & (0x01 << 2)) > 0 || locked === -2147483648;
        this.allLocked = this.transparencyLocked && this.compositeLocked && this.positionLocked;
    };
};
module.exports = Locked
