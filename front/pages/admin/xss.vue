<template>
  <div class="p-8">
    <div v-if="!error" class="overflow-x-auto relative">
      <h2 v-if="status == true">XSS Bot is ready</h2>
      <h2 v-else>XSS Bot is not ready (mostly a token problem)</h2>
    </div>
    <div v-else>
      <p>XSS Bot seems to be down</p>
      <p class="text-red-400">{{ error }}</p>
    </div>
  </div>
</template>

<script>
export default {
  layout: "admin",
  data() {
    return {
      error: null,
      status: null
    };
  },
  async mounted() {
    try {
    this.status = await this.$api.challenges.getXss();
    } catch (error) {
      this.error = error
    }
  },
};
</script>
