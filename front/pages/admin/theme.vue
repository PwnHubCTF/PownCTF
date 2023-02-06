<template>
  <div class="p-4">
    <textarea class="w-full h-2/3 bg-gray-800 text-white"  v-model="theme"></textarea>
    <Button @clicked="setTheme()">Set theme</Button>
  </div>
</template>

<script>
export default {
  layout: "admin",
  data() {
    return {
      theme: "",
    };
  },
  async fetch() {
    await this.getTheme();
  },
  methods: {
    async getTheme() {
      this.theme = await this.$api.default.getTheme();
    },
    async setTheme() {
      await this.$api.default.setTheme(this.theme);
      this.$toast.success("Theme set")
    },
  },
};
</script>
