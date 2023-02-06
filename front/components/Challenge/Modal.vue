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
        <ButtonComment
          class="absolute -top-4 -right-4"
          :challenge="challenge"
        />
      </div>
      <div
        class="text-gray-200 mt-4"
        v-html="$md.render(challenge.description)"
      ></div>
    </div>

    <!-- Connection URL -->
    <div v-if="challenge.challengeUrl">
      <a :href="challenge.challengeUrl" target="_blank">{{
        challenge.challengeUrl
      }}</a>
    </div>
    <div v-if="challenge.instance == 'multiple' && !challenge.solved">
      <ButtonDeployer :challengeId="challenge.id" />
    </div>

    <!-- Files -->
    <div v-if="challenge.files.length > 0">
      <h3 class="text-xl font-medium">
        File<span v-if="challenge.files.length > 1">s</span>
      </h3>
      <div
        class="hover:text-gray-300"
        v-for="file of challenge.files"
        :key="file.id"
      >
        <a target="_blank" :href="`/api/files/${file.id}`">{{ file.name }}</a>
      </div>
    </div>

    <div v-if="!challenge.solved" class="flex">
      <!-- Input for Flag -->
      <InputText
        class="text-black w-4/5"
        type="text"
        v-model="flag"
        @enter="submitFlag"
        placeholder="PWNME{[-_a-zA-Z0-9]*}"
      />
      <!-- TODO remove PWNME placeholer-->
      <!-- Submit Button -->
      <Button
        :loading="loading"
        class="bg-orange-500 text-white w-1/5"
        @clicked="submitFlag"
        >-></Button
      >
    </div>
  </div>
</template>

<script>
export default {
  props: ["challenge"],
  data() {
    return {
      flag: "",
      loading: false,
    };
  },
  methods: {
    async submitFlag() {
      if (this.flag == "") return;
      this.loading = true;
      let result = null;
      try {
        result = await this.$api.challenges.submit(
          this.challenge.id,
          this.flag
        );
      } catch (error) {
        this.$toast.error("Impossible to flag");
      }
      this.$parent.refreshChallenges();
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

      this.loading = false;
      this.flag = "";
    },
    closeModal() {
      this.$emit("closeModal");
    },
  },
};
</script>
