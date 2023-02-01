<template>
  <div>
    <h1 class="text-6xl text-center font-medium">PWNME 2600</h1>
    <p v-if="state == 'started'">Started!</p>
    <p v-if="state != 'started'">Not started</p>
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
