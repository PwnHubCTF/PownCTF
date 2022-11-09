<template>
  <div v-if="value <= 3" class="flex items-center mx-1">
    <Star v-for="index in value" :key="index" class="mx-1" color="yellow" />
    <Star v-for="index in 3 - value" :key="index+10" class="mx-1" color="white" />
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
</template>

<script>
export default {
  props: ["value"],
};
</script>

<style></style>
