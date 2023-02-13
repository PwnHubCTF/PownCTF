<template>
  <div class="flex">
    <AdminNavbar class="h-screen shrink-0 scrollbar-thin overflow-y-scroll" />
    <Nuxt class="w-full h-screen scrollbar-thin overflow-y-scroll" />
  </div>
</template>

<script>
export default {
  middleware: "admin",
  created() {
    if (process.client) {
      document.title = "Admin - " + this.$store.state.ctfOptions.eventName;
    }
  },
};
</script>
