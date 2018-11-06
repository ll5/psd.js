const _ = require('lodash');

const Node = require('../node');

class Layer extends Node {
    constructor() {
        super(...arguments);
    }

    isEmpty() {
        return this.width === 0 || this.height === 0;
    };

    export() {
        var ref;
        return _.merge(super['export'].call(this), {
            type: 'layer',
            mask: this.layer.mask['export'](),
            text: (ref = this.get('typeTool')) != null ? ref['export']() : void 0,
            image: {}
        });
    };
}


Layer.prototype.type = 'layer';

module.exports = Layer;
