<template>
  <div>
    test
      <div v-if="$nuxt.$loading">load</div>
  </div>
</template>

<script>
export default {
  mounted(){
    this.$nuxt.$loading.start()
  }
};
</script>
