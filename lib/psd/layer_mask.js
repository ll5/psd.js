const _ = require('lodash');

const Util = require('./util');

const Layer = require('./layer');

class LayerMask {
    constructor(file, header) {
        this.file = file;
        this.header = header;
        this.layers = [];
        this.mergedAlpha = false;
        this.globalMask = null;
    }

    skip() {
        return this.file.seek(this.file.readInt(), true);
    };

    parse() {
        var finish, maskSize;
        maskSize = this.file.readInt();
        finish = maskSize + this.file.tell();
        if(maskSize <= 0) {
            return;
        }
        this.parseLayers();
        this.parseGlobalMask();
        this.layers.reverse();
        return this.file.seek(finish);
    };

    parseLayers() {
        var i, j, k, layer, layerCount, layerInfoSize, len, ref, ref1, results;
        layerInfoSize = Util.pad2(this.file.readInt());
        if(layerInfoSize > 0) {
            layerCount = this.file.readShort();
            if(layerCount < 0) {
                layerCount = Math.abs(layerCount);
                this.mergedAlpha = true;
            }
            for(i = j = 0, ref = layerCount; ref >= 0 ? j < ref : j > ref; i = ref >= 0 ? ++j : --j) {
                this.layers.push(new Layer(this.file, this.header).parse());
            }
            ref1 = this.layers;
            results = [];
            for(k = 0, len = ref1.length; k < len; k++) {
                layer = ref1[k];
                results.push(layer.parseChannelImage());
            }
            return results;
        }
    };

    parseGlobalMask() {
        var length, maskEnd;
        length = this.file.readInt();
        if(length <= 0) {
            return;
        }
        maskEnd = this.file.tell() + length;
        this.globalMask = _({}).tap((function(_this) {
            return function(mask) {
                mask.overlayColorSpace = _this.file.readShort();
                mask.colorComponents = [_this.file.readShort() >> 8, _this.file.readShort() >> 8, _this.file.readShort() >> 8, _this.file.readShort() >> 8];
                mask.opacity = _this.file.readShort() / 16.0;
                mask.kind = _this.file.readByte();
            };
        })(this));
        return this.file.seek(maskEnd);
    };
}
module.exports = LayerMask;
