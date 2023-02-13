<template>
    <div
      class="bg-gray-800 text-white p-3"
    >
      <div v-for="(comment, index) of comments" :key="index">
        <div v-if="comment.type === 'player'">
            <span>{{ comment.author }}</span>
            <p>{{ comment.text }}</p>
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
  </template>
  
  <script>
  export default {
    props: ["challenge"],
    data() {
      return {
        loading: false,
        comments: [{
            type: 'player',
            author: 'Eteck',
            text: 'I ve found someting in /robots.txt'
        },{
            type: 'player',
            author: 'Eteck',
            text: 'Not sure about this information, it also could be in /config.old.txt, but i m gonna try !'
        },{
            type: 'flag',
            user: 'Eteck',
            flag: 'PWNME{mistake}'
        },{
            type: 'player',
            author: 'Eteck',
            text: 'Not that :('
        },{
            type: 'player',
            author: 'Eteck',
            text: 'I think i ve found it!'
        },{
            type: 'flag',
            user: 'Eteck',
            flag: 'PWNME{mistake}'
        },{
            type: 'notif',
            text: 'Eteck solve the challenge !'
        }

    ]
      };
    },
    methods: {
      closeModal() {
        this.$emit("closeModal");
      },
    },
  };
  </script>
  