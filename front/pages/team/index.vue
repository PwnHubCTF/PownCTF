<template>
  <TeamJoin v-if="!$auth.user.teamId" />
  <div v-else-if="team">
    <div class="px-8 pt-8">
      <p
        class="text-lg cursor-pointer my-4 italic"
        v-tooltip="'Copy'"
        @click="copyLink()"
      >
        Direct join link: {{ getDirectLink() }}
      </p>
      <h1 class="text-center text-xl">Parameters</h1>
      <div class="flex items-center justify-between">
        <p v-if="team.open">
          Team is <span class="font-bold text-green-500">open</span>. Anyone can
          join without a password
        </p>
        <p v-else>
          Team is <span class="font-bold text-red-500">close</span>. A password
          is needed to join the team.
        </p>
        <Button
          class="w-32"
          :class="[team.open ? 'bg-red-500' : 'bg-green-500']"
          :loading="loading"
          @clicked="toggleOpen"
          >{{ !team.open ? "Open" : "Close" }}</Button
        >
      </div>
    </div>
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
      loading: false,
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
