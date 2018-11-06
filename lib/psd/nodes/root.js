const _ = require('lodash');

const Node = require('../node');

const Group = require('./group');

const Layer = require('./layer');

class Root extends Node {
    constructor(psd) {
        super(Root.layerForPsd(psd));
        this.psd = psd;
        this.buildHeirarchy();
    }

    documentDimensions() {
        return [this.width, this.height];
    };

    depth() {
        return 0;
    };

    opacity() {
        return 255;
    };

    fillOpacity() {
        return 255;
    };

    export() {
        var ref;
        return {
            children: this._children.map(function(c) {
                return c['export']();
            }),
            document: {
                width: this.width,
                height: this.height,
                resources: {
                    layerComps: ((ref = this.psd.resources.resource('layerComps')) != null ? ref['export']() : void 0) || [],
                    guides: [],
                    slices: []
                }
            }
        };
    };

    buildHeirarchy() {
        var currentGroup, i, layer, len, parent, parseStack, ref;
        currentGroup = this;
        parseStack = [];
        ref = this.psd.layers;
        for(i = 0, len = ref.length; i < len; i++) {
            layer = ref[i];
            if(layer.isFolder()) {
                parseStack.push(currentGroup);
                currentGroup = new Group(layer, _.last(parseStack));
            }
            else if(layer.isFolderEnd()) {
                parent = parseStack.pop();
                parent.children().push(currentGroup);
                currentGroup = parent;
            }
            else {
                currentGroup.children().push(new Layer(layer, currentGroup));
            }
        }
        return this.updateDimensions();
    };
};

Root.layerForPsd = function(psd) {
    var i, layer, len, prop, ref;
    layer = {};
    ref = Node.PROPERTIES;
    for(i = 0, len = ref.length; i < len; i++) {
        prop = ref[i];
        layer[prop] = null;
    }
    layer.top = 0;
    layer.left = 0;
    layer.right = psd.header.width;
    layer.bottom = psd.header.height;
    return layer;
};

Root.prototype.type = 'root';

module.exports = Root;
