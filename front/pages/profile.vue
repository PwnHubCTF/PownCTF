<template>
  <div>
    <div>
      <p>Profile</p>
    </div>
    {{ $auth.user }}
    {{ user }}
  </div>
</template>

<script>
export default {
  middleware: "auth",
  data() {
    return {
      user: null,
    };
  },
  async fetch() {
    const user = await this.$api.auth.getMe();
    this.user = user;
  },
};
</script>
