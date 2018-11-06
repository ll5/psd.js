module.exports = {
    parsePositionAndChannels: function() {
        this.top = this.file.readInt();
        this.left = this.file.readInt();
        this.bottom = this.file.readInt();
        this.right = this.file.readInt();
        this.channels = this.file.readShort();
        this.rows = this.height = this.bottom - this.top;
        this.cols = this.width = this.right - this.left;
        let results = [];
        for(let i = 0; i < this.channels; i++) {
            let id = this.file.readShort();
            let length = this.file.readInt();
            results.push(this.channelsInfo.push({
                id: id,
                length: length
            }));
        }
        return results;
    }
};
