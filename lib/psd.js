import Module from './utils/module';

const RSVP = require('rsvp');

const File = require('./psd/file.js');

const LazyExecute = require('./psd/lazy_execute.js');

const Header = require('./psd/header.js');

const Resources = require('./psd/resources.js');

const LayerMask = require('./psd/layer_mask.js');

const Image = require('./psd/image.js');

class PSD extends Module {
    constructor(data) {
        super();
        this.file = new File(data);
        this.parsed = false;
        this.header = null;
        Object.defineProperty(this, 'layers', {
            get: function() {
                return this.layerMask.layers;
            }
        });
        RSVP.on('error', function(reason) {
            return console.error(reason);
        });
    }

    parse() {
        if(this.parsed) {
            return;
        }
        this.parseHeader();
        this.parseResources();
        this.parseLayerMask();
        this.parseImage();
        this.parsed = true;
    };

    parseHeader() {
        this.header = new Header(this.file);
        this.header.parse();
    };

    parseResources() {
        let resources = new Resources(this.file);
        this.resources = new LazyExecute(resources, this.file).now('skip').later('parse').get();
    };

    parseLayerMask() {
        let layerMask = new LayerMask(this.file, this.header);
        this.layerMask = new LazyExecute(layerMask, this.file).now('skip').later('parse').get();
    };

    parseImage() {
        let image = new Image(this.file, this.header);
        this.image = new LazyExecute(image, this.file).later('parse').ignore('width', 'height').get();
    };

    tree() {
        return new PSD.Node.Root(this);
    };
};

PSD.Node = {Root: require('./psd/nodes/root.js')};

PSD.extends(require('./shims/init.js'));


module.exports = PSD;
