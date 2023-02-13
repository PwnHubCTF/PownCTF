<template>
  <div
    class="bg-gray-800 text-white p-5 flex flex-col justify-between"
    :class="{ 'border-8 border-green-400': challenge.solved }"
  >
    <div class="mb-4">
      <div class="items-center text-center justify-center relative">
        <p class="font-thin text-gray-400 mb-2">
          {{ challenge.solves }} solves / {{ challenge.points }} points
        </p>
        <h1 class="text-2xl font-bold">{{ challenge.name }}</h1>
        <div class="flex justify-center">
          <DifficultyStars class="my-2" :value="challenge.difficulty" />
        </div>
        <ButtonComment
          class="absolute -top-4 -left-4"
          :challenge="challenge"
          @click.native="showComment = !showComment"
        />
      </div>
      <div
        class="text-gray-200 mt-4"
        v-html="$md.render(challenge.description)"
      ></div>
    </div>

    <!-- Connection URL -->
    <div class="mb-2">
      <div v-if="challenge.challengeUrl">
        <a :href="challenge.challengeUrl" target="_blank">{{
          challenge.challengeUrl
        }}</a>
      </div>
      <div v-if="challenge.instance == 'multiple' && !challenge.solved">
        <ButtonDeployer :challengeId="challenge.id" />
      </div>
    </div>

    <!-- Files -->
    <div v-if="challenge.files.length > 0">
      <h3 class="text-xl font-medium text-gray-400 italic">
        File<span v-if="challenge.files.length > 1">s</span>
      </h3>
      <div class="flex">
        <div class="my-4" v-for="file of challenge.files" :key="file.id">
          <a
            class="hover:text-white transition-all duration-75 hover:bg-gray-600 bg-gray-700 p-2 rounded-lg mr-2"
            target="_blank"
            :href="`/api/files/${file.id}`"
            >{{ file.name }}</a
          >
        </div>
      </div>
    </div>

    <div v-if="!challenge.solved" class="flex items-center relative">
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
        class="bg-orange-500 text-white w-1/5 absolute right-1 border-none hover:bg-opacity-100 hover:text-gray-300"
        @clicked="submitFlag"
        >Submit</Button
      >
    </div>
    <ChallengeComments
      class="absolute w-64 h-96 -left-7"
      v-if="showComment"
      :challenge="challenge"
    ></ChallengeComments>
  </div>
</template>

<script>
export default {
  props: ["challenge"],
  data() {
    return {
      flag: "",
      loading: false,
      showComment: false,
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
