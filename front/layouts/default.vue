<template>
  <div class="flex">
    <Navbar class="h-screen shrink-0 scrollbar-thin overflow-y-scroll" />
    <transition name="page" mode="out-in">
      <Nuxt class="w-full h-screen scrollbar-thin overflow-y-scroll" />
    </transition>
  </div>
</template>

<script>
export default {

}
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