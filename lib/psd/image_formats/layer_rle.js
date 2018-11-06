module.exports = {
    parseByteCounts: function() {
        let results = [];
        for(let i = 0; i < this.height(); i++) {
            results.push(this.file.readShort());
        }
        return results;
    },
    parseChannelData: function() {
        this.lineIndex = 0;
        return this.decodeRLEChannel();
    }
};
