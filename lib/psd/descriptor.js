
class Descriptor {
    constructor(file) {
        this.file = file;
        this.data = {};
    }

    parse() {
        this.data['class'] = this.parseClass();
        let numItems = this.file.readInt();
        for(let i = 0; i < numItems; i++) {
            let [id, value] = this.parseKeyItem();
            this.data[id] = value;
        }
        return this.data;
    };

    parseClass() {
        return {
            name: this.file.readUnicodeString(),
            id: this.parseId()
        };
    };

    parseId() {
        var len;
        len = this.file.readInt();
        if(len === 0) {
            return this.file.readString(4);
        }
        else {
            return this.file.readString(len);
        }
    };

    parseKeyItem() {
        var id, value;
        id = this.parseId();
        value = this.parseItem();
        return [id, value];
    };

    parseItem(type) {
        if(type == null) {
            type = null;
        }
        if(type == null) {
            type = this.file.readString(4);
        }
        switch (type) {
        case 'bool':
            return this.parseBoolean();
        case 'type':
        case 'GlbC':
            return this.parseClass();
        case 'Objc':
        case 'GlbO':
            return new Descriptor(this.file).parse();
        case 'doub':
            return this.parseDouble();
        case 'enum':
            return this.parseEnum();
        case 'alis':
            return this.parseAlias();
        case 'Pth':
            return this.parseFilePath();
        case 'long':
            return this.parseInteger();
        case 'comp':
            return this.parseLargeInteger();
        case 'VlLs':
            return this.parseList();
        case 'ObAr':
            return this.parseObjectArray();
        case 'tdta':
            return this.parseRawData();
        case 'obj ':
            return this.parseReference();
        case 'TEXT':
            return this.file.readUnicodeString();
        case 'UntF':
            return this.parseUnitDouble();
        case 'UnFl':
            return this.parseUnitFloat();
        }
    };

    parseBoolean() {
        return this.file.readBoolean();
    };

    parseDouble() {
        return this.file.readDouble();
    };

    parseInteger() {
        return this.file.readInt();
    };

    parseLargeInteger() {
        return this.file.readLongLong();
    };

    parseIdentifier() {
        return this.file.readInt();
    };

    parseIndex() {
        return this.file.readInt();
    };

    parseOffset() {
        return this.file.readInt();
    };

    parseProperty() {
        return {
            'class': this.parseClass(),
            id: this.parseId()
        };
    };

    parseEnum() {
        return {
            type: this.parseId(),
            value: this.parseId()
        };
    };

    parseEnumReference() {
        return {
            'class': this.parseClass(),
            type: this.parseId(),
            value: this.parseId()
        };
    };

    parseAlias() {
        var len;
        len = this.file.readInt();
        return this.file.readString(len);
    };

    parseFilePath() {
        var len, numChars, path, pathSize, sig;
        len = this.file.readInt();
        sig = this.file.readString(4);
        pathSize = this.file.read('<i');
        numChars = this.file.read('<i');
        path = this.file.readUnicodeString(numChars);
        return {
            sig: sig,
            path: path
        };
    };

    parseList() {
        let count = this.file.readInt();
        let items = [];
        for(let i = 0; i < count; i++) {
            items.push(this.parseItem());
        }
        return items;
    };

    parseObjectArray() {
        throw 'Descriptor object array not implemented yet @ ' + (this.file.tell());
    };

    parseRawData() {
        let len = this.file.readInt();
        return this.file.read(len);
    };

    parseReference() {
        let numItems = this.file.readInt();
        let items = [];
        for(let i = 0; i < numItems; i++) {
            let type = this.file.readString(4);
            let value = (function() {
                switch (type) {
                case 'prop':
                    return this.parseProperty();
                case 'Clss':
                    return this.parseClass();
                case 'Enmr':
                    return this.parseEnumReference();
                case 'Idnt':
                    return this.parseIdentifier();
                case 'indx':
                    return this.parseIndex();
                case 'name':
                    return this.file.readUnicodeString();
                case 'rele':
                    return this.parseOffset();
                }
            }.call(this));
            items.push({
                type: type,
                value: value
            });
        }
        return items;
    };

    parseUnitDouble() {
        var unit, unitId, value;
        unitId = this.file.readString(4);
        unit = (function() {
            switch (unitId) {
            case '#Ang':
                return 'Angle';
            case '#Rsl':
                return 'Density';
            case '#Rlt':
                return 'Distance';
            case '#Nne':
                return 'None';
            case '#Prc':
                return 'Percent';
            case '#Pxl':
                return 'Pixels';
            case '#Mlm':
                return 'Millimeters';
            case '#Pnt':
                return 'Points';
            }
        })();
        value = this.file.readDouble();
        return {
            id: unitId,
            unit: unit,
            value: value
        };
    };

    parseUnitFloat() {
        var unit, unitId, value;
        unitId = this.file.readString(4);
        unit = (function() {
            switch (unitId) {
            case '#Ang':
                return 'Angle';
            case '#Rsl':
                return 'Density';
            case '#Rlt':
                return 'Distance';
            case '#Nne':
                return 'None';
            case '#Prc':
                return 'Percent';
            case '#Pxl':
                return 'Pixels';
            case '#Mlm':
                return 'Millimeters';
            case '#Pnt':
                return 'Points';
            }
        })();
        value = this.file.readFloat();
        return {
            id: unitId,
            unit: unit,
            value: value
        };
    };
}

module.exports = Descriptor;
