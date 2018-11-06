const Module = require('../utils/module');

class Layer extends Module {
    constructor(file, header) {
        super();
        this.file = file;
        this.header = header;
        this.mask = {};
        this.blendingRanges = {};
        this.adjustments = {};
        this.channelsInfo = [];
        this.blendMode = {};
        this.groupLayer = null;
        this.infoKeys = [];
        Object.defineProperty(this, 'name', {
            get: function() {
                if(this.adjustments['name'] != null) {
                    return this.adjustments['name'].data;
                }
                else {
                    return this.legacyName;
                }
            },
        });
    }

    parse() {
        var extraLen;
        this.parsePositionAndChannels();
        this.parseBlendModes();
        extraLen = this.file.readInt();
        this.layerEnd = this.file.tell() + extraLen;
        this.parseMaskData();
        this.parseBlendingRanges();
        this.parseLegacyLayerName();
        this.parseLayerInfo();
        this.file.seek(this.layerEnd);
        return this;
    };

    export() {
        return {
            name: this.name,
            top: this.top,
            right: this.right,
            bottom: this.bottom,
            left: this.left,
            width: this.width,
            height: this.height,
            opacity: this.opacity,
            visible: this.visible,
            clipped: this.clipped,
            mask: this.mask.export(),
        };
    };
}

Layer.includes(require('./layer/position_channels'));

Layer.includes(require('./layer/blend_modes'));

Layer.includes(require('./layer/mask'));

Layer.includes(require('./layer/blending_ranges'));

Layer.includes(require('./layer/name'));

Layer.includes(require('./layer/info'));

Layer.includes(require('./layer/helpers'));

Layer.includes(require('./layer/channel_image'));

module.exports = Layer;
