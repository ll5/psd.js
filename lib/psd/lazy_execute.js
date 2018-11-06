class LazyExecute {
    constructor(obj, file) {
        this.obj = obj;
        this.file = file;
        this.startPos = this.file.tell();
        this.loaded = false;
        this.loadMethod = null;
        this.loadArgs = [];
        this.passthru = [];
    }

    now() {
        let method = arguments[0]
        let args = arguments.length >= 2 ? [].slice.call(arguments, 1) : [];
        this.obj[method].apply(this.obj, args);
        return this;
    };

    later() {
        let method = arguments[0]
        let args = arguments.length >= 2 ? [].slice.call(arguments, 1) : [];
        this.loadMethod = method;
        this.loadArgs = args;
        return this;
    };

    ignore() {
        let args = arguments.length >= 1 ? [].slice.call(arguments, 0) : [];
        this.passthru.concat(args);
        return this;
    };

    get() {
        var fn
        let ref = this.obj;
        fn = (function(_this) {
            return function(key, val) {
                if(_this[key] != null) {
                    return;
                }
                return Object.defineProperty(_this, key, {
                    get: function() {
                        if(!this.loaded && !([].indexOf.call(this.passthru, key) >= 0)) {
                            this.load();
                        }
                        return this.obj[key];
                    }
                });
            };
        })(this);
        for(let key in ref) {
            let val = ref[key];
            fn(key, val);
        }
        return this;
    };

    load() {
        let origPos = this.file.tell();
        this.file.seek(this.startPos);
        this.obj[this.loadMethod].apply(this.obj, this.loadArgs);
        this.file.seek(origPos);
        this.loaded = true;
    };
}

module.exports = LazyExecute;
