module.exports = {
    parseBlendingRanges: function() {
        let length = this.file.readInt();
        if(length === 0) {
            return;
        }
        this.blendingRanges.grey = {
            source: {
                black: [this.file.readByte(), this.file.readByte()],
                white: [this.file.readByte(), this.file.readByte()]
            },
            dest: {
                black: [this.file.readByte(), this.file.readByte()],
                white: [this.file.readByte(), this.file.readByte()]
            }
        };
        let numChannels = (length - 8) / 8;
        this.blendingRanges.channels = [];
        let results = [];
        for(let i = 0; i < numChannels; i++) {
            results.push(this.blendingRanges.channels.push({
                source: {
                    black: [this.file.readByte(), this.file.readByte()],
                    white: [this.file.readByte(), this.file.readByte()]
                },
                dest: {
                    black: [this.file.readByte(), this.file.readByte()],
                    white: [this.file.readByte(), this.file.readByte()]
                }
            }));
        }
        return results;
    }
};
