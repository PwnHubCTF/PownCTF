<template>
  <div
    class="p-5 w-72 rounded-xl bg-2600blue"
    :class="{ 'bg-solved-1 hover:bg-solved-2': challenge.solved }"
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
      <ButtonComment
        @click.native="openComment"
        class="absolute -top-4 -right-4 z-10"
        :challenge="challenge"
      />
    </div>
    <!-- <p class="text-gray-200 mt-4">
      {{ challenge.description }}
    </p> -->
    <!-- <InputText
      v-if="!challenge.solved"
      class="text-gray-900"
      type="text"
      v-model="flag"
      @enter="submitFlag"
    /> -->
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
      this.$parent.$fetch();
      if (result == "correct") this.$toast.success("Good job!");
      else if (result == "incorrect") this.$toast.error("Wrong flag..");
      else if (result == "solved") this.$toast.error("Challenge already flag");

      this.flag = "";
    },
    async openComment(e) {
      console.log("openComment");
    },
  },
};
</script>
