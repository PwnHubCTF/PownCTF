<template>
  <div class="p-4" v-if="playerTotal">
    <div
      v-if="$store.state.ctfOptions.categoryMode"
      class="flex justify-around mt-16"
    >
      <div
        class="md:w-1/3 border rounded-sm bg-gray-100 border-gray-300 p-4 text-center"
        v-for="(stats, index) of playerCategories"
        :key="index"
      >
        <p class="text-2xl">{{ index }}</p>
        <p class="my-4 text-3xl font-bold">Players: {{ stats.players }}</p>
        <p class="my-4" v-if="$store.state.ctfOptions.teamMode">Teams: {{stats.teams}}</p>
      </div>
    </div>
    <div
      class="mt-32 border rounded-sm bg-gray-100 border-gray-300 p-4 text-center mx-auto my-4"
    >
      <p class="text-2xl">Players Total</p>
      <p class="text-3xl font-bold">{{ playerTotal }}</p>
    </div>
    <div v-if="$store.state.ctfOptions.teamMode"
      class="border rounded-sm bg-gray-100 border-gray-300 p-4 text-center mx-auto my-4"
    >
      <p class="text-2xl">Teams Total</p>
      <p class="text-3xl font-bold">{{ teamsTotal }}</p>
    </div>
  </div>
</template>

<script>
export default {
  layout: "admin",
  data() {
    return {
      playerTotal: null,
      playerCategories: {},
      teamsTotal: null
    };
  },
  async fetch() {
    if (this.$store.state.ctfOptions.categoryMode) {
      const playerCategories = await this.$api.categories.getAll();
      for (const category of playerCategories) {
        this.playerCategories[category.name] = {
          players: (
            await this.$api.users.getAllUsers(1, 0, { category: category.id })
          ).count,
        };
        if(this.$store.state.ctfOptions.teamMode){
          this.playerCategories[category.name]['teams'] = (await this.$api.teams.getAdmin(1, 0, {
            category: category.id
          })).count
        }
      }
    }
    this.playerTotal = (await this.$api.users.getAllUsers(1, 0)).count;
    if(this.$store.state.ctfOptions.teamMode){
      this.teamsTotal = (await this.$api.teams.getAdmin(1, 0)).count
    }
  },
  methods: {},
};
</script>
