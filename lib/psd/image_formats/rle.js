module.exports = {
    parseRLE: function() {
        this.byteCounts = this.parseByteCounts();
        return this.parseChannelData();
    },
    parseByteCounts: function() {
        let results = [];
        for(let i = 0; i < this.channels() * this.height(); i++) {
            results.push(this.file.readShort());
        }
        return results;
    },
    parseChannelData: function() {
        this.chanPos = 0;
        this.lineIndex = 0;
        let results = [];
        for(let i = 0; i < this.channels(); i++) {
            this.decodeRLEChannel();
            results.push(this.lineIndex += this.height());
        }
        return results;
    },
    decodeRLEChannel: function() {
        let results = [];
        for(let j = 0; j < this.height(); j++) {
            let byteCount = this.byteCounts[this.lineIndex + j];
            let finish = this.file.tell() + byteCount;
            results.push(function() {
                let res = [];
                while(this.file.tell() < finish) {
                    let len = this.file.read(1)[0];
                    if(len < 128) {
                        len += 1;
                        let data = this.file.read(len);
                        this.channelData.set(data, this.chanPos);
                        res.push(this.chanPos += len);
                    }
                    else if(len > 128) {
                        len ^= 0xff;
                        len += 2;
                        let val = this.file.read(1)[0];
                        this.channelData.fill(val, this.chanPos, this.chanPos + len);
                        res.push(this.chanPos += len);
                    }
                    else {
                        res.push(void 0);
                    }
                }
                return res;
            }.call(this));
        }
        return results;
    }
};
