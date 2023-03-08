<template>
  <div class="bg-gray-800 border-2 rounded-sm border-gray-600 text-white p-3">
    <h2 class="text-center italic font-semibold text-lg mb-2">Team chat for challenge {{ challenge.name }}</h2>
    <div ref="scroll" class="h-96 overflow-y-scroll scrollbar-thin">
      <div v-for="(comment, index) of challenge.comments" :key="index" class="">
        <div class="flex" v-if="comment.type === 'player'">
          <span class="text-gray-300">{{ comment.data.author }}:</span>
          <p class="ml-2">{{ comment.data.text }}</p>
        </div>
        <div v-if="comment.type === 'flag'">
          <span>{{ comment.user }} try the flag </span>
          <p>{{ comment.flag }}</p>
        </div>
        <div v-if="comment.type === 'notif'">
          <p>{{ comment.text }}</p>
        </div>
      </div>
    </div>
    <div class="mt-4">
      <InputText @enter="send" class="text-gray-900" v-model="comment" />
    </div>
  </div>
</template>

<script>
export default {
  props: ["challenge"],
  data() {
    return {
      loading: false,
      comment: "",
    };
  },
  watch: {
    "challenge.comments"() {
      setTimeout(() => {
        this.scrollToBottom();
      }, 10);
    },
  },
  mounted() {
    this.scrollToBottom();
  },
  methods: {
    closeModal() {
      this.$emit("closeModal");
    },
    async send() {
      if (this.loading || this.comment == "") return;
      this.loading = true;
      await this.$api.comments.postComment(this.challenge.id, this.comment);
      this.comment = "";
      this.loading = false;
    },
    scrollToBottom() {
      const el = this.$refs.scroll;
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    },
  },
};
</script>
