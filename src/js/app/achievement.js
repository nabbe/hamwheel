var $dom = React.DOM;

var Achievement = React.createClass({
  statics : {
    create : function (props, children) {
      return React.createElement(Achievement, props, children);
    }
  },
  componentWillMount : function () {
    this.props.store.on('record', this.receiveRecord);
  },
  componentWillUnmount : function () {
    this.props.store.off('record', this.receiveRecord);
  },
  getInitialState : function () {
    return {
      forward : 0,
      backward : 0,
      speed : 0
    };
  },
  render : function () {
    return $dom.div({
        key : 'achievement-root',
        style : this.props.style || {}
      },
      $dom.div({
        margin : '15px 0',
        key : 'achievement-forward'
      }, 'あなたはこれまで、前に' + this.state.forward + '周回しました。'),
      $dom.div({
        margin : '15px 0',
        key : 'achievement-backward'
      }, 'あなたはこれまで、後ろに' + this.state.backward + '周回しました。'),
      $dom.div({
        margin : '15px 0',
        key : 'achievement-speed'
      }, 'あなたのこれまでの最高速度は 秒速' + ((this.state.speed / 180) * 20).toFixed(2) + 'cm です。')
    );
  },
  receiveRecord : function (record) {
    this.setState(record);
  },
});


module.exports = Achievement;
