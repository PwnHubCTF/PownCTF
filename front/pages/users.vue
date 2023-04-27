<template>
  <div class="p-8">
    <div v-if="$store.state.ctfOptions.categoryMode">
      <div class="font-medium text-xl">Categories</div>
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
    <!-- <InputText class="my-2" placeholder="Search by pseudo" v-model="search" /> -->
    <div class="overflow-x-auto relative">
      <TablePaginate
        ref="data"
        :headers="headers"
        :getRoute="$api.users.getAllUsers"
        :filters="filters"
      >
        <template v-slot:pseudo="{ item }">
          <NuxtLink :to="`/user/${item.id}`">{{ item.pseudo }}</NuxtLink>
        </template>
        <template v-slot:category="{ item }">
          <span v-if="item.category">{{ item.category.name }}</span>
        </template>
        <template v-slot:team="{ item }">
          <NuxtLink :to="`/team/${item.team.id}`" v-if="item.team">{{ item.team.name }}</NuxtLink>
        </template>
      </TablePaginate>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      playerCategory: null,
      playerCategories: [],
      // search: "",
      headers: [{ name: "Pseudo", value: "pseudo" }],
    };
  },
  async fetch() {
    if (this.$store.state.ctfOptions.categoryMode) {
      this.playerCategories = await this.$api.categories.getAll();
      this.headers.push({ name: "Category", value: "category" });
    }
    if (this.$store.state.ctfOptions.teamMode) {
      this.headers.push({ name: "Team", value: "team" });
    }
  },
  computed: {
    filters() {
      return {
        category: this.playerCategory?.id,
      };
    },
  },
};
</script>
