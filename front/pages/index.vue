<template>
  <div class="text-center relative">
    <div v-if="showLogin || showRegister" class="fixed inset-0 z-40 bg-gray-900 bg-opacity-30">
    </div>
    <!-- Login / Sign Up -->
    <div class="fixed left-1/2 z-50">
      <Transition name="slide">
        <Modal @closeModal="showLogin = false; showRegister= false" v-if="showLogin || showRegister" class="relative top-20 -left-1/2 w-96 ">
          <Connection class="bg-white border rounded-md  shadow-2xl" :state="showLogin ? 'login' : 'register'"/>
        </Modal>
      </Transition>
    </div>
    <!-- Name of the CTF -->
    <!-- <h1 class="text-6xl font-medium mt-8">
      {{ $store.state.ctfOptions.eventName }}
    </h1> -->
    <!-- Logo -->
    <div class="w-full mt-16">
      <img style="max-height: 200px;" class="mx-auto w-1/3 xl:w-3/4" src="/api/configs/logo" alt="" />
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
      </div>
      <!-- Discord Btn -->
      <DiscordBtn
        v-if="$store.state.ctfOptions.discordUrl"
        class="m-auto mt-8"
      />
      <div class="mt-4 text-left px-32">
          <!-- Logos -->
          <div class="mt-16 w-full px-8">
            <h3 class="text-4xl text-gray-700 italic my-4">Platinium <hr></h3>
            <div class="flex flex-wrap gap-8 justify-around w-full items-center my-16">
              <img width="450" height="200" src="~/assets/logos/deloitte.png" alt="" srcset="">
              <img width="300" height="100" src="~/assets/logos/comcyber.png" alt="" srcset="">
            </div>
            <h3 class="text-4xl text-gray-700 italic my-4">Gold <hr></h3>
            <div class="flex flex-wrap gap-24 my-16 justify-around w-full items-center">
              <img width="250" height="200" src="~/assets/logos/ozint.png" alt="" srcset="">
              <img width="400" height="100" src="~/assets/logos/randorisec.jpeg" alt="" srcset="">
              <img width="350" height="100" src="~/assets/logos/patrowl.png" alt="" srcset="">
              <img width="300" height="200" src="~/assets/logos/binalyze.png" alt="" srcset="">
              <img width="300" height="200" src="~/assets/logos/leanear.png" alt="" srcset="">
              <img width="450" height="100" src="~/assets/logos/synacktiv.png" alt="" srcset="">
              <img width="250" height="100" src="~/assets/logos/misc.png" alt="" srcset="">
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.slide-enter-active {
  transition: all 0.1s ease-out;
}


.slide-enter-from {
  opacity: 0.5;
}
.slide-enter {
  opacity: 0.5;
}
</style>

<script>
export default {
  data() {
    return {
      showLogin: false,
      showRegister: false,
    };
  },
  methods: {
    startCtf() {
      location.reload();
    },
  },
};
</script>
