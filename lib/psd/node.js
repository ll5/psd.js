const _ = require('lodash');

const Module = require('../utils/module');

class Node extends Module {
    constructor(layer, parent) {
        super();
        this.layer = layer;
        this.parent = parent != null ? parent : null;
        this.layer.node = this;
        this._children = [];
        this.name = this.layer.name;
        this.forceVisible = null;
        this.coords = {
            top: this.layer.top,
            bottom: this.layer.bottom,
            left: this.layer.left,
            right: this.layer.right
        };
        this.topOffset = 0;
        this.leftOffset = 0;
        this.createProperties();
    }

    createProperties() {
        Object.defineProperty(this, 'top', {
            get: function() {
                return this.coords.top + this.topOffset;
            },
            set: function(val) {
                this.coords.top = val;
            }
        });
        Object.defineProperty(this, 'right', {
            get: function() {
                return this.coords.right + this.leftOffset;
            },
            set: function(val) {
                this.coords.right = val;
            }
        });
        Object.defineProperty(this, 'bottom', {
            get: function() {
                return this.coords.bottom + this.topOffset;
            },
            set: function(val) {
                this.coords.bottom = val;
            }
        });
        Object.defineProperty(this, 'left', {
            get: function() {
                return this.coords.left + this.leftOffset;
            },
            set: function(val) {
                this.coords.left = val;
            }
        });
        Object.defineProperty(this, 'width', {
            get: function() {
                return this.right - this.left;
            }
        });
        return Object.defineProperty(this, 'height', {
            get: function() {
                return this.bottom - this.top;
            }
        });
    };

    get(prop) {
        var value;
        value = this[prop] != null ? this[prop] : this.layer[prop];
        if(typeof value === 'function') {
            return value();
        }
        else {
            return value;
        }
    };

    visible() {
        if(this.layer.clipped && !this.clippingMask().visible()) {
            return false;
        }
        if(this.forceVisible != null) {
            return this.forceVisible;
        }
        else {
            return this.layer.visible;
        }
    };

    hidden() {
        return !this.visible();
    };

    isLayer() {
        return this.type === 'layer';
    };

    isGroup() {
        return this.type === 'group';
    };

    isRoot() {
        return this.type === 'root';
    };

    clippingMask() {
        var maskNode;
        if(!this.layer.clipped) {
            return null;
        }
        return this.clippingMaskCached || (this.clippingMaskCached = (function() {
            maskNode = this.nextSibling();
            while(maskNode.clipped) {
                maskNode = maskNode.nextSibling();
            }
            return maskNode;
        }.call(this)));
    };

    clippedBy() {
        return this.clippingMask();
    };

    export() {
        var hash, i, len, prop, ref;
        hash = {
            type: null,
            visible: this.visible(),
            opacity: this.layer.opacity / 255.0,
            blendingMode: this.layer.blendingMode()
        };
        ref = Node.PROPERTIES;
        for(i = 0, len = ref.length; i < len; i++) {
            prop = ref[i];
            hash[prop] = this[prop];
        }
        return hash;
    };

    updateDimensions() {
        var child, i, len, nonEmptyChildren, ref;
        if(this.isLayer()) {
            return;
        }
        ref = this._children;
        for(i = 0, len = ref.length; i < len; i++) {
            child = ref[i];
            child.updateDimensions();
        }
        if(this.isRoot()) {
            return;
        }
        nonEmptyChildren = this._children.filter(function(c) {
            return !c.isEmpty();
        });
        this.left = _.min(nonEmptyChildren.map(function(c) {
            return c.left;
        })) || 0;
        this.top = _.min(nonEmptyChildren.map(function(c) {
            return c.top;
        })) || 0;
        this.bottom = _.max(nonEmptyChildren.map(function(c) {
            return c.bottom;
        })) || 0;
        this.right = _.max(nonEmptyChildren.map(function(c) {
            return c.right;
        })) || 0;
    };
}


Node.includes(require('./nodes/ancestry'));
Node.includes(require('./nodes/search'));
Node.includes(require('./nodes/build_preview'));
Node.PROPERTIES = ['name', 'left', 'right', 'top', 'bottom', 'height', 'width'];
Node.prototype.type = 'node';

module.exports = Node;
