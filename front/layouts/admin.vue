<template>
  <div class="flex">
    <AdminNavbar class="h-screen scrollbar-thin overflow-y-scroll" />
    <Nuxt class="w-full shrink-0 h-screen scrollbar-thin overflow-y-scroll" />
  </div>
</template>

<script>
   export default {
    middleware: 'admin',
  };
</script>