<template>
  <div
    class="bg-noSolved text-white p-5 flex flex-col justify-between"
    :class="{ 'bg-solved-1': challenge.solved }"
  >
    <div>
      <div class="items-center justify-center relative">
        <div class="flex justify-center">
          <h1 class="text-2xl">{{ challenge.name }}</h1>
        </div>
        <div class="flex justify-center">
          <DifficultyStars class="my-2" :value="challenge.difficulty" />
        </div>
        <CommentButton
          class="absolute -top-4 -right-4"
          :challenge="challenge"
        />
      </div>
      <div
        class="text-gray-200 mt-4"
        v-html="$md.render(challenge.description)"
      />
    </div>

    <!-- Connection URL -->
    <div v-if="challenge.challengeUrl">
      <a :href="challenge.challengeUrl" target="_blank">{{
        challenge.challengeUrl
      }}</a>
    </div>
    <div v-if="challenge.instance == 'multiple' && !challenge.solved">
      <DeployerButton :challengeId="challenge.id" />
    </div>

    <!-- Files -->
    <div>
      <div v-for="file of challenge.files" :key="file.id">
      {{ file }}</div>
    </div>

    <!-- Input for Flag -->
    <InputText
      v-if="!challenge.solved"
      class="text-black"
      type="text"
      v-model="flag"
      @enter="submitFlag"
      placeholder="PWNME{[-_a-zA-Z0-9]*}"
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
