<template>
  <div class="text-center relative">
    <h1 class="text-6xl font-medium mt-8">
      {{ $store.state.ctfOptions.eventName }}
    </h1>
    <div class="text-4xl mt-16">
      <div v-if="$store.state.ctfOptions.state == 'waiting'" class="">
        <p>
          {{
            $store.state.ctfOptions.dates.startAt | moment("DD/MM [at] hh:mm a")
          }}
          --
          {{
            $store.state.ctfOptions.dates.endAt | moment("DD/MM [at] hh:mm a")
          }}
        </p>
        <p>
          <Countdown
            @over="startCtf"
            :end="$store.state.ctfOptions.dates.startAt"
          />
        </p>
      </div>
      <div v-else-if="$store.state.ctfOptions.state == 'started'">
        <Countdown
          @over="startCtf"
          :end="$store.state.ctfOptions.dates.endAt"
        />
      </div>
      <div v-else>Over!</div>
    </div>
    <div v-if="$store.state.ctfOptions.state != 'nop'" class="mt-8 relative">
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
            class="absolute top-0 inset-x-1/4 border rounded-lg"
            v-if="showLogin"
          />
          <Register
            v-click-outside="closeModals"
            class="absolute top-0 inset-x-1/4 border rounded-lg"
            v-if="showRegister"
          />
        </Transition>
      </div>
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
    <div v-else><Loading /></div>
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
