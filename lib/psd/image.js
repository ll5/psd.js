const Module = require('../utils/module');

const ImageFormat = require('./image_format');

const ImageMode = require('./image_mode');

const Export = require('./image_export');

const COMPRESSIONS = ['Raw', 'RLE', 'ZIP', 'ZIPPrediction'];

class Image extends Module {
    constructor(file, header) {
        super();
        this.file = file;
        this.header = header;
        this.numPixels = this.width() * this.height();
        if(this.depth() === 16) {
            this.numPixels *= 2;
        }
        this.calculateLength();
        this.pixelData = new Uint8Array(this.channelLength * 4);
        this.maskData = new Uint8Array(this.maskLength * 4);
        this.channelData = new Uint8Array(this.length + this.maskLength);
        this.opacity = 1.0;
        this.hasMask = false;
        this.startPos = this.file.tell();
        this.endPos = this.startPos + this.length;
        this.setChannelsInfo();
    }


    setChannelsInfo() {
        switch (this.mode()) {
        case 1:
            return this.setGreyscaleChannels();
        case 3:
            return this.setRgbChannels();
        case 4:
            return this.setCmykChannels();
        }
    };

    calculateLength() {
        this.length = (function() {
            switch (this.depth()) {
            case 1:
                return (this.width() + 7) / 8 * this.height();
            case 16:
                return this.width() * this.height() * 2;
            default:
                return this.width() * this.height();
            }
        }.call(this));
        this.channelLength = this.length;
        this.length *= this.channels();
        if(this.layer && this.layer.mask.size) {
            this.maskLength = this.layer.mask.width * this.layer.mask.height;
        }
        else {
            this.maskLength = 0;
        }
    };

    parse() {
        var ref1;
        this.compression = this.parseCompression();
        if((ref1 = this.compression) === 2 || ref1 === 3) {
            this.file.seek(this.endPos);
            return;
        }
        return this.parseImageData();
    };

    parseCompression() {
        return this.file.readShort();
    };

    parseImageData() {
        switch (this.compression) {
        case 0:
            this.parseRaw();
            break;
        case 1:
            this.parseRLE();
            break;
        case 2:
        case 3:
            this.parseZip();
            break;
        default:
            this.file.seek(this.endPos);
        }
        return this.processImageData();
    };

    processImageData() {
        switch (this.mode()) {
        case 1:
            this.combineGreyscaleChannel();
            break;
        case 3:
            this.combineRgbChannel();
            break;
        case 4:
            this.combineCmykChannel();
        }
        this.channelData = null;
    };
}

// 这一行 直接复制静态方法
Image.includes = Module.includes;

Image.includes(ImageFormat.RAW);

Image.includes(ImageFormat.RLE);

Image.includes(ImageMode.Greyscale);

Image.includes(ImageMode.RGB);

Image.includes(ImageMode.CMYK);

Image.includes(Export.PNG);

const ref = ['width', 'height', 'channels', 'depth', 'mode'];

function fn(attr) {
    Image.prototype[attr] = function() {
        return this.header[attr];
    };
};

for(let i = 0; i < ref.length; i++) {
    let attr = ref[i];
    fn(attr);
}

module.exports = Image;
