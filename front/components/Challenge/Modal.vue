<template>
  <div
    class="bg-gray-800 text-white p-5 flex flex-col justify-between"
    :class="{ 'border-8 border-green-400': challenge.solved }"
  >
    <div class="mb-4">
      <div class="items-center text-center justify-center relative">
        <span
          class="font-thin text-gray-400 my-2 cursor-pointer hover:text-gray-300 transition-all duration-100"
          @click="showSubmissions = !showSubmissions"
        >
          {{ challenge.solves }} solves / {{ challenge.points }} points
        </span>
        <!-- Tags -->
        <div class="flex gap-4 justify-center my-2">
          <span
            class="bg-gray-300 rounded-full text-gray-900 px-2"
            v-for="tag in challenge.tags"
            :key="tag"
            >{{ tag }}</span
          >
        </div>
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
      <p class="text-gray-300 italic text-sm" v-if="challenge.author">
        Author: {{ challenge.author }}
      </p>
      <div
        class="text-gray-200 mt-4"
        v-html="$md.render(challenge.description)"
      ></div>
    </div>

    <!-- Files -->
    <div v-if="challenge.files.length > 0">
      <h3 class="text-xl font-medium text-gray-400 italic">
        File<span v-if="challenge.files.length > 1">s</span>
      </h3>
      <div class="flex flex-wrap">
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

    <div>
      <!-- Connection URL -->
      <div class="mb-2">
        <div v-if="challenge.challengeUrl">
          <a :href="challenge.challengeUrl" target="_blank">{{
            challenge.challengeUrl
          }}</a>
        </div>
        <div v-if="challenge.instance == 'multiple'">
          <ButtonDeployer
            @stopped="instanceUrl = null"
            @started="($event) => (instanceUrl = $event)"
            :challenge="challenge"
          />
        </div>
      </div>
      <div
        v-if="challenge.xss && instanceUrl != null"
        class="flex items-center relative mb-8"
      >
        <!-- XSS Input -->
        <InputText
          class="text-black w-4/5"
          type="text"
          v-model="xss"
          @enter="submitXss"
          :placeholder="instanceUrl"
        />
        <!-- Submit Xss -->
        <Button
          :loading="loadingXss"
          class="bg-blue-500 text-white w-1/5 absolute right-1 border-none hover:bg-opacity-100 hover:text-gray-300"
          @clicked="submitXss"
          >Send XSS</Button
        >
      </div>
      <div v-if="!challenge.solved">
        <div v-if="challenge.flaggable" class="flex items-center relative">
          <!-- Input for Flag -->
          <InputText
            class="text-black w-4/5"
            type="text"
            v-model="flag"
            @enter="submitFlag"
            placeholder="PWNME{[-_a-zA-Z0-9]*}"
          />
          <!-- TODO remove PWNME placeholer-->
          <!-- Submit FLAG -->
          <Button
            :loading="loading"
            class="bg-orange-500 text-white w-1/5 absolute right-1 border-none hover:bg-opacity-100 hover:text-gray-300"
            @clicked="submitFlag"
            >Submit</Button
          >
        </div>
        <div v-else>
          <p class="font-bold italic">
            This challenge can only be validated by an admin
          </p>
        </div>
      </div>
      <div v-else class="flex justify-around items-center text-green-700">
        <svg
          class=""
          fill="currentColor"
          width="24"
          height="24"
          viewBox="0 0 448 512"
        >
          <path
            d="M64 32C64 14.3 49.7 0 32 0S0 14.3 0 32V64 368 480c0 17.7 14.3 32 32 32s32-14.3 32-32V352l64.3-16.1c41.1-10.3 84.6-5.5 122.5 13.4c44.2 22.1 95.5 24.8 141.7 7.4l34.7-13c12.5-4.7 20.8-16.6 20.8-30V66.1c0-23-24.2-38-44.8-27.7l-9.6 4.8c-46.3 23.2-100.8 23.2-147.1 0c-35.1-17.6-75.4-22-113.5-12.5L64 48V32z"
          />
        </svg>
        <span class="font-bold text-3xl">{{ challenge.solved.pseudo }}</span>
        <svg
          class=""
          fill="currentColor"
          width="24"
          height="24"
          viewBox="0 0 448 512"
        >
          <path
            d="M64 32C64 14.3 49.7 0 32 0S0 14.3 0 32V64 368 480c0 17.7 14.3 32 32 32s32-14.3 32-32V352l64.3-16.1c41.1-10.3 84.6-5.5 122.5 13.4c44.2 22.1 95.5 24.8 141.7 7.4l34.7-13c12.5-4.7 20.8-16.6 20.8-30V66.1c0-23-24.2-38-44.8-27.7l-9.6 4.8c-46.3 23.2-100.8 23.2-147.1 0c-35.1-17.6-75.4-22-113.5-12.5L64 48V32z"
          />
        </svg>
      </div>
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
    </Transition>
    <Transition name="slide">
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
      xss: "",
      loading: false,
      loadingXss: false,
      showSubmissions: false,
      showComment: false,
      instanceUrl: null,
    };
  },
  directives: {
    clickOutside: vClickOutside.directive,
  },
  computed: {
    modalStyle() {
      if (this.$store.state.localStorage.userConfig.view == "detailed") {
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
    async submitXss() {
      if (this.xss == "") return;
      this.loadingXss = true;
      let result = null;
      try {
        result = await this.$api.challenges.submitXss(
          this.challenge.id,
          this.xss
        );
        this.$toast.success("Url sent!");
      } catch (error) {
        if (error.response?.data.message)
          this.$toast.error(error.response.data.message);
        else this.$toast.error(error.message);
      }

      this.loadingXss = false;
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
