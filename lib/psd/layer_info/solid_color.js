const  LayerInfo = require('../layer_info');

const Descriptor = require('../descriptor');

class SolidColor extends LayerInfo {

    static shouldParse = function(key) {
        return key === 'SoCo';
    };

    constructor(layer, length) {
        super(layer, length);
        this.r = this.g = this.b = 0;
    }

    parse = function() {
        this.file.seek(4, true);
        this.data = new Descriptor(this.file).parse();
        this.r = Math.round(this.colorData()['Rd  ']);
        this.g = Math.round(this.colorData()['Grn ']);
        this.b = Math.round(this.colorData()['Bl  ']);
    };

    colorData = function() {
        return this.data['Clr '];
    };

    color = function() {
        return [this.r, this.g, this.b];
    };

}
module.exports = SolidColor
