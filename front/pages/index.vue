<template>
  <div>
    <h1 class="text-6xl text-center font-medium mt-8">PWNME 2600</h1>
    <div class="text-center mt-16">
      <p v-if="state == 'started'">Started!</p>
      <p v-if="state != 'started'">Not started</p>
    </div>

    <div v-if="state != 'nop'">
      <div v-if="!$auth.loggedIn">
        <Button @clicked="showRegister = true; showLogin = false">Create an account</Button> or <Button @clicked="showLogin = true; showRegister = false">Login</Button>
      </div>
      <div v-else>
        <NuxtLink to="/challenges">
          Challenges
        </NuxtLink>
      </div>
      <div v-if="state == 'started' || state == 'finished'" class="p-16 mx-24">
        <Scoreboard />
      </div>
    </div>
    <Transition name="slide">
        <Login class="absolute inset-1/3"
        v-click-outside="closeModals"
        v-if="showLogin"
      />
      <Register class="absolute inset-1/3"
      v-click-outside="closeModals"
        v-if="showRegister"
      />
    </Transition>
  </div>
</template>

<style scoped>
.slide-enter-active {
  transition: all 0.4s ease-out;
}

.slide-leave-active {
  transition: all 0.4s ease-out;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateY(-100%);
}
.slide-enter {
  transform: translate(0, -100%);
}
</style>

<script>
import vClickOutside from "v-click-outside";
export default {
  data() {
    return {
      state: "nop",
      showLogin: false,
      showRegister: false,
    };
  },
  directives: {
    clickOutside: vClickOutside.directive,
  },
  async fetch() {
    const state = await this.$api.config.getCtfState();
    this.state = state;
  },
  methods: {
    closeModals(){
      this.showLogin = false
      this.showRegister = false
    }
  }
};
</script>
