<template>
  <div class="p-8 relative">
    <div v-for="(challenges, category) in challenges" :key="category">
      <h2
        :id="category"
        class="text-4xl font-bold my-4 capitalize text-gray-700"
      >
        {{ category }}
      </h2>
      <div class="my-3 flex flex-wrap gap-4">
        <ChallengeTiny
          @click.native="openChall(challenge)"
          v-for="challenge of challenges"
          :key="challenge.id"
          :challenge="challenge"
        />
      </div>
    </div>
    <div
      v-if="showChallenge"
      @click="showChallenge = null"
      class="absolute inset-0 z-10 bg-gray-700 bg-opacity-50"
    ></div>
    <ChallengeModal
      class="z-20 absolute inset-0 m-20"
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
    };
  },
  async fetch() {
    const challenges = await this.$api.challenges.getMine();
    this.challenges = challenges;
  },
  methods: {
    async openChall(challenge) {
      this.showChallenge = challenge;
    },
  },
};
</script>
