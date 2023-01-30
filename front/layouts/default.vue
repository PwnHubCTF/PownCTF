<template>
  <div class="flex">
    <Navbar class="h-screen shrink-0 scrollbar-thin overflow-y-scroll" />
    <transition name="page" mode="out-in">
      <Nuxt
        class="w-full h-screen scrollbar-thin overflow-y-scroll bg-gray-100"
      />
    </transition>
  </div>
</template>

<script>
export default {};
</script>