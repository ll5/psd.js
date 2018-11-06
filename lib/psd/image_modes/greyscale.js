module.exports = {
    setGreyscaleChannels: function() {
        this.channelsInfo = [
            {
                id: 0
            }
        ];
        if(this.channels() === 2) {
            return this.channelsInfo.push({
                id: -1
            });
        }
    },
    combineGreyscaleChannel: function() {
        let results = [];
        for(let i = 0; i < this.numPixels; i++) {
            let grey = this.channelData[i];
            let alpha = this.channels() === 2 ? this.channelData[this.channelLength + i] : 255;
            results.push(this.pixelData.set([grey, grey, grey, alpha], i * 4));
        }
        return results;
    }
};
