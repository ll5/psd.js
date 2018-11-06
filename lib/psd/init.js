const RSVP = require('rsvp');

module.exports = {
    extended: function(PSD) {
        this.fromURL = function(url) {
            return new RSVP.Promise(function(resolve, reject) {
                let xhr = new XMLHttpRequest();
                xhr.open('GET', url, true);
                xhr.responseType = 'arraybuffer';
                xhr.onload = function() {
                    var data, psd;
                    data = new Uint8Array(xhr.response || xhr.mozResponseArrayBuffer);
                    psd = new PSD(data);
                    psd.parse();
                    return resolve(psd);
                };
                xhr.send(null);
            });
        };
        this.fromEvent = function(e) {
            return new RSVP.Promise(function(resolve, reject) {
                let file = e.dataTransfer.files[0];
                let reader = new FileReader();
                reader.onload = function(e) {
                    var psd;
                    psd = new PSD(new Uint8Array(e.target.result));
                    psd.parse();
                    return resolve(psd);
                };
                reader.onerror = reject;
                reader.readAsArrayBuffer(file);
            });
        };
        this.fromDroppedFile = function(file) {
            return new RSVP.Promise(function(resolve, reject) {
                let reader = new FileReader();
                reader.onload = function(e) {
                    let psd = new PSD(new Uint8Array(e.target.result));
                    psd.parse();
                    return resolve(psd);
                };
                reader.onerror = reject;
                reader.readAsArrayBuffer(file);
            });
        };
    },
};
