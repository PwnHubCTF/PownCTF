<template>
  <div class="p-4">
    <div v-for="(value, category) in configsPerCategories" :key="category">
      <h3 class="text-3xl font-bold py-2">{{ category }}</h3>
      <div class="my-2" v-for="config in value" :key="config.key">
        <p class="text-gray-400 text-xl">{{ config.nkey }}</p>
        <InputEdit
          :label="config.description"
          :type="config.valueType"
          :value="config.value"
          :choices="config.valueChoices"
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
    };
  },
  async fetch() {
    let configs = await this.$api.config.getAllConfigs();

    this.constructCategories(configs);
  },
  methods: {
    async editConfig(key, value) {
      try {
        await this.$api.config.editConfig(key, value);
        this.$toast.success("Config edited");
        this.$fetch();
      } catch (error) {
        this.$toast.error("Fail to edit config");
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
