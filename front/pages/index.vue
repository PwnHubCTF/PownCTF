<template>
  <div class="text-center relative">
    <!-- Name of the CTF -->
    <h1 class="text-6xl font-medium mt-8">
      {{ $store.state.ctfOptions.eventName }}
    </h1>
    <!-- Logo -->
    <div class="w-full">
      <img class="mx-auto" src="~/assets/logo.svg" alt="" />
    </div>
    <!-- Dates -->
    <div class="text-4xl mt-16">
      <div v-if="$store.state.ctfOptions.state == 'waiting'" class="">
        <p>
          {{ $store.state.ctfOptions.dates.startAt | moment("DD/MM, hh:mma") }}
          to
          {{ $store.state.ctfOptions.dates.endAt | moment("DD/MM, hh:mma") }}
        </p>
        <!-- Countdown before start -->
        <p class="text-6xl mt-8">
          <Countdown
            @over="startCtf"
            :end="$store.state.ctfOptions.dates.startAt"
          />
        </p>
      </div>
      <!-- Countdown time remaining -->
      <div v-else-if="$store.state.ctfOptions.state == 'started'">
        <Countdown
          class="text-6xl"
          @over="startCtf"
          :end="$store.state.ctfOptions.dates.endAt"
        />
      </div>
      <div v-else>Over!</div>
    </div>
    <div v-if="$store.state.ctfOptions.state != 'nop'" class="mt-8 relative">
      <!-- Register / Login -->
      <div v-if="!$auth.loggedIn" class="w-3/4 md:w-1/2 xl:w-2/5 m-auto">
        <Button
          v-if="$store.state.ctfOptions.state != 'finished'"
          @clicked="
            showRegister = true;
            showLogin = false;
          "
          >Create an account</Button
        >
        <div
          v-if="$store.state.ctfOptions.state != 'finished'"
          class="relative flex pt-2 pb-3 items-center"
        >
          <div class="flex-grow border-t border-gray-300 border-dashed"></div>
          <span class="flex-shrink mx-4 text-gray-500">or</span>
          <div class="flex-grow border-t border-gray-300 border-dashed"></div>
        </div>
        <Button
          class="bg-white text-black"
          @clicked="
            showLogin = true;
            showRegister = false;
          "
          >Login</Button
        >
        <Transition name="slide">
          <Login
            v-click-outside="closeModals"
            class="absolute -top-20 inset-x-0 md:inset-x-1/4 border rounded-lg"
            v-if="showLogin"
          />
          <Register
            v-click-outside="closeModals"
            class="absolute -top-20 inset-x-0 md:inset-x-1/4 border rounded-lg"
            v-if="showRegister"
          />
        </Transition>
      </div>
      <!-- Discord Btn -->
      <DiscordBtn
        v-if="$store.state.ctfOptions.discordUrl"
        class="m-auto mt-8"
      />
      <!-- Scoreboard -->
      <div
        v-if="
          $store.state.ctfOptions.state == 'started' ||
          $store.state.ctfOptions.state == 'finished'
        "
        class="p-4 mx-4 lg:p-14 lg:mx-20"
      >
        <Scoreboard />
      </div>
    </div>
  </div>
</template>

<style scoped>
.slide-enter-active {
  transition: all 0.2s ease-out;
}

.slide-leave-active {
  transition: all 0.2s ease-out;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0.5;
  scale: 0;
}
.slide-enter {
  opacity: 0.5;
  scale: 0;
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
    startCtf() {
      location.reload();
    },
  },
};
</script>
