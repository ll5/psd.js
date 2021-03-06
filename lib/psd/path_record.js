
const _ = require('lodash');

class PathRecord {
    constructor(file) {
        this.file = file;
        this.recordType = null;
    }

    parse() {
        this.recordType = this.file.readShort();
        switch (this.recordType) {
        case 0:
        case 3:
            return this._readPathRecord();
        case 1:
        case 2:
        case 4:
        case 5:
            return this._readBezierPoint();
        case 7:
            return this._readClipboardRecord();
        case 8:
            return this._readInitialFill();
        default:
            return this.file.seek(24, true);
        }
    };

    export() {
        return _.merge({
            recordType: this.recordType
        }, (function() {
            var ref;
            switch (this.recordType) {
            case 0:
            case 3:
                return {
                    numPoints: this.numPoints
                };
            case 1:
            case 2:
            case 4:
            case 5:
                return {
                    linked: this.linked,
                    closed: ((ref = this.recordType) === 1 || ref === 2),
                    preceding: {
                        vert: this.precedingVert,
                        horiz: this.precedingHoriz
                    },
                    anchor: {
                        vert: this.anchorVert,
                        horiz: this.anchorHoriz
                    },
                    leaving: {
                        vert: this.leavingVert,
                        horiz: this.leavingHoriz
                    }
                };
            case 7:
                return {
                    clipboard: {
                        top: this.clipboardTop,
                        left: this.clipboardLeft,
                        bottom: this.clipboardBottom,
                        right: this.clipboardRight,
                        resolution: this.clipboardResolution
                    }
                };
            case 8:
                return {
                    initialFill: this.initialFill
                };
            default:
                return {};
            }
        }.call(this)));
    };

    isBezierPoint() {
        var ref;
        return (ref = this.recordType) === 1 || ref === 2 || ref === 4 || ref === 5;
    };

    _readPathRecord() {
        this.numPoints = this.file.readShort();
        return this.file.seek(22, true);
    };

    _readBezierPoint() {
        var ref;
        this.linked = (ref = this.recordType) === 1 || ref === 4;
        this.precedingVert = this.file.readPathNumber();
        this.precedingHoriz = this.file.readPathNumber();
        this.anchorVert = this.file.readPathNumber();
        this.anchorHoriz = this.file.readPathNumber();
        this.leavingVert = this.file.readPathNumber();
        this.leavingHoriz = this.file.readPathNumber();
    };

    _readClipboardRecord() {
        this.clipboardTop = this.file.readPathNumber();
        this.clipboardLeft = this.file.readPathNumber();
        this.clipboardBottom = this.file.readPathNumber();
        this.clipboardRight = this.file.readPathNumber();
        this.clipboardResolution = this.file.readPathNumber();
        return this.file.seek(4, true);
    };

    _readInitialFill() {
        this.initialFill = this.file.readShort();
        return this.file.seek(22, true);
    };
}

module.exports = PathRecord;
