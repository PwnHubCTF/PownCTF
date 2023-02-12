<template>
  <div class="flex" v-show="$localStorageLoaded">
    <Navbar
      v-if="$auth.loggedIn"
      class="h-screen shrink-0 scrollbar-thin overflow-y-scroll"
    />
    <transition name="page" mode="out-in">
      <Nuxt
        class="w-full h-screen scrollbar-thin overflow-y-scroll"
      />
    </transition>
    <!-- <Profilebar v-if="$auth.user" class="h-screen scrollbar-thin overflow-y-scroll"></Profilebar> -->
  </div>
</template>

<script>
export default {};
</script>
