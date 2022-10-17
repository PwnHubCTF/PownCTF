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
/**
 * Scroll with ofset on page load with hash links in the url
 */
const select = (el, all = false) => {
  el = el.trim();
  if (all) {
    return [...document.querySelectorAll(el)];
  } else {
    return document.querySelector(el);
  }
};

window.addEventListener("load", () => {
  if (window.location.hash) {
    if (select(window.location.hash)) {
      scrollto(window.location.hash);
    }
  }
  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select("#header");
    let offset = header.offsetHeight;

    let elementPos = select(el).offsetTop;
    window.scrollTo({
      top: elementPos - offset,
      behavior: "smooth",
    });
  };
});
</script>
