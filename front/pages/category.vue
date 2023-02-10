<template>
  <div class="p-6" v-if="!$auth.user.categoryId">
    <p class="text-xl">Select a category</p>

    <div class="flex px-8 justify-around flex-wrap">
      <div
        class="border w-80 bg-gray-200 rounded-md p-8 cursor-pointer mt-4"
        :class="{'border-blue-700': c.id == category}"
        @click="selectCategory(c.id)"
        v-for="c in categories"
        :key="c.id"
      >
        <h2 class="text-center text-2xl font-medium my-4">
          {{ c.name }}
        </h2>
        <p>{{ c.description }}</p>
      </div>
    </div>

    <Button class="mt-16" :loading="loading" @clicked="join()" type="submit">Join</Button>
  </div>
</template>

<script>
export default {
  middleware: "category",
  data() {
    return {
      categories: [],
      category: null,
      loading: false,
    };
  },
  async fetch() {
    this.categories = await this.$api.categories.getAll();
  },
  methods: {
    async join() {
      this.loading = true;
      try {
        await this.$api.categories.join(this.category);
        await this.$auth.fetchUser();
        this.$toast.success("You joined a category");
        this.$router.push('/team')
      } catch (err) {
        if (err.isAxiosError) this.$toast.error(err.response.data.message);
      }
      this.loading = false;
    },
    selectCategory(category) {
      this.category = category;
    },
  },
};
</script>
