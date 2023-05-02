<template>
  <div class="p-4" v-if="playerTotal">
    <div v-if="$store.state.ctfOptions.categoryMode" class="flex justify-around my-4">
      <div class="md:w-1/3 border rounded-sm bg-gray-100 border-gray-300 p-4 text-center" v-for="(player, index) of playerCategories" :key="index">
        <p class="text-2xl">{{ index }}</p>
        <p class="text-3xl font-bold">{{ player }}</p>
      </div>
    </div>
    <div class="border rounded-sm bg-gray-100 border-gray-300 p-4 text-center mx-auto my-4">
      <p class="text-2xl">Total</p>
      <p class="text-3xl font-bold">{{ playerTotal }}</p>
    </div>
  </div>
</template>

<script>
export default {
  layout: "admin",
  data() {
    return {
      playerTotal: null,
      playerCategories: {}
    };
  },
  async fetch() {
    if (this.$store.state.ctfOptions.categoryMode) {
      const playerCategories = await this.$api.categories.getAll();
      for (const category of playerCategories) {
        this.playerCategories[category.name] = (
          await this.$api.users.getAllUsers(1, 0, { category: category.id })
        ).count;
      }
    }
    this.playerTotal = (await this.$api.users.getAllUsers(1, 0)).count;
  },
  methods: {},
};
</script>
