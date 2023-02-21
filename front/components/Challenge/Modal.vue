<template>
  <div
    class="bg-gray-800 text-white p-5 flex flex-col justify-between"
    :class="{ 'border-8 border-green-400': challenge.solved }"
  >
    <div class="mb-4">
      <div class="items-center text-center justify-center relative">
        <p
          class="font-thin text-gray-400 mb-2 cursor-pointer"
          @click="showSubmissions = !showSubmissions"
        >
          {{ challenge.solves }} solves / {{ challenge.points }} points
        </p>
        <h1 class="text-2xl font-bold">{{ challenge.name }}</h1>
        <div class="flex justify-center">
          <DifficultyStars class="my-2" :value="challenge.difficulty" />
        </div>
        <ButtonComment
          class="absolute -top-4 -left-4"
          :challenge="challenge"
          @click.native="showComment = true"
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
        <ButtonDeployer :challenge="challenge" />
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
    <Transition name="slide">
      <Modal
        @closeModal="showComment = false"
        v-if="showComment"
        class="absolute"
        :style="modalStyle"
      >
        <ChallengeComments :challenge="challenge"></ChallengeComments>
      </Modal>
      <Modal
        @closeModal="showSubmissions = false"
        v-if="showSubmissions"
        class="absolute"
        :style="modalStyle"
      >
        <ChallengeSubmissions :challenge="challenge"></ChallengeSubmissions>
      </Modal>
    </Transition>
  </div>
</template>

<style scoped>
.slide-enter-active {
  transition: all 0.2s ease-out;
}

.slide-leave-active {
  transition: all 0.2s ease-out;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
.slide-enter {
  transform: translate(100%, 0);
}
</style>

<script>
import vClickOutside from "v-click-outside";
export default {
  props: ["challenge"],
  data() {
    return {
      flag: "",
      loading: false,
      showSubmissions: false,
      showComment: false,
    };
  },
  directives: {
    clickOutside: vClickOutside.directive,
  },
  computed: {
    modalStyle() {
      if(this.$store.state.localStorage.userConfig.view == 'detailed'){
        return [{ width: "450px" }, { "z-index": "50" }];
      } else {
        return [{ width: "450px" }, { left: "-450px" }, { "z-index": "-1" }];
      }
    },
  },
  methods: {
    closeModals() {
      this.showComment = false;
      this.showSubmissions = false;
    },
    async submitFlag() {
      if (this.flag == "") return;
      if (this.flag.length > 50)
        return this.$toast.error("Flag too long.. It's probably wrong");
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
      switch (result) {
        case "correct":
          this.$toast.success("Good job!");
          this.$emit("flag");
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
    },
    closeModal() {
      this.$emit("closeModal");
    },
  },
};
</script>
