<template>
  <div class="text-center p-8" v-if="team">
    <h1 class="text-4xl font-medium my-8">{{ team.name }}</h1>
    <table class="w-full">
      <thead>
        <tr>
          <th>#</th>
          <th>Player</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody class="text-center">
        <tr
          :class="[
            index % 2 == 0
              ? 'bg-2600blue text-white'
              : 'bg-gray-300 text-gray-900',
          ]"
          v-for="(player, index) of team.users"
          :key="index"
        >
          <td class="py-2">{{ index + 1 }}</td>
          <td>
            <NuxtLink :to="`/user/${player.id}`">{{ player.pseudo }}</NuxtLink>
          </td>
          <td>{{ player.points }}</td>
        </tr>
      </tbody>
    </table>
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
