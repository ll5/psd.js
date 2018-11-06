const jspack = require('jspack').jspack;

const iconv = require('iconv-lite');

const Color = require('./color');

const Util = require('./util');

const FORMATS = {
    Int: {
        code: '>i',
        length: 4
    },
    UInt: {
        code: '>I',
        length: 4
    },
    Short: {
        code: '>h',
        length: 2
    },
    UShort: {
        code: '>H',
        length: 2
    },
    Float: {
        code: '>f',
        length: 4
    },
    Double: {
        code: '>d',
        length: 8
    },
    LongLong: {
        code: '>q',
        length: 8
    }
};

const hasProp = {}.hasOwnProperty;

class File {
    constructor(data) {
        this.data = data;
    }

    tell() {
        return this.pos;
    };

    read(length) {
        let results = [];
        for(let i = 0; i < length; i++) {
            results.push(this.data[this.pos++]);
        }
        return results;
    };

    readf(format, len) {
        if(len == null) {
            len = null;
        }
        return jspack.Unpack(format, this.read(len || jspack.CalcLength(format)));
    };

    seek(amt, rel) {
        if(rel == null) {
            rel = false;
        }
        if(rel) {
            this.pos += amt;
        }
        else {
            this.pos = amt;
        }
    };

    readString(length) {
        return String.fromCharCode.apply(null, this.read(length)).replace(/\u0000/g, '');
    };

    readUnicodeString(length) {
        if(length == null) {
            length = null;
        }
        length || (length = this.readInt());
        return iconv.decode(new Buffer(this.read(length * 2)), 'utf-16be').replace(/\u0000/g, '');
    };

    readByte() {
        return this.read(1)[0];
    };

    readBoolean() {
        return this.readByte() !== 0;
    };

    readSpaceColor() {
        var colorComponent, colorSpace, i, j;
        colorSpace = this.readShort();
        for(i = j = 0; j < 4; i = ++j) {
            colorComponent = this.readShort() >> 8;
        }
        return {
            colorSpace: colorSpace,
            components: colorComponent
        };
    };

    readPathNumber() {
        var a, arr, b, b1, b2, b3;
        a = this.readByte();
        arr = this.read(3);
        b1 = arr[0] << 16;
        b2 = arr[1] << 8;
        b3 = arr[2];
        b = b1 | b2 | b3;
        return parseFloat(a, 10) + parseFloat(b / Math.pow(2, 24), 10);
    };
}

function fn(format, info) {
    File.prototype['read' + format] = function() {
        return this.readf(info.code, info.length)[0];
    };
};
for(let format in FORMATS) {
    if(!hasProp.call(FORMATS, format)) continue;
    let info = FORMATS[format];
    fn(format, info);
}

File.prototype.pos = 0;


module.exports = File;
