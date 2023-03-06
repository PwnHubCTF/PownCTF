<template>
  <TeamJoin v-if="!$auth.user.teamId" />
  <div v-else-if="team">
    <client-only>
      <p
        class="text-center text-lg cursor-pointer mt-4 italic"
        v-tooltip="'Copy'"
        @click="copyLink()"
      >
        Direct join link: {{ getDirectLink() }}
      </p>
    </client-only>
    <Button :loading="loading" @clicked="toggleOpen">{{ !team.open ? 'Open' : 'Close' }}</Button>
    <TeamView :teamId="team.id" />
  </div>
</template>

<script>
export default {
  middleware: ["directJoinRedirect", "readyCategory", "team"],
  data() {
    return {
      team: null,
      directLink: null,
      loading: false
    };
  },
  async fetch() {
    this.team = await this.$api.teams.getMine();
  },
  methods: {
    async toggleOpen() {
      this.loading = true;
      await this.$api.teams.setOpen(!this.team.open);
      this.team = await this.$api.teams.getMine();
      this.loading = false;
    },
    getDirectLink() {
      if (process.client) {
        return `${location.host}/team?join=${this.team.secretHash}`;
      }
    },
    async copyLink() {
      await navigator.clipboard.writeText(this.getDirectLink());
      this.$toast.success("Link copied!");
    },
  },
};
</script>
