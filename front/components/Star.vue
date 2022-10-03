<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    :viewBox="`0 0 ${size} ${size}`"
  >
    <path
      :fill="color"
      :stroke="stroke"
      d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"
    />
  </svg>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: "white",
    },
    stroke: {
      type: String,
      required: false,
    },
    size: {
      type: Number,
      default: 24,
    },
  },
  mounted() {
    // if (!this.stroke) this.stroke = this.color;
  },
};
</script>

<style></style>
