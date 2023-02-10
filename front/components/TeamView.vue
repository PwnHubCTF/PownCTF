<template>
  <div class="text-center p-8" v-if="team">
    <h1 class="text-4xl font-medium my-8">{{ team.name }}</h1>
  </div>
</template>

<script>
export default {
  props: {
    teamId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      team: null,
      submissions: null,
    };
  },
  async fetch() {
    await this.getData();
  },
  async mounted() {
    if (!this.team) await this.getData();
  },
  methods: {
    async getData() {
      this.team = await this.$api.teams.get(this.teamId);
      this.submissions = await this.$api.submissions.forTeam(this.teamId);
    },
  },
};
</script>
