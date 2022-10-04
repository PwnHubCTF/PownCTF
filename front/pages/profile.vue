<template>
  <div>
    <div>Profile</div>
    {{ $auth.user }}
  </div>
</template>

<script>
export default {
  middleware: "auth",
  async asyncData({ $axios }) {
    const rep = await $axios.get('/auth/me')
    console.log(rep);
  }
};
</script>
