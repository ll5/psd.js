const extend = function(child, parent) {
    for(var key in parent) {
        if(hasProp.call(parent, key)) child[key] = parent[key];
    }
    function Ctor() {
        this.constructor = child;
    }
    Ctor.prototype = parent.prototype;
    child.prototype = new Ctor();
    child.__super__ = parent.prototype;
    return child;
};

const hasProp = {}.hasOwnProperty;

const _ = require('lodash');

const Image = require('./image');

const ImageFormat = require('./image_format');

extend(ChannelImage, Image);

ChannelImage.includes(ImageFormat.LayerRAW);

ChannelImage.includes(ImageFormat.LayerRLE);

//  由于 父类构造函数 没有在第一行调用，导致无法用 es6 的 class
function ChannelImage(file, header, layer) {
    this.layer = layer;
    this._width = this.layer.width;
    this._height = this.layer.height;
    ChannelImage.__super__.constructor.call(this, file, header);
    this.channelsInfo = this.layer.channelsInfo;
    this.hasMask = _.some(this.channelsInfo, function(c) {
        return c.id < -1;
    });
    this.opacity = this.layer.opacity / 255.0;
}

ChannelImage.prototype.skip = function() {
    let results = [];
    for(let i = 0; i < this.channelsInfo.length; i++) {
        let chan = this.channelsInfo[i];
        results.push(this.file.seek(chan.length, true));
    }
    return results;
};

ChannelImage.prototype.width = function() {
    return this._width;
};

ChannelImage.prototype.height = function() {
    return this._height;
};

ChannelImage.prototype.channels = function() {
    return this.layer.channels;
};

ChannelImage.prototype.parse = function() {
    this.chanPos = 0;
    for(let i = 0; i < this.channelsInfo.length; i++) {
        let chan = this.channelsInfo[i];
        if(chan.length <= 0) {
            this.parseCompression();
            continue;
        }
        this.chan = chan;
        if(chan.id < -1) {
            this._width = this.layer.mask.width;
            this._height = this.layer.mask.height;
        }
        else {
            this._width = this.layer.width;
            this._height = this.layer.height;
        }
        this.length = this._width * this._height;
        let start = this.file.tell();
        this.parseImageData();
        let finish = this.file.tell();
        if(finish !== start + this.chan.length) {
            this.file.seek(start + this.chan.length);
        }
    }
    this._width = this.layer.width;
    this._height = this.layer.height;
    return this.processImageData();
};

ChannelImage.prototype.parseImageData = function() {
    this.compression = this.parseCompression();
    switch (this.compression) {
    case 0:
        return this.parseRaw();
    case 1:
        return this.parseRLE();
    case 2:
    case 3:
        return this.parseZip();
    default:
        return this.file.seek(this.endPos);
    }
};

module.exports = ChannelImage;
