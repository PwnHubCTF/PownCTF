<template>
  <div class="p-0 md:p-2 lg:p-8">
    <h2 class="capitalize text-2xl text-center font-medium">{{ category }}</h2>
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
              ? 'bg-primary text-white'
              : 'bg-gray-300 text-gray-900',
          ]"
          v-for="(player, index) of players"
          :key="index"
        >
          <td class="py-2">{{ player.rank }}</td>
          <td v-if="!player.id"></td>
          <td v-else-if="$store.state.ctfOptions.teamMode">
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
    users: {
      type: Array,
    },
    category: {
      type: String,
    },
  },
  data() {
    return {
      players: [],
    };
  },
  watch: {
    users() {
      this.refreshUsers();
    },
  },
  mounted() {
    this.refreshUsers();
  },
  methods: {
    refreshUsers() {
      this.players = this.users;
      while (this.players.length < 3) {
        this.players.push({ rank: this.players.length + 1 });
      }
    },
  },
};
</script>
