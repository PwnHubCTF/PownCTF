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
        <p
          v-if="challenges.length > 0"
          class="text-2xl font-medium mb-4 capitalize"
        >
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
      class="w-72 hidden text-gray-50 md:block fixed inset-y-0 right-0 bg-2600blue scrollbar-thin overflow-y-scroll"
    >
      <!-- Display -->
      <div class="p-4 m-4">
        <h2 class="font-medium text-2xl italic text-gray-200">Display</h2>
        <div class="px-4">
          <p
            @click="$store.commit('localStorage/setView', 'default')"
            class="cursor-pointer py-1 my-1"
          >
            Default
          </p>
          <p
            @click="$store.commit('localStorage/setView', 'detailed')"
            class="cursor-pointer py-1 my-1"
          >
            Detailed
          </p>
          <p
            @click="$store.commit('localStorage/setView', 'list')"
            class="cursor-pointer py-1 my-1"
          >
            Minimalist
          </p>
        </div>
      </div>
      <!-- Filters -->
      <div class="p-4 m-4">
        <h2 class="font-medium text-2xl italic text-gray-200">Filters</h2>
        <div class="px-4">
          <div
            class="my-3 flex justify-between cursor-pointer hover:text-gray-300"
            @click="$store.commit('localStorage/setShowSolved', !showSolved)"
          >
            <!-- Show solved -->
            <p>Solved challenges</p>
            <svg
              class="text-green-100"
              v-if="showSolved"
              aria-hidden="true"
              fill="currentColor"
              width="24"
              height="24"
              viewBox="0 0 576 512"
            >
              <path
                d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"
              />
            </svg>
            <svg
              class="text-red-100"
              v-if="!showSolved"
              aria-hidden="true"
              fill="currentColor"
              width="24"
              height="24"
              viewBox="0 0 640 512"
            >
              <path
                d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z"
              />
            </svg>
          </div>
          <!-- Categories -->
          <div
            v-for="(challenges, category) of challenges"
            :key="category"
            class="cursor-pointer my-1 capitalize flex justify-between hover:text-gray-300"
            @click="$store.commit('localStorage/toggleShowCategory', category)"
          >
            <p>
              {{ category }}
            </p>
            <svg
              class="text-green-100"
              v-if="!showCategories.some((c) => category == c)"
              aria-hidden="true"
              fill="currentColor"
              width="24"
              height="24"
              viewBox="0 0 576 512"
            >
              <path
                d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"
              />
            </svg>
            <svg
              class="text-red-100"
              v-if="showCategories.some((c) => category == c)"
              aria-hidden="true"
              fill="currentColor"
              width="24"
              height="24"
              viewBox="0 0 640 512"
            >
              <path
                d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Challenge slider -->
    <Transition name="slide">
      <ChallengeModal
        class="z-20 fixed top-0 right-0 bottom-0 left-1/3 md:left-2/3 scrollbar-thin overflow-y-scroll"
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
  watch: {
    //TODO modify this. gross
    "$store.state.socket.lastFlag"(val) {
      this.refreshChallenges();

      if (val.blood == 1) {
        this.$toast.error(`${val.user} first blood ${val.challenge} !`);
      }
    },
  },
  computed: {
    showSolved() {
      return this.$store.state.localStorage.userConfig.showSolved;
    },
    view() {
      return this.$store.state.localStorage.userConfig.view;
    },
    showCategories() {
      return this.$store.state.localStorage.userConfig.showCategories;
    },
    filteredChallenges() {
      let filtered = {};
      for (const category in this.challenges) {
        if (
          this.showCategories &&
          this.showCategories.some((c) => category == c)
        )
          continue;
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
