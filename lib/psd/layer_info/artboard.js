const LayerInfo = require('../layer_info');

const Descriptor = require('../descriptor');

class Artboard extends LayerInfo {
    constructor() {
        super(...arguments);
    }

    static shouldParse(key) {
        return key === 'artb';
    };

    parse() {
        this.file.seek(4, true);
        this.data = new Descriptor(this.file).parse();
    };

    export() {
        console.log(5555);
        return {
            coords: {
                left: this.data.artboardRect['Left'],
                top: this.data.artboardRect['Top '],
                right: this.data.artboardRect['Rght'],
                bottom: this.data.artboardRect['Btom']
            }
        };
    };
};

module.exports = Artboard;
