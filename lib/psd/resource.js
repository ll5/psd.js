const Util = require('./util');

class Resource {
    constructor(file) {
        this.file = file;
        this.id = null;
        this.type = null;
        this.length = 0;
    }

    parse() {
        var nameLength;
        this.type = this.file.readString(4);
        this.id = this.file.readShort();
        nameLength = Util.pad2(this.file.readByte() + 1) - 1;
        this.name = this.file.readString(nameLength);
        this.length = Util.pad2(this.file.readInt());
    };
};


Resource.Section = require('./resource_section');

module.exports = Resource;
