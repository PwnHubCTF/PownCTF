<template>
  <div class="p-4">
    <h1 class="text-4xl text-center font-extrabold text-red-600" v-if="$store.state.ctfOptions.state == 'started'">The CTF is started ! Any changes here can break ctf state</h1>
    <h2>Categories</h2>
    <div class="my-4" v-for="category in categories" :key="category.id">
      <InputEdit
        label="Name"
        :value="category.name"
        :loading="loading"
        @edited="(name) => editCategory(category.id, { name })"
      />
      <InputEdit
        label="Description"
        :value="category.description"
        :loading="loading"
        @edited="(description) => editCategory(category.id, { description })"
      />
      <Button @clicked="deleteCategory(category.id)">- Delete</Button>
    </div>
    <Button @clicked="createCategory">+ New category</Button>
    <div v-for="(value, category) in configsPerCategories" :key="category">
      <h3 class="text-3xl font-bold py-2">{{ category }}</h3>
      <div class="my-2" v-for="config in value" :key="config.key">
        <p class="text-gray-600 text-2xl">{{ config.nkey }}</p>
        <InputEdit
          :label="config.description"
          :type="config.valueType"
          :value="config.value"
          :choices="config.valueChoices"
          :loading="loading"
          @edited="(value) => editConfig(config.key, value)"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: "admin",
  data() {
    return {
      configsPerCategories: null,
      loading: false,
      categories: [],
    };
  },
  async fetch() {
    let configs = await this.$api.config.getAllConfigs();
    this.categories = await this.$api.categories.getAll();
    this.constructCategories(configs);
  },
  methods: {
    async createCategory() {
      await this.$api.categories.create("name", "description");
      this.$toast.success("Category created");
      await this.$fetch();
    },
    async deleteCategory(id) {
      await this.$api.categories.delete(id);
      this.$toast.success("Category deleted");
      await this.$fetch();
    },
    async editCategory(id, payload) {
      await this.$api.categories.edit(id, payload);
      this.$toast.success("Category edited");
      await this.$fetch();
    },
    async editConfig(key, value) {
      try {
        this.loading = true;
        await this.$api.config.editConfig(key, value);
        this.$toast.success("Config edited");
        await this.$fetch();
      } catch (error) {
        if (error.isAxiosError) this.$toast.error(error.response.data.message);
        else this.$toast.error("Fail to edit config");
      } finally {
        this.loading = false;
      }
    },
    constructCategories(configs) {
      this.configsPerCategories = {};
      for (let c of configs) {
        const name = c.key.split(".")[0];
        const nkey = c.key.split(".")[1];
        if (!this.configsPerCategories[name]) {
          this.configsPerCategories[name] = [];
        }
        c.nkey = nkey;
        this.configsPerCategories[name].push(c);
      }
    },
  },
};
</script>
