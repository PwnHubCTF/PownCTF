<template>
  <div
    class="bg-gray-900 text-white p-5"
    :class="{ 'bg-green-600': challenge.solved }"
  >
    <div class="items-center justify-center relative">
      <div class="flex justify-center">
        <h1 class="text-2xl">{{ challenge.name }}</h1>
      </div>
      <div class="flex justify-center">
        <DifficultyStars class="my-2" :value="challenge.difficulty" />
      </div>
      <CommentButton class="absolute -top-4 -right-4" :challenge="challenge" />
    </div>
    <p class="text-gray-200 mt-4">
      {{ challenge.description }}
    </p>
    <InputText
      v-if="!challenge.solved"
      class="text-gray-900"
      type="text"
      v-model="flag"
      @enter="submitFlag"
      placeholder="Flag"
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
      let result = null;
      try {
        result = await this.$api.challenges.submit(
          this.challenge.id,
          this.flag
        );
      } catch (error) {
        this.$toast.error("Impossible to flag");
      }
      this.$parent.$fetch();
      switch (result) {
        case "correct":
          this.$toast.success("Good job!");
          this.closeModal();
          break;
        case "incorrect":
          this.$toast.error("Wrong flag..");
          break;
        case "solved":
          this.$toast.error("Challenge already flag");
          break;
      }

      this.flag = "";
    },
    closeModal() {
      this.$emit("closeModal");
    },
  },
};
</script>
