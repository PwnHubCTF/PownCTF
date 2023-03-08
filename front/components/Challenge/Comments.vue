<template>
  <div class="bg-gray-800 text-white p-3 h-96">
    <div v-for="(comment, index) of comments" :key="index" class="overflow-y-scroll scrollbar-thin">
      <div class="flex" v-if="comment.type === 'player'">
        <span>{{ comment.author }}:</span>
        <p class="ml-2">{{ comment.text }}</p>
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
      comments: [
        {
          type: "player",
          author: "Eteck",
          text: "I ve found someting in /robots.txt",
        },
        {
          type: "player",
          author: "Eteck",
          text: "Not sure about this information, it also could be in /config.old.txt, but i m gonna try !",
        },
        {
          type: "flag",
          user: "Eteck",
          flag: "PWNME{mistake}",
        },
        {
          type: "player",
          author: "Eteck",
          text: "Not that :(",
        },
        {
          type: "player",
          author: "Eteck",
          text: "I think i ve found it!",
        },
        {
          type: "flag",
          user: "Eteck",
          flag: "PWNME{mistake}",
        },
        {
          type: "notif",
          text: "Eteck solve the challenge !",
        },
      ],
    };
  },
  methods: {
    closeModal() {
      this.$emit("closeModal");
    },
    send() {
      this.comments.push({
        type: "player",
        author: "Eteck",
        text: this.comment,
      });
      this.comment = "";
    },
  },
};
</script>
