<template>
  <div class="bg-gray-800 text-white p-3 h-96">
    <div
      v-for="(comment, index) of comments"
      :key="index"
      class="overflow-y-scroll scrollbar-thin"
    >
      <div class="flex" v-if="comment.type === 'player'">
        <span>{{ comment.data.author }}:</span>
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
      comments: [],
    };
  },
  async fetch() {
    this.comments = await this.$api.comments.getComments(this.challenge.id);
  },
  methods: {
    closeModal() {
      this.$emit("closeModal");
    },
    async send() {
      if(this.loading || this.comment == '') return
      this.loading = true
      const comment = await this.$api.comments.postComment(this.challenge.id, this.comment);
      this.comments.push(comment)
      this.comment = "";
      this.loading = false
    },
  },
};
</script>
