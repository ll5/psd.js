const moduleKeywords = ['extended', 'included'];

class Module {
    static extends(obj) {
        for(let key in obj) {
            if(moduleKeywords.indexOf(key) < 0) {
                this[key] = obj[key];
            }
        }
        if(obj.extended != null) {
            obj.extended.call(this, this);
        }
    };

    static includes(obj) {
        for(let key in obj) {
            if(moduleKeywords.indexOf(key) < 0) {
                this.prototype[key] = obj[key];
            }
        }
        if(obj.included != null) {
            obj.included.call(this, this);
        }
        return this;
    };

    static delegate() {
        let _arguments = Array.from(arguments);
        let args = _arguments.length ? _arguments.slice(0) : [];
        let target = args.pop();
        let _results = [];
        for(let i = 0; i < args.length; i++) {
            let source = args[i];
            _results.push(this.prototype[source] = target.prototype[source]);
        }
        return _results;
    };

    static aliasFunction(to, from) {
        this.prototype[to] = (function(_this) {
            return function() {
                let _arguments = Array.from(arguments);
                let args = _arguments.length ? _arguments.slice(0) : [];
                return _this.prototype[from].apply(_this, args);
            };
        })(this);
    };

    static aliasProperty(to, from) {
        return Object.defineProperty(this.prototype, to, {
            get: function() {
                return this[from];
            },
            set: function(val) {
                this[from] = val;
            },
        });
    };

    static included(func) {
        return func.call(this, this.prototype);
    };
}

export default Module;
