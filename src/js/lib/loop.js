var Loop = function (count) {
  if (!(this instanceof Loop)) {
    return new Loop(count);
  }
  this.length = count;
};

Loop.prototype.times = function (callback) {
  var
    len = this.length,
    i = 0
  ;
  for (; i < len; i++) {
    callback(i);
  }
};

Loop.prototype.map = function (callback) {
  var acc = [];
  
  this.times(function (iteration) {
    acc.push(callback(iteration));
  });
  
  return acc;
};

module.exports = Loop;
