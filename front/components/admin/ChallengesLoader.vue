<template>
    <div>
        <p class="cursor-pointer" @click="fetchFromGit">Refresh</p>
        <p>Warning: This action will replace existing challenges from github!</p>

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
  