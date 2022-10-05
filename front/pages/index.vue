<template>
  <div>
    <div>State: {{ state }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      state: "nop",
    };
  },
  async fetch() {
    const state = (await this.$axios.get("/configs/state")).data;
    this.state = state;
  },
};
</script>
