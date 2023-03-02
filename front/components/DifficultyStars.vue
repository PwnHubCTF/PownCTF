<template>
  <div v-tooltip="getDifficultyTxt()">
    <div v-if="value == 0" style="height: 24px"></div>
    <div v-else-if="value <= 3" class="flex items-center mx-1">
      <Star v-for="index in value" :key="index" class="mx-1" color="yellow" />
    </div>
    <div v-else class="flex items-center mx-1">
      <Star
        v-for="index in 3"
        :key="index"
        class="ml-1"
        color="yellow"
        stroke="red"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: ["value"],
  methods: {
    getDifficultyTxt(){
      switch (this.value) {
        case 0:
          return 'Intro'
          break;
        case 1:
          return 'Easy'
          break;
        case 2:
          return 'Medium'
          break;
        case 3:
          return 'Hard'
          break;
        case 4:
          return 'Insane'
          break;
      
        default:
          break;
      }
    }
  },
};
</script>

<style></style>
