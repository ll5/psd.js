const Module = require('../utils/module');
const MODES = ['Bitmap', 'GrayScale', 'IndexedColor', 'RGBColor', 'CMYKColor', 'HSLColor', 'HSBColor', 'Multichannel', 'Duotone', 'LabColor', 'Gray16', 'RGB48', 'Lab48', 'CMYK64', 'DeepMultichannel', 'Duotone16'];


class Header extends Module {
    constructor(file) {
        super();
        this.file = file;
    }

    parse() {
        this.sig = this.file.readString(4);
        this.version = this.file.readUShort();
        this.file.seek(6, true);
        this.channels = this.file.readUShort();
        this.rows = this.height = this.file.readUInt();
        this.cols = this.width = this.file.readUInt();
        this.depth = this.file.readUShort();
        this.mode = this.file.readUShort();
        let colorDataLen = this.file.readUInt();
        return this.file.seek(colorDataLen, true);
    };

    modeName() {
        return MODES[this.mode];
    };

    export() {
        let data = {};
        const props = ['sig', 'version', 'channels', 'rows', 'cols', 'depth', 'mode'];
        for(let i = 0; i < props.length; i++) {
            let key = props[i];
            data[key] = this[key];
        }
        return data;
    };
}

Header.aliasProperty('height', 'rows');

Header.aliasProperty('width', 'cols');

Header.prototype.sig = null;

Header.prototype.version = null;

Header.prototype.channels = null;

Header.prototype.rows = null;

Header.prototype.cols = null;

Header.prototype.depth = null;

Header.prototype.mode = null;


module.exports = Header;
