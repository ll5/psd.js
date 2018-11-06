const _ = require('lodash');

const TypeTool = require('./typetool');

class LegacyTypeTool extends TypeTool {
    constructor(layer, length) {
        super(layer, length);
        this.transform = {};
        this.faces = [];
        this.styles = [];
        this.lines = [];
        this.type = 0;
        this.scalingFactor = 0;
        this.characterCount = 0;
        this.horzPlace = 0;
        this.vertPlace = 0;
        this.selectStart = 0;
        this.selectEnd = 0;
        this.color = null;
        this.antialias = null;
    }

    static shouldParse(key) {
        return key === 'tySh';
    };

    parse() {
        this.file.seek(2, true);
        this.parseTransformInfo();
        this.file.seek(2, true);
        let facesCount = this.file.readShort();
        for(let i = 0; i < facesCount; i++) {
            this.faces.push(_({}).tap((function(_this) {
                return function(face) {
                    face.mark = _this.file.readShort();
                    face.fontType = _this.file.readInt();
                    face.fontName = _this.file.readString();
                    face.fontFamilyName = _this.file.readString();
                    face.fontStyleName = _this.file.readString();
                    face.script = _this.file.readShort();
                    face.numberAxesVector = _this.file.readInt();
                    face.vector = [];
                    let results = [];
                    for(let j = 0; j < face.numberAxesVector; j++) {
                        results.push(face.vector.push(_this.file.readInt()));
                    }
                    return results;
                };
            })(this)));
        }
        let stylesCount = this.file.readShort();
        for(let i = 0; i < stylesCount; i++) {
            this.styles.push(_({}).tap((function(_this) {
                return function(style) {
                    style.mark = _this.file.readShort();
                    style.faceMark = _this.file.readShort();
                    style.size = _this.file.readInt();
                    style.tracking = _this.file.readInt();
                    style.kerning = _this.file.readInt();
                    style.leading = _this.file.readInt();
                    style.baseShift = _this.file.readInt();
                    style.autoKern = _this.file.readBoolean();
                    _this.file.seek(1, true);
                    // style.leadingFlag = _this.file.readBoolean();
                    style.rotate = _this.file.readBoolean();
                };
            })(this)));
        }
        this.type = this.file.readShort();
        this.scalingFactor = this.file.readInt();
        this.characterCount = this.file.readInt();
        this.horzPlace = this.file.readInt();
        this.vertPlace = this.file.readInt();
        this.selectStart = this.file.readInt();
        this.selectEnd = this.file.readInt();
        let linesCount = this.file.readShort();
        for(let i = 0; i < linesCount; i++) {
            this.lines.push(_({}).tap(function(line) {
                line.charCount = this.file.readInt();
                line.orientation = this.file.readShort();
                line.alignment = this.file.readShort();
                line.actualChar = this.file.readShort();
                line.style = this.file.readShort();
            }));
        }
        this.color = this.file.readSpaceColor();
        this.antialias = this.file.readBoolean();
    };
};

module.exports = LegacyTypeTool;
