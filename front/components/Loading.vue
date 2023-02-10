<template>
  <div v-if="loading" class="loading-page">
    <div class="loading"></div>
  </div>
</template>
<script>
export default {
  data: () => ({
    loading: false,
  }),
  methods: {
    start() {
      this.loading = true;
    },
    finish() {
      setTimeout(() => {
        this.loading = false;
      }, 500);
    },
  },
};
</script>
<style scoped>
.loading-page {
  position: fixed;
    top: 0;
    left: 13rem;
    width: calc(100% - 13rem);
    height: 100%;
    background: rgba(255, 255, 255, 0.952);
    text-align: center;
    padding-top: 250px;
    font-size: 30px;
    font-family: sans-serif;
    z-index: 1000;
}
.loading {
  display: inline-block;
  width: 3.5rem;
  height: 3.5rem;
  border: 4px solid rgb(7,31,50, 0.705);
  border-radius: 50%;
  border-top-color: rgb(5, 19, 31);
  animation: spin 1s ease-in-out infinite;
}
@keyframes spin {
  to {
    -webkit-transform: rotate(360deg);
  }
}
</style>
