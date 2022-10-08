<template>
  <div>
    <div class="m-8" v-for="(challenges, category) in challenges" :key="category">
      <h2>{{category}}</h2>
      <div v-for="challenge of challenges" :key="challenge.id">
        <Challenge :challenge="challenge" />
      </div>
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