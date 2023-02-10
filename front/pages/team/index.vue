<template>
  <TeamJoin v-if="!$auth.user.teamId" />
  <div v-else-if="team">
    <client-only>
      <p class="text-center text-lg cursor-pointer mt-4 italic" v-tooltip="'Copy'" @click="copyLink()">Direct join link: {{ getDirectLink() }}</p>
    </client-only>

    <TeamView :teamId="team.id"/>
  </div>
</template>

<script>
export default {
  middleware: ["readyCategory", "team"],
  data() {
    return {
      team: null,
      directLink: null,
    };
  },
  async fetch() {
    this.team = await this.$api.teams.getMine();
  },
  async mounted(){
    if(!this.team) this.team = await this.$api.teams.getMine();
  },
  methods: {
    getDirectLink() {
      if (process.client) {
        return `${location.host}/team?join=${this.team.secretHash}`;
      }
    },
    async copyLink(){
      await navigator.clipboard.writeText(this.getDirectLink());
      this.$toast.success('Link copied!')
    }
  },
};
</script>
