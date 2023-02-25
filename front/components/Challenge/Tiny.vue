<template>
  <div
    class="p-5 w-72 rounded-xl bg-2600blue"
    :class="{ 'bg-green-400': challenge.solved }"
  >
    <div class="items-center justify-center relative">
      <div class="flex justify-center">
        <h1 class="text-2xl font-semibold">{{ challenge.name | truncate(16) }}</h1>
      </div>
      <div class="flex justify-center text-gray-400">
        {{ challenge.solves }} solves / {{ challenge.points }} points
      </div>
      <div class="flex justify-center">
        <DifficultyStars class="my-2" :value="challenge.difficulty" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["challenge"],
};
</script>
