<template>
  <div class="flex">
    <Navbar class="h-screen shrink-0 scrollbar-thin overflow-y-scroll" />
    <transition name="page" mode="out-in">
      <Nuxt
        class="w-10/12 h-screen scrollbar-thin overflow-y-scroll bg-gray-100"
      />
    </transition>
    <Profilebar class="h-screen scrollbar-thin overflow-y-scroll"></Profilebar>
  </div>
</template>

<script>
export default {};
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.5s;
}
.page-enter,
.page-leave-to {
  opacity: 0;
}
</style>
