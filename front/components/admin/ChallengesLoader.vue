<template>
  <div>
    <p>Warning: This action will replace existing challenges from github!</p>

    <Button
      :loading="loading"
      @clicked="fetchFromGit"
      class="mt-2"
    >
      Get challenges from Github
    </Button>
    {{ result }}
  </div>
</template>

<script>
export default {
  data() {
    return { result: "", loading: false };
  },
  methods: {
    async fetchFromGit() {
      this.loading = true;
      let res = await this.$api.challenges.fetchFromGit();
      if(res == true) this.$toast.success("Challenges successfully imported !");
      else this.$toast.error(res);
      this.$emit("refresh");
      this.loading = false;
    },
  },
};
</script>
