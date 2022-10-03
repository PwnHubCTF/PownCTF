<template>
  <div class="cursor-pointer bg-green-300 p-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <h1 class="text-3xl">{{ challenge.name }}</h1>
        <DifficultyStars :value="challenge.difficulty" />
      </div>
      <div>
        <CommentIcon :count="challenge.commentCount" />
      </div>
    </div>
    <p class="text-gray-700 mt-4">
      {{ challenge.description }}
    </p>
  </div>
</template>

<script>
export default {
  props: ["challenge"],
};
</script>
