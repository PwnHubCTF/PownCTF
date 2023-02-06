<template>
  <div class="text-center relative">
    <h1 class="text-6xl font-medium mt-8">{{ $store.state.ctfOptions.eventName }}</h1>
    <div class="text-4xl mt-16">
      <div v-if="$store.state.ctfOptions.state != 'started'" class="">
        <p>
          {{ $store.state.ctfOptions.dates.startAt | moment("DD/MM [at] hh:mm a") }}
          --
          {{ $store.state.ctfOptions.dates.endAt | moment("DD/MM [at] hh:mm a") }}
        </p>
      </div>
      <div v-else><Countdown :end="$store.state.ctfOptions.dates.endAt" /></div>
    </div>
    <div v-if="$store.state.ctfOptions.state != 'nop'" class="mt-8">
      <div v-if="!$auth.loggedIn" class="w-1/4 m-auto">
        <Button
          @clicked="
            showRegister = true;
            showLogin = false;
          "
          >Create an account</Button
        >
        <div class="relative flex pt-2 pb-3 items-center">
          <div class="flex-grow border-t border-gray-300 border-dashed"></div>
          <span class="flex-shrink mx-4 text-gray-500">or</span>
          <div class="flex-grow border-t border-gray-300 border-dashed"></div>
        </div>
        <Button
          @clicked="
            showLogin = true;
            showRegister = false;
          "
          >Login</Button
        >
      </div>
      <div v-else>
        <NuxtLink to="/challenges"> Challenges </NuxtLink>
      </div>
      <div v-if="$store.state.ctfOptions.state == 'started' || $store.state.ctfOptions.state == 'finished'" class="p-16 mx-24">
        <Scoreboard />
      </div>
    </div>
    <div v-else><Loading/></div>
    <Transition name="slide">
      <Login
        class="absolute inset-1/3"
        v-click-outside="closeModals"
        v-if="showLogin"
      />
      <Register
        class="absolute inset-1/3"
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
      showLogin: false,
      showRegister: false,
    };
  },
  directives: {
    clickOutside: vClickOutside.directive,
  },
  methods: {
    closeModals() {
      this.showLogin = false;
      this.showRegister = false;
    },
  },
};
</script>
