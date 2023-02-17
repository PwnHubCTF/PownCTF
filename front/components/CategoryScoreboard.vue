<template>
  <div class="p-0 md:p-2 lg:p-8">
    <h2 class="capitalize text-2xl text-center font-medium">{{category}}</h2>
    <table class="w-full">
      <thead>
        <tr>
          <th>#</th>
          <th v-if="$store.state.ctfOptions.teamMode">Team</th>
          <th v-else>Player</th>
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
          v-for="(player, index) of users"
          :key="index"
        >
          <td class="py-2">{{ player.rank }}</td>
          <td v-if="$store.state.ctfOptions.teamMode">
            <NuxtLink :to="`/team/${player.id}`">{{ player.pseudo }}</NuxtLink>
          </td>
          <td v-else>
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
    category: {
      type: String
    },
    limit: {
      type: Number,
      default: 3
    }
  },
  data() {
    return {
      scoreboard: [],
      loading: false,
      users: {},
    };
  },
  async mounted() {
    this.loading = true;
    
    if (this.$store.state.ctfOptions.teamMode)
        this.users = await this.$api.submissions.getTopTeamsFromChallengeCategory(this.category, this.limit);
      else this.users = await this.$api.submissions.getTopUsersFromChallengeCategory(this.category, this.limit);
    this.loading = false;
  },
  methods: {
    
  },
};
</script>
