<template>
  <div class="bg-gray-900 text-white p-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <h1 class="text-3xl">{{ challenge.name }}</h1>
        <DifficultyStars :value="challenge.difficulty" />
      </div>
      <div>
        <CommentButton :challenge="challenge" />
      </div>
    </div>
    <p class="text-gray-200 mt-4">
      {{ challenge.description }}
    </p>
    <InputText
      class="text-gray-900"
      type="text"
      v-model="flag"
      @enter="submitFlag"
    />
  </div>
</template>

<script>
export default {
  props: ["challenge"],
  data() {
    return {
      flag: "",
    };
  },
  methods: {
    async submitFlag() {
      if (this.flag == "") return;
      let result = await this.$api.challenges.submit(
        this.challenge.id,
        this.flag
      );
      if (result == "correct") this.$toast.success("Good job!");
      else if (result == "incorrect") this.$toast.error("Wrong flag..");
      else if (result == "solved")
        this.$toast.error("Challenge already flag");

      this.flag = "";
    },
  },
};
</script>
