<template>
  <div class="p-8">
    <div v-if="$store.state.ctfOptions.categoryMode">
      <div class="font-medium text-xl">Player categories Filters</div>
      <p
        class="cursor-pointer rounded p-1"
        :class="{ 'bg-gray-200': playerCategory == null }"
        @click="playerCategory = null"
      >
        All
      </p>
      <div class="flex-col">
        <p
          class="cursor-pointer rounded p-1"
          :class="{ 'bg-gray-200': playerCategory == cat }"
          @click="playerCategory = cat"
          v-for="cat of playerCategories"
          :key="cat.id"
        >
          {{ cat.name }}
        </p>
      </div>
    </div>
    <div class="overflow-x-auto relative">
      <TablePaginate
        :headers="headers"
        :getRoute="$api.teams.getAdmin"
        :filters="filters"
      >
        <template v-slot:name="{ item }">
          <NuxtLink :to="`/team/${item.id}`">{{ item.name }}</NuxtLink>
        </template>
        <template v-slot:players="{ item }">
          {{ item.players }} / {{ $store.state.ctfOptions.maxPlayersPerTeam }}
        </template>
      </TablePaginate>
    </div>
  </div>
</template>

<script>
export default {
  layout: "admin",
  data() {
    return {
      playerCategory: null,
      playerCategories: [],
      headers: [
        { name: "Team name", value: "name" },
        { name: "Count", value: "players" },
      ],
    };
  },
  async fetch() {
    if (this.$store.state.ctfOptions.categoryMode)
      this.playerCategories = await this.$api.categories.getAll();
  },
  computed: {
    filters() {
      return {
        category: this.playerCategory?.id,
      };
    },
  },
  methods: {
    async changeRole(user, role) {
      try {
        await this.$api.users.changeRole(user.id, role);
        user.role = role;
        this.$toast.success("User role changed");
      } catch (error) {
        this.$toast.error("Impossible to change this user rank");
      }
    },
  },
};
</script>
