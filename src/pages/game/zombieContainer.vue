<template>
  <zombie-game :questions="questions" :noOfLife="2"></zombie-game>
</template>

<script>
import ZombieGame from './zombie'
export default {
  name: 'zombie-container',
  components: {
    ZombieGame
  },
  computed: {
    questions () {
      return [
        { title: 'Multiple of 3', options: [ {value: 7, correct: false}, {value: 6, correct: true}, {value: 5, correct: false} ] },
        { title: 'Multiple of 2', options: [ {value: 9, correct: false}, {value: 4, correct: true}, {value: 5, correct: false} ] }
      ]
      /*
     return [
        { title: '涌', questionType: 'formation', questionSubtype: 'pinyin',
        subquestions: [
          { type: 'pinyin1', options: [{ value: 'sh', correct: false }, { value: 'ch', correct: true }, { value: 'zh', correct: false }] },
          { type: 'pinyin2', options: [{ value: 'eng', correct: false }, { value: 'ong', correct: true }, { value: 'ang', correct: false }] },
          { type: 'tone', options: [{ display: '{{tone,1}}', value: 1, correct: true }, {  display: '{{tone,2}}', value: 2, correct: false }, {  display: '{{tone,3}}', value: 3, correct: false }, {  display: '{{tone,4}}', value: 4, correct: false }] },
        ]},
        { title: '涌', questionType: 'formation', questionSubtype: 'pinyin', largeContent: true,
        subquestions: [
          { type: 'pinyin1', options: [{ value: 'sh', correct: false }, { value: 'ch', correct: true }, { value: 'zh', correct: false }] },
          { type: 'pinyin2', options: [{ value: 'eng', correct: false }, { value: 'ong', correct: true }, { value: 'ang', correct: false }] },
          { type: 'tone', options: [{ display: '{{tone,1}}', value: 1, correct: true }, {  display: '{{tone,2}}', value: 2, correct: false }, {  display: '{{tone,3}}', value: 3, correct: false }, {  display: '{{tone,4}}', value: 4, correct: false }] },
        ]},
      ]
      */
    }
  }
}
</script>