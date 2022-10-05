<template>
  <div v-if="!$auth.user.teamId">
    <p>You need a team</p>
  </div>
  <div v-else>
    <p>You are in a team</p>
  </div>
</template>

<script>
export default {
  middleware: "team",
  data() {
    return {
      user: null,
    };
  },
  async fetch() {
    const user = await this.$api.auth.getMe();
    this.user = user;
  },
  async mounted() {
    let joinTeam = this.$route.query["join"];
    if (joinTeam) {
      try {
        await this.$api.teams.directJoin(joinTeam);
        await this.$auth.fetchUser();
      } catch (err) {
        if (err.isAxiosError) this.$toast.error(err.response.data.message);
      }
    }
  },
  methods: {
   async joinTeam(name, password) {
      try {
        await this.$api.teams.join(name, password);
        await this.$auth.fetchUser();
      } catch (err) {
        if (err.isAxiosError) this.$toast.error(err.response.data.message);
      }
    },
   async createTeam(name, password) {
      try {
        await this.$api.teams.join(name, password);
        await this.$auth.fetchUser();
      } catch (err) {
        if (err.isAxiosError) this.$toast.error(err.response.data.message);
      }
    },
  },
};
</script>
