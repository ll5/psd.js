const Color = require('../color');

module.exports = {
    setCmykChannels: function() {
        this.channelsInfo = [
            {
                id: 0
            }, {
                id: 1
            }, {
                id: 2
            }, {
                id: 3
            }
        ];
        if(this.channels() === 5) {
            return this.channelsInfo.push({
                id: -1
            });
        }
    },
    combineCmykChannel: function() {
        let cmykChannels = this.channelsInfo.map(function(ch) {
            return ch.id;
        }).filter(function(ch) {
            return ch >= -1;
        });


        for(let i = 0; i < this.numPixels; i++) {
            let c = 0;
            let m = 0;
            let y = 0;
            let k = 0;
            let a = 255;
            cmykChannels.forEach((chan, index) => {
                let val = this.channelData[i + (this.channelLength * index)];
                switch (chan) {
                case -1:
                    a = val;
                    break;
                case 0:
                    c = val;
                    break;
                case 1:
                    m = val;
                    break;
                case 2:
                    y = val;
                    break;
                case 3:
                    k = val;
                }
            });
            let [r, g, b] = Color.cmykToRgb(255 - c, 255 - m, 255 - y, 255 - k)
            this.pixelData.set([r, g, b, a], i * 4);
        }
        return this.readMaskData(cmykChannels);
    }
};
