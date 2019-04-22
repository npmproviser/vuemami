<template>
  <p class="speech-to-text" :class="{ active: showText }">{{ result }}</p>
</template>

<script>
const SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
const SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
// eslint-disable-next-line prettier/prettier
const SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

export default {
  name: "VuemamiStt",

  props: {
    enabled: {
      type: Boolean,
      default: false
    },
    showText: {
      type: Boolean,
      default: true
    },
    lang: {
      type: String,
      default: "en-US"
    },
    continuous: {
      type: Boolean,
      default: false
    },
    interimResults: {
      type: Boolean,
      default: true
    },
    maxAlternatives: {
      type: Number,
      default: 1
    }
  },

  data() {
    return {
      recognition: {},
      speechRecognitionList: {},
      result: ""
    };
  },

  watch: {
    enabled() {
      this.enabled ? this.recognition.start() : this.recognition.stop();
    }
  },

  methods: {
    onAudioStart(e) {
      this.$emit("audio-start", e);
    },

    onAudioEnd(e) {
      this.$emit("audio-end", e);
    },

    onEnd(e) {
      this.$emit("end", e);
      this.$emit("update:enabled", false);
    },

    onError(e) {
      this.$emit("error", e);
    },

    onNoMatch(e) {
      this.$emit("no-match", e);
    },

    onResult(e) {
      this.$emit("result", e);
      this.result = this.continuous
        ? this.getContinuousTranscript(e.results)
        : e.results[0][0].transcript;
      // this.result = e.results[0][0].transcript;
    },

    onSoundStart(e) {
      this.$emit("sound-start", e);
    },

    onSoundEnd(e) {
      this.$emit("sound-end", e);
    },

    onSpeechStart(e) {
      this.$emit("speech-start", e);
    },

    onSpeechEnd(e) {
      this.$emit("speech-end", e);
    },

    onStart(e) {
      this.$emit("start", e);
    },

    getContinuousTranscript(results) {
      // results is an object, not array, so you need a for loop.
      let continuousTranscript = [];

      for (let i = 0; i < results.length; i++) {
        continuousTranscript.push(results[i][0].transcript);
      }
      // results.map(result => {
      //   console.log(result[0].transcript);
      // });
      // console.log(results);
      return continuousTranscript.join(" / ");
    }
  },

  mounted() {
    this.recognition = new SpeechRecognition();
    this.speechRecognitionList = new SpeechGrammarList();
    this.speechRecognitionList.addFromString(this.grammar, 1);
    this.recognition.grammars = this.speechRecognitionList;
    this.recognition.lang = this.lang;
    this.recognition.continuous = this.continuous;
    this.recognition.interimResults = this.interimResults;
    this.recognition.maxAlternatives = this.maxAlternatives;
    this.recognition.onaudiostart = this.onAudioStart;
    this.recognition.onaudioend = this.onAudioEnd;
    this.recognition.onend = this.onEnd;
    this.recognition.onerror = this.onError;
    this.recognition.onnomatch = this.onNoMatch;
    this.recognition.onresult = this.onResult;
    this.recognition.onsoundstart = this.onSoundStart;
    this.recognition.onsoundend = this.onSoundEnd;
    this.recognition.onspeechstart = this.onSpeechStart;
    this.recognition.onspeechend = this.onSpeechEnd;
    this.recognition.onstart = this.onStart;
  }
};
</script>

<style lang="scss" scoped>
.speech-to-text {
  display: none;
  &.active {
    display: block;
  }
}
</style>
