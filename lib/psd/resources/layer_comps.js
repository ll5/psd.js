const Descriptor = require('../descriptor');

class LayerComps {
    constructor(resource) {
        this.resource = resource;
        this.file = this.resource.file;
    }

    parse() {
        console.log(1111);
        this.file.seek(4, true);
        this.data = new Descriptor(this.file).parse();
    };

    names() {
        return this.data.list.map(function(comp) {
            return comp['Nm  '];
        });
    };

    export() {
        console.log(222);
        return this.data.list.map(function(comp) {
            return {
                id: comp.compID,
                name: comp['Nm  '],
                capturedInfo: comp.capturedInfo
            };
        });
    };
};

LayerComps.prototype.id = 1065;

LayerComps.prototype.name = 'layerComps';

LayerComps.visibilityCaptured = function(comp) {
    console.log(333);
    return comp.capturedInfo & parseInt('001', 2) > 0;
};

LayerComps.positionCaptured = function(comp) {
    console.log(44);
    return comp.positionCaptured & parseInt('010', 2) > 0;
};

LayerComps.appearanceCaptured = function(comp) {
    console.log(555);
    return comp.appearanceCaptured & parseInt('100', 2) > 0;
};

module.exports = LayerComps;
