module.exports = {
    parseRaw: function() {
        return this.channelData.set(this.file.read(this.length));
    }
};
