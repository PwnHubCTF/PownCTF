<template>
  <div class="">
    {{ team }}
    <br>
    {{ submissions }}
  </div>
</template>

<script>
export default {
  middleware: "team",
  data() {
    return {
      team: null,
      submissions: []
    };
  },
  async fetch() {
    this.team = await this.$api.teams.get(this.$route.params.id);
    this.submissions = await this.$api.submissions.forTeam(this.$route.params.id);
  },
};
</script>
