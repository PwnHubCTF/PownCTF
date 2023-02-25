<template>
  <div v-click-outside="closeModal">
    <slot />
  </div>
</template>

<script>
import vClickOutside from "v-click-outside";
export default {
  directives: {
    clickOutside: vClickOutside.directive,
  },
  methods: {
    closeModal() {
      this.$emit("closeModal");
    },
  },
};
</script>
