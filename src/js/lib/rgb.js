var Rgb = function (r, g, b) {
  if (!(this instanceof Rgb)) {
    return new Rgb(r, g, b);
  }
  
  this.red = r;
  this.green = g;
  this.blue = b;
};

Rgb.integral = function (value) {
  return Math.max(0, Math.min(255, Number(value.toFixed(0))));
};

Rgb.prototype.darken = function (ratio) {
  this.red = Rgb.integral(this.red * ratio);
  this.green = Rgb.integral(this.green * ratio);
  this.blue = Rgb.integral(this.blue * ratio);
  return this;
};

Rgb.prototype.toCSSColor = function () {
  return 'rgb(' + this.red + ',' + this.green + ',' + this.blue + ')'; 
};

module.exports = Rgb;
