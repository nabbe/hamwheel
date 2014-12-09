var
  EventEmitter = require('EventEmitter2').EventEmitter2,
  inherits = require('util').inherits
;

var AngulerStore = function (initvalue) {
  if (!(this instanceof AngulerStore)) {
    return new AngulerStore(initvalue);
  }
  
  this.storage = {
    anguler : initvalue || 0,
    angulerTotal : initvalue || 0,
    forwardTotal : 0 <= initvalue ? initvalue : 0,
    backwardTotal : initvalue < 0 ? initvalue : 0,
    inLastSecond : [],
    maxspeed : 0
  };
  this.timer = null;
  EventEmitter.call(this);
};
inherits(AngulerStore, EventEmitter);

AngulerStore.prototype.add = function (addition) {
  var
    prev = this.storage.anguler,
    storage = this.storage
  ;
  storage.angulerTotal += addition;
  
  storage.anguler = storage.angulerTotal % 360;
  if (storage.anguler < 0) {
    storage.anguler += 360;
  }
  
  this._pushNewAngulerDelta(addition);
  
  if (0 <= addition) {
    this._forward(addition);
  } else {
    this._backward(addition);
  }
  
  if (this.anguler < prev) {
    this.emit('turn', Number(this.angulerTotal.toFixid(0)));
  }
};

AngulerStore.prototype.startInterval = function (interval) {
  if (this.timer) { return; }
  
  this.timer = setInterval((function () {
    this.emit('interval', this.storage.anguler);
  }).bind(this), interval);
};

AngulerStore.prototype.stopInterval = function () {
  clearInterval(this.timer);
  this.timer = null;
};

AngulerStore.prototype._pushNewAngulerDelta = function (newdelta) {
  var queue = this.storage.inLastSecond, sum;
  
  queue.push(newdelta);
  sum = queue.reduce(function (a, b) { return a + b; });
  if (this.storage.maxspeed < sum ) {
    this.storage.maxspeed = sum;
    this.emit('record', {speed : sum});
  }
  setTimeout(function () { queue.shift(); }, 1000);
};

AngulerStore.prototype._forward = function (newvalue) {
  if (newvalue < 0) { return; }
  var
    prev = this.storage.forwardTotal,
    prevturn = Number((prev/360).toFixed(0)),
    newturn
  ;
  this.storage.forwardTotal += newvalue;
  newturn = Number((this.storage.forwardTotal/360).toFixed(0));
  if (prevturn < newturn) {
    this.emit('record', {forward : newturn});
  }
};

AngulerStore.prototype._backward = function (newvalue) {
  if (0 <= newvalue) { return; }
  var
    prev = this.storage.backwardTotal,
    prevturn = -1 *  Number((prev/360).toFixed(0)),
    newturn
  ;
  this.storage.backwardTotal += newvalue;
  newturn = -1 * Number((this.storage.backwardTotal/360).toFixed(0));
  if (prevturn < newturn) {
    this.emit('record', {backward : newturn});
  }
};

module.exports = AngulerStore;
