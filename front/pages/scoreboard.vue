<template>
  <div class="p-8">
    <div class="font-medium text-xl">Filters</div>
    <div class="flex-col">
      <p @click="mode = 'general'" class="cursor-pointer">General</p>
      <p @click="mode = 'categories'" class="cursor-pointer">
        Per challenge categories
      </p>
    </div>
    <!-- Scoreboard general graph -->
    <Scoreboard v-if="mode == 'general'" :paginate="true" />

    <!-- Per challenge catgegory -->
    <CategoriesScoreboard v-else-if="mode == 'categories'" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      mode: "general",
    };
  },
};
</script>
