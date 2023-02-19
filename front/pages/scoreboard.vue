<template>
  <div class="p-8">
    <div class="flex gap-16">
      <div>
        <div class="font-medium text-xl">Filters</div>
        <div class="flex-col">
          <p @click="mode = 'general'" :class="{'bg-gray-200': mode == 'general'}" class="cursor-pointer rounded p-1">General</p>
          <p @click="mode = 'categories'" :class="{'bg-gray-200': mode == 'categories'}" class="cursor-pointer rounded p-1">
            Per challenge categories
          </p>
        </div>
      </div>
      <div v-if="$store.state.ctfOptions.categoryMode">
        <div class="font-medium text-xl">Player categories Filters</div>
        <p class="cursor-pointer  rounded p-1" :class="{'bg-gray-200': playerCategory == null}" @click="playerCategory = null">All</p>
        <div class="flex-col">
          <p class="cursor-pointer  rounded p-1" :class="{'bg-gray-200': playerCategory == cat}" @click="playerCategory = cat" v-for="cat of playerCategories" :key="cat.id">{{ cat.name }}</p>
        </div>
      </div>
    </div>

    <!-- Scoreboard general graph -->
    <Scoreboard v-if="mode == 'general'" :playerCategory="playerCategory" :paginate="true" />

    <!-- Per challenge catgegory -->
    <CategoriesScoreboard :playerCategory="playerCategory" v-else-if="mode == 'categories'" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      mode: "general",
      playerCategories: [],
      playerCategory: null
    };
  },
  async fetch() {
    if (this.$store.state.ctfOptions.categoryMode)
      this.playerCategories = await this.$api.categories.getAll();
  },
};
</script>
