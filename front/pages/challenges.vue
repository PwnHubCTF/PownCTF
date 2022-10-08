<template>
  <div class="p-8">
    <div v-for="(challenges, category) in challenges" :key="category">
      <h2 class="text-4xl font-bold my-4 capitalize text-gray-700">{{category}}</h2>
      <div class="my-3" v-for="challenge of challenges" :key="challenge.id">
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