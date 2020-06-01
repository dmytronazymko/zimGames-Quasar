export default {
  computed: {
    vowels () {
      return ['a', 'e', 'i', 'o', 'u', 'ü']
    },
    tones () {
      return {
        a: ['a', 'ā', 'á', 'ǎ', 'à'],
        e: ['e', 'ē', 'é', 'ě', 'è'],
        i: ['i', 'ī', 'í', 'ǐ', 'ì'],
        o: ['o', 'ō', 'ó', 'ǒ', 'ò'],
        u: ['u', 'ū', 'ú', 'ǔ', 'ù'],
        ü: ['ü', 'ū', 'ú', 'ǔ', 'ù']
      }
    }
  },
  methods: {
    generatePinyinDisplay (params) {
      let _value = params.value
      let _color = params.color || '#000'
      let _fontSize = 45
      let _displayContainer
      _displayContainer = new zim.Container()
       
      let _x = 0
      let _pinyin = this.getPinyinDisplay(_value)

      let _label
      _label = new zim.Label({
        text: _pinyin,
        size: _fontSize,
        font: "Comic Sans MS",
        color: _color
      })
      _x += _label.width
      _displayContainer.addChild(_label)
      
      _displayContainer.setBounds(0, 0, _x, _fontSize)
      return _displayContainer
    },
    getPinyinDisplay (syllable) {
      let _tone = syllable[syllable.length - 1]

      if (!isNaN(parseInt(_tone))) {
        /*
        a and e trump all other vowels and always take the tone mark. There are no Mandarin syllables in Hanyu Pinyin that contain both a and e.
        In the combination ou, o takes the mark.
        In all other cases, the final vowel takes the mark.
        */
        let _index = -1
        let _toneTarget = ''
        if (syllable.indexOf('a') !== -1) {
          _index = syllable.indexOf('a')
          _toneTarget = 'a'
        } else if (syllable.indexOf('e') !== -1) {
          _index = syllable.indexOf('e')
          _toneTarget = 'e'
        } else if (syllable.indexOf('ou') !== -1) {
          _index = syllable.indexOf('e')
        } else {
          let _lastIndex = -1
          let _lastVowel = ''
          for (let i = 0; i < this.vowels.length; i++) {
            let _vowelIndex = syllable.indexOf(this.vowels[i])
            if (_vowelIndex !== -1) {
              if (_vowelIndex > _lastIndex) {
                _lastIndex = _vowelIndex
                _lastVowel = this.vowels[i]
              }
            }
          }
          if (_lastVowel !== '') {
            _index = _lastIndex
            _toneTarget = _lastVowel
          }
        }
        if (_index !== -1) {
          return syllable.substring(0, _index) + this.tones[_toneTarget][_tone] + syllable.substring(_index + 1, syllable.length - 1)
        } else {
          return syllable
        }
      } else {
        return syllable
      }
    }
  }
}