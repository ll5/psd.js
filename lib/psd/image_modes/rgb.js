module.exports = {
    setRgbChannels: function() {
        this.channelsInfo = [
            {
                id: 0
            }, {
                id: 1
            }, {
                id: 2
            }
        ];
        if(this.channels() === 4) {
            return this.channelsInfo.push({
                id: -1
            });
        }
    },
    combineRgbChannel: function() {
        let rgbChannels = this.channelsInfo.map(function(ch) {
            return ch.id;
        }).filter(function(ch) {
            return ch >= -1;
        });
        for(let i = 0; i < this.numPixels; i++) {
            let r = 0;
            let g = 0;
            let b = 0;
            let a = 255;
            rgbChannels.forEach((chan, index) => {
                let val = this.channelData[i + (this.channelLength * index)];
                switch (chan) {
                case -1:
                    a = val;
                    break;
                case 0:
                    r = val;
                    break;
                case 1:
                    g = val;
                    break;
                case 2:
                    b = val;
                }
            });
            this.pixelData.set([r, g, b, a], i * 4);
        }
        return this.readMaskData(rgbChannels);
    },
    readMaskData: function(rgbChannels) {
        var i, j, maskPixels, offset, ref, results, val;
        if(this.hasMask) {
            maskPixels = this.layer.mask.width * this.layer.mask.height;
            offset = this.channelLength * rgbChannels.length;
            results = [];
            for(i = j = 0, ref = maskPixels; ref >= 0 ? j < ref : j > ref; i = ref >= 0 ? ++j : --j) {
                val = this.channelData[i + offset];
                results.push(this.maskData.set([0, 0, 0, val], i * 4));
            }
            return results;
        }
    }
};
