const BlendMode = require('../blend_mode');

module.exports = {
    parseBlendModes: function() {
        this.blendMode = new BlendMode(this.file);
        this.blendMode.parse();
        this.opacity = this.blendMode.opacity;
        this.visible = this.blendMode.visible;
        this.clipped = this.blendMode.clipped;
    },
    hidden: function() {
        return !this.visible;
    },
    blendingMode: function() {
        return this.blendMode.mode;
    }
};
