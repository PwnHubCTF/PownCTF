<template>
  <div>
    <Button :loading="loading" @clicked="fetchFromGit" class="mt-2">
      Get challenges from Github
    </Button>
    <ul class="mt-4" v-if="results.length > 0">
      <li v-for="(result, index) of results" :key="index">
        <p v-if="result.status == 'new'" class="text-green-500">
          [+] New challenge: {{ result.challenge }}
        </p>
        <p v-if="result.status == 'exists'" class="text-orange-500">
          [~] Already exists (skipped): {{ result.challenge }}
        </p>
        <p v-if="result.status == 'error'" class="text-red-500">
          [-] Error (skipped): {{ result.reason }}
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return { results: [], loading: false };
  },
  methods: {
    async fetchFromGit() {
      this.loading = true;
      try {
        let res = await this.$api.challenges.fetchFromGit();
        this.$toast.success("Challenges successfully imported !");
        this.results = res;
        this.$emit("refresh");
        this.loading = false;
      } catch (error) {
        this.$toast.error(error);
      }
    },
  },
};
</script>
