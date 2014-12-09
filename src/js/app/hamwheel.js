var
  $dom = React.DOM,
  Loop = require('../lib/loop'),
  RGB = require('../lib/rgb')
;

function deg2rad (degree) {
  return degree * (Math.PI / 180);
}

function round (degree, radius) {
  var rad = deg2rad(degree) ;
  
  return {
    left : radius * Math.cos(rad),
    top  : radius * Math.sin(rad)
  };
}

var HamWheel = React.createClass({
  statics : {
    create : function (props, children) {
      return React.createElement(HamWheel, props, children); 
    }
  },
  componentWillReceiveProps : function (next) {
    if (next.degree) {
      this.setState({anguler : next.degree % 360});
    }
  },
  componentWillMount : function () {
    this.props.store.on('interval', this.receiveAnguler);
  },
  componentWillUnmount : function () {
    this.props.store.off('interval', this.receiveAnguler);
  },
  getInitialState : function () {
    return {anguler : 0};
  },
  render : function () {
    var 
      radius = this.props.radius,
      anguler = this.state.anguler,
      hamstep, spork,
      widthOfStep = radius
    ;
    
    hamstep = Loop(64).map((function (iter) {
      var
        theta = ((iter * (360/64) + 90) + anguler) % 360,
        position = round(theta, radius),
        border = '1px black solid',
        height = (2 * radius * Math.sin(deg2rad(360/64)/2))
      ;
      
      return $dom.div({
        key : 'hamwheel-' + iter,
        style : {
          position : 'absolute',
          transform : 'rotateZ(' + theta + 'deg)' +
                      'rotateY(-90deg)',
          top : position.top - (height / 2),
          left : position.left - (widthOfStep / 2),
          margin : 0,
          padding : 0,
          border : border,
          background : RGB(0xF0, 0xC0, 0xE0)
                      .darken(Math.pow(Math.abs(90 - (theta % 180)) / 90, 2))
                      .toCSSColor(),
          width : widthOfStep + 'px',
          height : height + 'px',
          backfaceVisibility : 'hidden'
        }
      });
    }).bind(this));
    
    spork = Loop(3).map((function (iter) {
      return $dom.div({
        key : 'hamwheel-spoke-' + iter,
        style : {
          position : 'absolute',
          width : radius + 'px',
          height : '100px',
          background : RGB(0xF0, 0xC0, 0xE0).toCSSColor(),
          border : '1px black solid',
          top : '-50px',
          left : 0,
          transform : 'rotateZ(' + (((120 * iter) + anguler) % 360) + 'deg)' + 
                      'translateZ(' + (widthOfStep/2) +'px)',
          transformOrigin : 'left 50% 0'
        }
      });
    }).bind(this));
    
    return $dom.div({
        key : 'hamwheel',
        style : {
          position : 'relative',
          margin : 0,
          padding : 0,
          width : '100%',
          height : window.innerHeight + 'px',
          border : 'none',
          transformStyle : 'preserve-3d',
          perspective : radius,
          perspectiveOrigin : '53% 50%'
        },
        onMouseDown : this.handleMouseDown
      }, $dom.div({
        key : 'hamwheel-object',
        style : {
            position : 'absolute',
            top : '50%',
            left : '50%',
            width : 0,
            height : 0,
            margin : 0,
            padding : 0,
            border : 0,
            transform : 'rotateY(90deg) translateX(-' + radius + 'px) '+
                        'perspective(' + radius * 2 + 'px)',
            transformStyle : 'preserve-3d'
          }
        },
        spork.concat(hamstep)
      )
    );
  },
  handleMouseDown : function (e) {
    if (this.props.onStartRunning) {
      this.props.onStartRunning(0);
    }
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  },
  handleMouseMove : function (e) {
    if (this.props.onRunning) {
      this.props.onRunning(this.mosuemoveToDegree(e.movementY));
    }
  },
  handleMouseUp : function (e) {
    if (this.props.onEndRunning) {
      this.props.onEndRunning(this.mosuemoveToDegree(e.movementY));
    }
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  },
  mosuemoveToDegree : function (yaxis) {
    return this.props.degreeParPx * yaxis ;
  },
  receiveAnguler : function (anguler) {
    this.setState({anguler : anguler});
  }
  
});

module.exports = HamWheel;
