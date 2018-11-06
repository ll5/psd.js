module.exports = {
    parseRaw: function() {
        for(let i = this.chanPos; i < this.chanPos + this.chan.length - 2; i++) {
            this.channelData[i] = this.file.readByte();
        }
        this.chanPos += this.chan.length - 2;
    }
};
