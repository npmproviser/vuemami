<template>
  <div>
    <video id="player" autoplay></video>
    <p style="color: #fff">{{ width }}</p>
  </div>
</template>

<script>
export default {
  name: "VuemamiCam",

  props: {
    enabled: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    },
    view: {
      type: String,
      default: "rear",
      validator(value) {
        return ["front", "rear"].indexOf(value) !== -1;
      }
    }
  },

  computed: {
    facingMode() {
      return this.view === "front" ? "user" : "environment";
    }
  },

  watch: {
    enabled() {
      this.enabled ? this.startStream() : this.stopStream();
    },
    view() {
      // Update camera view.
    }
  },

  methods: {
    startStream() {
      // Credit:
      // https://developers.google.com/web/fundamentals/media/capturing-images/
      const player = document.getElementById("player");
      const constraints = {
        video: {
          width: this.width, // For iOS, needs to be 320, 640, or 1280.
          // height: this.height,
          facingMode: this.facingMode
        }
      };
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(stream => {
          player.srcObject = stream;
        })
        .catch(error => console.error(error));
    },

    stopStream() {
      // Credit:
      // https://developers.google.com/web/fundamentals/media/capturing-images/
      const player = document.getElementById("player");
      if (player.srcObject) {
        player.srcObject.getVideoTracks().forEach(track => track.stop());
      }
    },

    recordVideo() {
      // this.$emit("video");
    },

    captureImage() {
      // this.$emit("image");
    }
  },
  mounted() {
    // this.toggleStream();
    this.enabled ? this.startStream() : this.stopStream();
  }
};
</script>

<style lang="scss" scoped>
#player {
  // position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}
</style>
