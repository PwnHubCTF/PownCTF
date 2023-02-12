<template>
  <div class="flex" v-show="$localStorageLoaded">
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
  mounted() {
    let socket = this.$nuxtSocket({
      path: '/ws/socket.io',
      auth: {
        jwt: this.$auth.strategy.token.get().split(' ')[1],
      },
    });

    socket.emit(
      "events",
      {
        hello: "world",
      },
      (resp) => {
        console.log(resp);
      }
    );
  },
};
</script>
