const ChannelImage = require('../channel_image');

const LazyExecute = require('../lazy_execute');

module.exports = {
    parseChannelImage: function() {
        let image = new ChannelImage(this.file, this.header, this);
        this.image = new LazyExecute(image, this.file).now('skip').later('parse').get();
    },
};
