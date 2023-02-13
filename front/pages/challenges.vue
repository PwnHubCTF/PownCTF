<template>
  <div v-if="loading" class="p-8 space-y-8 animate-pulse">
    <div v-for="index in 3" :key="index">
      <div class="h-5 mt-3 bg-gray-200 rounded-full w-48"></div>
      <div class="my-3 flex flex-wrap gap-4">
        <div class="w-72 h-36 bg-gray-300"></div>
        <div class="w-72 h-36 bg-gray-300"></div>
        <div class="w-72 h-36 bg-gray-300"></div>
      </div>
    </div>
  </div>

  <div v-else class="relative flex">
    <!-- View list -->
    <div v-if="view == 'list'" class="p-8">
      <ul v-for="(challenges, category) in filteredChallenges" :key="category">
        <p v-if="challenges.length > 0" class="text-2xl font-medium mb-4">
          {{ category }}
        </p>
        <ul class="ml-4">
          <li
            class="cursor-pointer flex relative justify-between custom-list"
            v-for="challenge of challenges"
            :key="challenge.id"
            @click="openChall(challenge)"
          >
            <span></span>
            <p :class="{ 'text-green-400': challenge.solved }">
              {{ challenge.name }}
            </p>
            <span class="text-gray-400 italic ml-4 hidden sm:block"
              >{{ challenge.solves }} solves /
              {{ challenge.points }} points</span
            >
          </li>
        </ul>
      </ul>
    </div>
    <!-- View detailled -->
    <div class="p-8 mr-72" v-else-if="view == 'detailed'">
      <div v-for="(challenges, category) in filteredChallenges" :key="category">
        <h2
          :id="category"
          v-if="challenges.length > 0"
          class="text-4xl font-bold mt-3 capitalize text-gray-800"
        >
          {{ category }}
        </h2>
        <div class="my-3">
          <div
            v-for="challenge of challenges"
            :key="challenge.id"
            class="flex text-white my-2"
          >
            <ChallengeDetailed :challenge="challenge" />
          </div>
        </div>
      </div>
    </div>
    <!-- View default -->
    <div class="p-8 mr-72" v-else>
      <div v-for="(challenges, category) in filteredChallenges" :key="category">
        <h2
          :id="category"
          v-if="challenges.length > 0"
          class="text-4xl font-bold mt-3 capitalize text-gray-800"
        >
          {{ category }}
        </h2>
        <div class="my-3 flex flex-wrap gap-4">
          <div
            v-for="challenge of challenges"
            :key="challenge.id"
            class="flex text-white rounded-xl cursor-pointer"
          >
            <ChallengeTiny
              @click.native="openChall(challenge)"
              :challenge="challenge"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- Config -->
    <div
      class="w-72 hidden text-gray-50 md:block fixed inset-y-0 right-0 bg-2600blue"
    >
      <!-- Display -->
      <div class="p-4 m-4">
        <h2 class="font-medium text-2xl">Display</h2>
        <p
          @click="$store.commit('localStorage/setView', 'default')"
          class="cursor-pointer py-1 my-5"
        >
          Default
        </p>
        <p
          @click="$store.commit('localStorage/setView', 'detailed')"
          class="cursor-pointer py-1 my-5"
        >
          Detailed
        </p>
        <p
          @click="$store.commit('localStorage/setView', 'list')"
          class="cursor-pointer py-1 my-5"
        >
          Minimalist
        </p>
      </div>
      <!-- Filters -->
      <div class="p-4 m-4">
        <h2 class="font-medium text-2xl">Filters</h2>
        <p v-if="!showSolved" @click="$store.commit('localStorage/setShowSolved', true)" class="cursor-pointer">
          Show solved
        </p>
        <p v-if="showSolved" @click="$store.commit('localStorage/setShowSolved', false)" class="cursor-pointer">
          Hide solved
        </p>
      </div>
    </div>

    <!-- Challenge slider -->
    <Transition name="slide">
      <ChallengeModal
        class="z-20 fixed top-0 right-0 bottom-0 left-1/3 md:left-2/3"
        v-if="showChallenge"
        v-click-outside="closeChall"
        @closeModal="closeChall"
        :challenge="showChallenge"
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
  transform: translateX(100%);
}
.slide-enter {
  transform: translate(100%, 0);
}

.custom-list span:first-child {
  background-color: black;
  position: absolute;
  left: -14px;
  height: 1px;
  width: 14px;
  bottom: 10px;
}
.custom-list span:first-child::before {
  background-color: black;
  content: "";
  position: absolute;
  height: 24px;
  width: 1px;
  top: -24px;
}
</style>

<script>
import vClickOutside from "v-click-outside";
export default {
  middleware: "ready",
  data() {
    return {
      challenges: [],
      showChallenge: null,
      loading: true,
    };
  },
  directives: {
    clickOutside: vClickOutside.directive,
  },
  async mounted() {
    if (window.location.hash) {
      setTimeout(() => {
        const el = document.querySelector(window.location.hash.trim());
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 500);
    }
  },
  watch: { //TODO modify this. gross
    '$store.state.socket.lastFlag'(val){
      this.refreshChallenges()

      if(val.blood == 1){
        this.$toast.error(`${val.user} first blood ${val.challenge} !`)
      }
    }
  },
  computed: {
    showSolved() {
      return this.$store.state.localStorage.userConfig.showSolved;
    },
    view() {
      return this.$store.state.localStorage.userConfig.view;
    },
    filteredChallenges() {
      let filtered = {};
      for (const category in this.challenges) {
        filtered[category] = [];
        for (const challenge of this.challenges[category]) {
          if (this.showSolved) {
            filtered[category].push(challenge);
          } else if (!challenge.solved) filtered[category].push(challenge);
        }
      }
      return filtered;
    },
  },
  async fetch() {
    await this.getChallenges();
  },
  methods: {
    closeChall() {
      this.showChallenge = null;
    },
    async openChall(challenge) {
      if (this.showChallenge) {
        setTimeout(() => {
          this.showChallenge = challenge;
        }, 400);
      } else this.showChallenge = challenge;
    },
    async refreshChallenges() {
      const challenges = await this.$api.challenges.getMine();
      this.challenges = challenges;
    },
    async getChallenges() {
      this.loading = true;
      await this.refreshChallenges();
      this.loading = false;
    },
  },
};
</script>
