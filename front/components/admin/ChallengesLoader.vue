<template>
    <div>
        <p @click="fetchFromGit">Refresh</p>

        {{ result }}
    </div>
</template>
  
<script>
export default {
  data() {
    return {result: ""};
  },
  methods: {
    async fetchFromGit(){
      this.result = await this.$api.challenges.fetchFromGit()
    }
  }
};
</script>
  