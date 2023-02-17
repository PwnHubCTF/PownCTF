<template>
  <div class="p-0 md:p-2 lg:p-8 grid md:grid-cols-2 xl:grid-cols-3 gap-4">
    <CategoryScoreboard v-for="category in categories" :key="category" :category="category" :limit="3"/>
  </div>
</template>

<script>

export default {
    data(){
      return {

      }
    },
  computed: {
    categories(){
      return this.$store.state.categories
    } 
  },
    mounted(){

    }
};
</script>
