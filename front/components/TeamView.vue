<template>
  <div class="">
    {{ team }}

    <client-only v-if="team">
      Direct join link: {{ getDirectLink() }}
    </client-only>
  </div>
</template>

<script>
export default {
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
  },
};
</script>
