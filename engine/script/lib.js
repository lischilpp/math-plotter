function RGBA(r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
    
    this.getString = function() {
        return 'rgba('+r+',  '+g+', '+b+', '+a+')';
    }
}

var Color = {
    Black: new RGBA(0, 0, 0, 1),
    White: new RGBA(255, 255, 255, 1),
    Red: new RGBA(255, 0, 0, 1),
    Green: new RGBA(0, 255, 0, 1),
    Blue: new RGBA(0, 0, 255, 1),
    LightGray: new RGBA(204, 204, 204, 1),
    Orange: new RGBA(255, 125, 14, 1),
    Purple: new RGBA(183, 23, 255, 1),
    Yellow: new RGBA(255, 255, 0, 1)
}