<template>
  <div class="px-20 pt-16" v-if="!$auth.user?.categoryId">
    <div class="flex px-8 justify-around flex-wrap">
      <div
        class="border w-80 bg-gray-200 rounded-md p-8 cursor-pointer mt-4"
        :class="{ 'border-blue-700': c == category }"
        @click="selectCategory(c)"
        v-for="c in categories"
        :key="c.id"
      >
        <h2 class="text-center text-2xl font-medium my-4">
          {{ c.name }}
        </h2>
        <p>{{ c.description }}</p>
      </div>
    </div>

    <Button
      v-if="category"
      class="mt-16 mx-auto"
      :loading="loading"
      @clicked="join()"
      type="submit"
      >Join {{ category.name }}</Button
    >
  </div>
</template>

<script>
export default {
  middleware: ["directJoinRedirect", "category"],
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
        await this.$api.categories.join(this.category.id);
        await this.$auth.fetchUser();
        this.$toast.success(`You joined ${this.category.name}`);
        const teamJoin = this.$route.query["join"];
        if (teamJoin) {
          this.$router.push(`/team?join=${teamJoin}`);
        } else {
          this.$router.push(`/team`);
        }
      } catch (err) {
        if (err.isAxiosError) this.$toast.error(err.response.data.message);
        this.loading = false;
      }
    },
    selectCategory(category) {
      this.category = category;
    },
  },
};
</script>
