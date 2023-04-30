<template>
  <div v-click-outside="closeModal" :class="{'shake' : animated}">
    <slot />
  </div>
</template>

<script>
import vClickOutside from "v-click-outside";
export default {
  props: {
    sensitive: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      clickedOut: 0,
      animated: false
    };
  },
  directives: {
    clickOutside: vClickOutside.directive,
  },
  methods: {
    closeModal() {
      if(!this.sensitive) return this.$emit("closeModal");
      this.clickedOut++;
      if (this.clickedOut == 2) {
        this.animated = false;
        return this.$emit("closeModal");
      }
      this.animated = true;
      setTimeout(() => {
        this.animated = false;
        this.clickedOut--;
      }, 1000);
    },
  },
};
</script>

<style scoped>
.shake {
  animation: shake .7s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
}
@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }
  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>
