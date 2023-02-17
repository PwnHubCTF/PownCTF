<template>
  <div class="p-8">
    <!-- Scoreboard general graph -->
    <Scoreboard v-if="mode == 'general'" :paginate="true"/>
    
    <!-- Per challenge catgegory -->
    <CategoriesScoreboard v-else-if="mode == 'challenges'"/>
  </div>
</template>

<script>
export default {
  data(){
    return {
      mode: 'general'
    }
  }
};
</script>
