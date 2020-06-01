export default {
  methods: {
    generateClock (params) {
      let _value = params.value
      let _color = params.color || '#000'
      let _fontSize = 45
      let _x = 0
      let _displayContainer = new zim.Container()

      let _hour = _value.split(':')[0]
      let _minute = _value.split(':')[1]

      let _radius = _fontSize

      let _circleShape = new zim.Shape()
      _circleShape.graphics.setStrokeStyle(1).beginStroke("#000000").beginFill("rgba(255, 255, 255, 0.9)").drawCircle(_x + _radius, _radius / 2, _radius).endStroke()
      _displayContainer.addChild(_circleShape)

      let _centerCircleShape = new zim.Shape()
      _centerCircleShape.graphics.setStrokeStyle(1).beginStroke(_color).drawCircle(_x + _radius, _radius / 2, _radius / 20).endStroke()
      _displayContainer.addChild(_centerCircleShape)

      let _lineShape = new zim.Shape()
      _lineShape.graphics.setStrokeStyle(1)
      for (let i = 0; i < 12; i++) {
        let _degree = 30 * i
        let _radian = _degree / 180 * Math.PI
        let _dx = Math.sin(_radian) * _radius
        let _dy = Math.cos(_radian) * -1 * _radius
        _lineShape.graphics.beginStroke(_color).moveTo(_x + _radius + _dx * 9 / 10, _radius / 2 + _dy * 9 / 10).lineTo(_x + _radius + _dx, _radius / 2 + _dy)

        let _text = new zim.Label({
          text: i == 0 ? 12 : i,
          size: _radius * 0.3,
          font: 'Comic Sans MS',
          color: _color,
          align: 'center',
          valign: 'center'
        })
        _text.x = _x + _radius + _dx * 0.75
        _text.y = _radius / 2 + 1 + _dy * 0.75
        _displayContainer.addChild(_text)
      }
      _lineShape.graphics.endStroke()
      _displayContainer.addChild(_lineShape)

      let _hourHand = new zim.Shape()
      _hourHand.x = _radius
      _hourHand.y = _radius / 2
      _hourHand.graphics.setStrokeStyle(1)
      _hourHand.graphics.beginStroke("rgba(0, 0, 0, 0.8)").moveTo(0, 0).lineTo(0, -_radius / 2).lineTo(-2, -_radius/2 + 2).moveTo(0, -_radius / 2).lineTo(2, -_radius/2 + 2)
      _displayContainer.addChild(_hourHand)
      _hourHand.rotation = 30 * ((_hour % 12) + (_minute % 60) / 60)

      let _minuteHand = new zim.Shape()
      _minuteHand.x = _x + _radius
      _minuteHand.y = _radius / 2
      _minuteHand.graphics.setStrokeStyle(1)
      _minuteHand.graphics.beginStroke("rgba(0, 0, 0, 0.8)").moveTo(0, 0).lineTo(0, -_radius * 2 / 3).lineTo(-2, -_radius * 2 / 3 + 3).moveTo(0, -_radius * 2 / 3).lineTo(2, -_radius * 2 / 3 + 3)
      _displayContainer.addChild(_minuteHand)
      _minuteHand.rotation = 6 * (_minute % 60)

      _displayContainer.setBounds(0, 0, _fontSize * 2, _fontSize)

      return _displayContainer
      
    },
    generateFraction (params) {
      let _value = params.value
      let _color = params.color || '#000'
      let _fontSize = 45
      let _x = 0
      let _displayContainer = new zim.Container()
      let _numeratorLabel, _denomeratorLabel
      let _numerator, _denomerator
      let _fraction
      let _integerLabel

      if (_value.split(' ').length === 2) {
        // with integer
        _integerLabel = new zim.Label({
          text: _value.split(' ')[0],
          size: _fontSize,
          font: "Comic Sans MS",
          color: _color
        })

        _displayContainer.addChild(_integerLabel)
        _x += _integerLabel.width

        _fraction = _value.split(' ')[1]
      } else {
        // without integer
        _fraction = _value
      }

      _denomerator = _fraction.split('/')[1]
      _numerator = _fraction.split('/')[0]

      _numeratorLabel = new zim.Label({
        text: _numerator,
        size: _fontSize,
        font: "Comic Sans MS",
        color: _color
      })

      _denomeratorLabel = new zim.Label({
        text: _denomerator,
        size: _fontSize,
        font: "Comic Sans MS",
        color: _color
      })
      _numeratorLabel.y = -_fontSize / 2
      _denomeratorLabel.y = _fontSize / 2
      let _fractionWidth = Math.max(_numeratorLabel.width, _denomeratorLabel.width, _fontSize)
      

      _numeratorLabel.x = _x + (_fractionWidth - _numeratorLabel.width) / 2
      _denomeratorLabel.x = _x + (_fractionWidth - _denomeratorLabel.width) / 2

      let _fractionBar = new zim.Shape()
      let _g = _fractionBar.graphics.beginStroke()
      _g.beginStroke(_color).setStrokeStyle(3).moveTo(_x,_fontSize / 2).lineTo(_x + _fractionWidth,_fontSize / 2)

      _displayContainer.addChild(_numeratorLabel, _denomeratorLabel, _fractionBar)

      _x += _fractionWidth

      _displayContainer.setBounds(0, 0, _x, _fontSize)

      return _displayContainer
    }
  }
}