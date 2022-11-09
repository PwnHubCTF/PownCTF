<template>
  <div class="p-8 relative">
    <div v-if="view == 'list'">
      <ul v-for="(challenges, category) in challenges" :key="category">
        {{
          category
        }}
        <ul>
          <li v-for="challenge of challenges" :key="challenge.id">
            {{ challenge.name }}
          </li>
        </ul>
      </ul>
    </div>
    <div v-else>
      <div v-for="(challenges, category) in challenges" :key="category">
        <h2
          :id="category"
          class="text-4xl font-bold my-4 capitalize text-gray-700"
        >
          {{ category }}
        </h2>
        <div class="my-3 flex flex-wrap gap-4">
          <div v-for="challenge of challenges" :key="challenge.id" class="flex">
            <ChallengeTiny
              @click.native="openChall(challenge)"
              :challenge="challenge"
            />
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="showChallenge"
      @click="showChallenge = null"
      class="fixed inset-0 z-10 bg-gray-700 bg-opacity-50"
    ></div>

    <ChallengeModal
      class="z-20 fixed inset-0 m-20"
      v-if="showChallenge"
      @closeModal="showChallenge = null"
      :challenge="showChallenge"
    />
  </div>
</template>

<script>
export default {
  middleware: "ready",
  data() {
    return {
      challenges: [],
      showChallenge: null,
      loading: true,
      view: "default",
    };
  },
  mounted() {
    if (window.location.hash) {
      setTimeout(() => {
        const el = document.querySelector(window.location.hash.trim());
        el.scrollIntoView({ behavior: "smooth" });
      }, 500);
    }
  },
  async fetch() {
    // this.$nuxt.$loading.start()
    this.loading = true;
    const challenges = await this.$api.challenges.getMine();
    this.challenges = challenges;
    this.loading = false;
    // this.$nuxt.$loading.finish()
  },
  methods: {
    async openChall(challenge) {
      this.showChallenge = challenge;
    },
  },
};
</script>
