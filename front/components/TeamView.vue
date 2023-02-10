<template>
  <div class="text-center p-8" v-if="team">
    <h1 class="text-4xl font-medium my-8">{{team.name}}</h1>

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
