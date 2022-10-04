<template>
  <div>
    <div>State: {{state}}</div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      state: 'nop'
    }
  },
  fetchOnServer: true,
  async fetch() {
      const state = (await this.$axios.get('/configs/state')).data
      console.log(state);
      this.state = state
  }
};
</script>
