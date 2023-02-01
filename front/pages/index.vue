<template>
  <div>
    <h1 class="text-6xl text-center font-medium mt-8">PWNME 2600</h1>
    <div class="text-center mt-16">
      <p v-if="state == 'started'">Started!</p>
      <p v-if="state != 'started'">Not started</p>
    </div>

    <div v-if="state != 'nop'">
      <Button>Create an account</Button> or <Button>Login</Button>
      <div v-if="state == 'started' || state == 'finished'" class="p-16 mx-24">
        <Scoreboard />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  middleware: "guest",
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
