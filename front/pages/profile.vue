<template>
  <div>
    <div>
      <p>Profile</p>
    </div>
    {{ $auth.user }}
  </div>
</template>

<script>
export default {
  middleware: "auth",
  async fetch() {
    const state = (await this.$axios.get("/auth/me")).data;
    console.log("cc");
  },
};
</script>
