<template>
  <div v-if="!$auth.user.categoryId">
    <p>You need to join a category</p>

    <div  v-for="category in categories" :key="category.id">
      <h2>{{category.name}}:</h2>
      <p>{{category.description}}</p>
    </div>

    <form @submit.prevent="join">
      <select v-model="category">
        <option v-for="category in categories" :key="category.id" :value="category.id">{{category.name}}</option>
      </select>
      <Button type="submit">Join</Button>
    </form>
  </div>
  <div v-else>
    <p>You are in a category</p>
  </div>
</template>

<script>
export default {
  middleware: "category",
  data() {
    return {
      categories: [],
      category: null
    };
  },
  async fetch() {
    this.categories = await this.$api.categories.getAll();
  },
  methods: {
    async join() {
      try {
        await this.$api.categories.join(this.category);
        await this.$auth.fetchUser();
        this.$toast.success("You joined a category");
      } catch (err) {
        if (err.isAxiosError) this.$toast.error(err.response.data.message);
      }
    }
  },
};
</script>
