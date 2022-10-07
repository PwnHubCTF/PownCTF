<template>
  <div>
    <div class="m-8" v-for="challenge in challenges" :key="challenge.name">
      <Challenge :challenge="challenge" />
    </div>
  </div>
</template>

<script>
export default {
  middleware: "ready",
  data() {
    return {
      challenges: [],
    };
  },
  async fetch() {
    const challenges = await this.$api.challenges.getMine();
    this.challenges = challenges
  },
};
</script>