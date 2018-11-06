const _ = require('lodash');

const Node = require('../node');

class Group extends Node {
    constructor() {
        super(...arguments);
    }

    passthruBlending() {
        return this.get('blendingMode') === 'passthru';
    };

    isEmpty() {
        var child;
        if(!(function() {
            var i, len, ref, results;
            ref = this._children;
            results = [];
            for(i = 0, len = ref.length; i < len; i++) {
                child = ref[i];
                results.push(child.isEmpty());
            }
            return results;
        }.call(this))) {
            return false;
        }
    };

    export() {
        return _.merge(super.export.call(this), {
            type: 'group',
            children: this._children.map(function(c) {
                return c['export']();
            })
        });
    };
};

Group.prototype.type = 'group';

module.exports = Group;
