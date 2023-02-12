<template></template>

<script>
export default {
  mounted() {
    this.$root.socket = this.$nuxtSocket({
      path: "/ws/socket.io",
      auth: {
        jwt: this.$auth.strategy.token.get().split(" ")[1],
      },
    });
    this.$root.socket.on("hello", (data) => {
      this.$toast.success("Connected to CTF server"); 
    });
  },
};
</script>

<style></style>
