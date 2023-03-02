<template>
  <div class="p-4">
    <h1 class="text-4xl text-center font-extrabold text-red-600 mb-8" v-if="$store.state.ctfOptions.state == 'started'">The CTF is started ! Any changes here can break ctf state</h1>
    <h1 class="font-bold text-4xl my-8 text-center">Player categories</h1>
    <div class="flex px-8 justify-around flex-wrap my-4">
      <div
        class="border w-80 bg-gray-200 rounded-md p-8 mt-4"
        v-for="category in categories"
        :key="category.id"
      >
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
      <Button class="w-1/2" @clicked="deleteCategory(category.id)">- Delete</Button>
      </div>
      <Button class="bg-orange-600 rounded-xl w-40 h-20 mt-16" @clicked="createCategory"><span class="text-xl">+ Add a new category</span></Button>
    </div>
    <h1 class="font-bold text-4xl my-8 text-center">CTF Logo</h1>
    <div class="flex items-center">
      <input accept=".svg" type="file" name="file" @change="setLogo">
      <img v-if="!uploadImage" style="max-height: 50px;" class="w-1/5 ml-16" src="/api/configs/logo" alt="" />
      <div v-else>Uploading..</div>
    </div>
    <h1 class="font-bold text-4xl my-8 text-center">CTF Configuration</h1>
    <div v-for="(value, category) in configsPerCategories" :key="category">
      <h3 class="text-3xl font-bold text-gray-800 py-2 italic">{{ category }}</h3>
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
      uploadImage: false
    };
  },
  async fetch() {
    let configs = await this.$api.config.getAllConfigs();
    this.categories = await this.$api.categories.getAll();
    this.constructCategories(configs);
  },
  methods: {
    async createCategory() {
     try {
       await this.$api.categories.create("name", "description");
      this.$toast.success("Category created");
      await this.$fetch();
     } catch(e){
        this.$toast.error("Fail add category (name may already exists)");
     }
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
    async setLogo(e){
      this.uploadImage = true
      const file = e.target.files[0]
      await this.$api.config.postLogo(file);
      this.uploadImage = false
      this.$toast.success('Image uploaded! You may need to refresh the page to see new logo')
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
