// VUEMAMI
// Add flavor to your Vue app.
// A touchscreen prototyping library for Vue.js.
// - Swipe
// - Drag
// - Pan
// - Pinch
// - Rotate
// - Scroll (pagination and parallax features)
// MEDIA
// - Camera
// - Mic
// - Sound (custom and SoundKit)
// - Haptic
// MOTION
// - Lottie
// MORE INPUT
// - Tilt (Device Orientation)
// - Extra Touch: n-tap, long-press, force-press
// - STT / TTS

import { TimelineLite } from "gsap";

// Swipe Switch Mixin
const VuemamiSwipeSwitch = {
  props: {
    swipe: {
      required: true,
      validator(value) {
        return ["x", "y"].indexOf(value) !== -1;
      }
    },
    snapValues: Array,
    snapState: Number,
    speed: Number
  },

  computed: {
    range() {
      return this.snapValues[this.snapValues.length - 1] - this.snapValues[0];
    }
  },

  watch: {
    snapState() {
      this.snap(this.snapValues[this.snapState]);
    }
  },

  mounted() {
    const translateStart = { x: 0, y: 0 };
    const start = { x: 0, y: 0 };
    const move = { x: 0, y: 0 };
    const delta = { x: 0, y: 0 };

    // Dual-binding.
    this.$on("switchComplete", switchState => {
      this.$emit("update:snapState", switchState);
    });

    // Set initial position.
    this.snap(this.snapValues[this.snapState]);

    this.$el.addEventListener("touchstart", event => {
      translateStart.x = this.getTranslate().x;
      translateStart.y = this.getTranslate().y;
      start.x = this.swipe === "x" ? event.touches[0].screenX : 0;
      start.y = this.swipe === "y" ? event.touches[0].screenY : 0;
    });

    this.$el.addEventListener("touchmove", event => {
      move.x = this.swipe === "x" ? event.touches[0].screenX : 0;
      move.y = this.swipe === "y" ? event.touches[0].screenY : 0;
      delta.x = translateStart.x + move.x - start.x;
      delta.y = translateStart.y + move.y - start.y;

      this.$el.style.transform = `translate(${delta.x}px, ${delta.y}px)`;
      this.$emit("value", this.swipe === "x" ? delta.x : delta.y);
      this.$emit(
        "progress",
        (this.swipe === "x" ? delta.x : delta.y) / this.range
      );
      this.$emit(
        "switch",
        this.snapValues.indexOf(
          this.getClosestSnapValue(this.swipe === "x" ? delta.x : delta.y)
        )
      );
    });

    this.$el.addEventListener("touchend", () => {
      this.snap(this.swipe === "x" ? delta.x : delta.y);
    });
  },

  methods: {
    getTranslate() {
      // "e" and "f" are the X and Y translate values, respectively.
      let { e, f } = new DOMMatrix(this.$el.style.transform);
      return { x: e, y: f };
    },

    getClosestSnapValue(value) {
      // Credit:
      // https://stackoverflow.com/questions/8584902/get-closest-number-out-of-array
      let closest = this.snapValues.reduce((prev, curr) => {
        return Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev;
      });
      return closest;
    },

    snap(value) {
      const timeline = new TimelineLite();

      // Figure out the starting point of the transition.
      // This is the current transform: translate() value.
      const translateStart = this.getTranslate();

      // Figure out the translate() parameters to transition to.
      // These will be the snap value closest to the val
      const translateEnd = {
        x: this.swipe === "x" ? this.getClosestSnapValue(value) : 0,
        y: this.swipe === "y" ? this.getClosestSnapValue(value) : 0
      };
      timeline.fromTo(
        this.$el,
        0.25,
        { x: translateStart.x, y: translateStart.y },
        {
          x: translateEnd.x,
          y: translateEnd.y,
          onUpdate: () => {
            let value =
              this.swipe === "x"
                ? this.getTranslate().x
                : this.getTranslate().y;
            this.$emit("value", value);
            this.$emit("progress", value / this.range);
          },
          onComplete: () => {
            this.$emit(
              "switchComplete",
              this.snapValues.indexOf(this.getClosestSnapValue(value))
            );
          }
        }
      );
    }
  }
};

export default VuemamiSwipeSwitch;
