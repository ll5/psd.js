module.exports = {
    toBase64: function() {
        let canvas = document.createElement('canvas');
        canvas.width = this.width();
        canvas.height = this.height();
        let context = canvas.getContext('2d');
        let imageData = context.getImageData(0, 0, this.width(), this.height());
        let pixelData = imageData.data;
        this.pixelData.forEach((pixel, i) => {
            pixelData[i] = pixel;
        })
        context.putImageData(imageData, 0, 0);
        return canvas.toDataURL('image/png');
    },
    toPng: function() {
        var dataUrl, image;
        dataUrl = this.toBase64();
        image = new Image();
        image.width = this.width();
        image.height = this.height();
        image.src = dataUrl;
        return image;
    },
    saveAsPng: function() {
        throw 'Not available in the browser. Use toPng() instead.';
    }
};


