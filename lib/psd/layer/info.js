const LazyExecute = require('../lazy_execute');

const Util = require('../util');

const hasProp = {}.hasOwnProperty;

const LAYER_INFO = {
    artboard: require('../layer_info/artboard'),
    blendClippingElements: require('../layer_info/blend_clipping_elements'),
    blendInteriorElements: require('../layer_info/blend_interior_elements'),
    fillOpacity: require('../layer_info/fill_opacity'),
    gradientFill: require('../layer_info/gradient_fill'),
    layerId: require('../layer_info/layer_id'),
    layerNameSource: require('../layer_info/layer_name_source'),
    legacyTypetool: require('../layer_info/legacy_typetool'),
    locked: require('../layer_info/locked'),
    metadata: require('../layer_info/metadata'),
    name: require('../layer_info/unicode_name'),
    nestedSectionDivider: require('../layer_info/nested_section_divider'),
    objectEffects: require('../layer_info/object_effects'),
    sectionDivider: require('../layer_info/section_divider'),
    solidColor: require('../layer_info/solid_color'),
    typeTool: require('../layer_info/typetool'),
    vectorMask: require('../layer_info/vector_mask'),
    vectorOrigination: require('../layer_info/vector_origination'),
    vectorStroke: require('../layer_info/vector_stroke'),
    vectorStrokeContent: require('../layer_info/vector_stroke_content')
};

module.exports = {
    parseLayerInfo: function() {
        let results = [];
        while(this.file.tell() < this.layerEnd) {
            this.file.seek(4, true);
            let key = this.file.readString(4);
            let length = Util.pad2(this.file.readInt());
            let pos = this.file.tell();
            let keyParseable = false;
            for(let name in LAYER_INFO) {
                if(!hasProp.call(LAYER_INFO, name)) continue;
                let Klass = LAYER_INFO[name];
                if(!Klass.shouldParse(key)) {
                    continue;
                }
                let i = new Klass(this, length);

                this.adjustments[name] = new LazyExecute(i, this.file).now('skip').later('parse').get();
                if(this[name] == null) {
                    (function(_this) {
                        return function(name) {
                            _this[name] = function() {
                                return _this.adjustments[name];
                            };
                        };
                    })(this)(name);
                }
                this.infoKeys.push(key);
                keyParseable = true;
                break;
            }
            if(!keyParseable) {
                results.push(this.file.seek(length, true));
            }
            else {
                results.push(void 0);
            }
        }
        return results;
    }
};
