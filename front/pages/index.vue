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
    const state = await this.$api.config.getCtfState();
    this.state = state;
  },
};
</script>
