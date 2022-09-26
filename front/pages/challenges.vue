<template>
  <div class="">
    <div
      class="bg-green-300 m-8 p-4"
      v-for="challenge in challenges"
      :key="challenge"
    >
      <h1 class="text-3xl">{{ challenge }}</h1>
      <p class="text-gray-700">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis ex
        itaque voluptatum magni molestias soluta dolorem voluptatibus quos
        quibusdam sunt alias provident eos sint labore officiis ad, quod
        assumenda ea.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChallengesPage",
  data() {
    return {
      challenges: ["salut", "pwmne", "sucepute", "salut", "yo"],
    };
  },
};
</script>
