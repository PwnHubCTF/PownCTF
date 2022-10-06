<template>
  <div class="p-4">
    <div v-for="(value, category) in configsPerCategories" :key="category">
      <h3 class="text-3xl font-bold py-2">{{ category }}</h3>
      <div v-for="config in value" :key="config.key">
        <p class="text-gray-800 text-xl">{{ config.nkey }}</p>
        <p class="text-gray-700">{{ config.description }}</p>
        <input type="text" :value="config.value" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: "admin",
  data() {
    return {
      configsPerCategories: {},
    };
  },
  async fetch() {
    let configs = await this.$api.config.getAllConfigs();
    this.constructCategories(configs);
  },
  mounted() {
    console.log("cc");
    this.$fetch();
  },
  methods: {
    async editConfig(key, value) {
      let res = await this.$api.config.editConfig(key, value);
      this.$fetch();
    },
    constructCategories(configs) {
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
