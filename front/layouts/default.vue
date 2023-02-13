<template>
  <div class="flex" v-show="$localStorageLoaded">
    <Socket v-if="$auth.loggedIn" />
    <Navbar
      v-if="$auth.loggedIn"
      class="h-screen shrink-0 scrollbar-thin overflow-y-scroll"
    />
    <transition name="page" mode="out-in">
      <Nuxt class="w-full h-screen scrollbar-thin overflow-y-scroll" />
    </transition>
    <!-- <Profilebar v-if="$auth.user" class="h-screen scrollbar-thin overflow-y-scroll"></Profilebar> -->
  </div>
</template>

<script>
export default {
  created() {
    if (process.client) {
      document.title = this.$store.state.ctfOptions.eventName;
    }
  },
};
</script>
