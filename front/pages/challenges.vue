<template>
  <div class="">
    <div class="m-8" v-for="challenge in challenges" :key="challenge">
      <Challenge :challenge="challenge" />
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'auth',
  data() {
    return {
      challenges: [
        {
          name: "hey",
          description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis ex
      itaque voluptatum magni molestias soluta dolorem voluptatibus quos
      quibusdam sunt alias provident eos sint labore officiis ad, quod assumenda
      ea.`,
          category: "web",
          solves: 45,
          points: 345,
          solved: false,
          commentCount: 1,
          difficulty: 0,
          instance: true,
          files: [],
        },
        {
          name: "moyen",
          description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis ex
      itaque voluptatum magni molestias soluta dolorem voluptatibus quos
      quibusdam sunt alias provident eos sint labore officiis ad, quod assumenda
      ea.`,
          category: "forensic",
          solves: 23,
          points: 345,
          solved: true,
          commentCount: 0,
          difficulty: 1,
          instance: false,
          files: [{ name: "trace.png", url: "https://test.fr/trace.png" }],
        },
        {
          name: "hey",
          description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis ex
      itaque voluptatum magni molestias soluta dolorem voluptatibus quos
      quibusdam sunt alias provident eos sint labore officiis ad, quod assumenda
      ea.`,
          category: "pwn",
          solves: 134,
          points: 50,
          solved: false,
          commentCount: 1,
          difficulty: 2,
          instance: false,
          files: [],
        },
        {
          name: "hey",
          description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis ex
      itaque voluptatum magni molestias soluta dolorem voluptatibus quos
      quibusdam sunt alias provident eos sint labore officiis ad, quod assumenda
      ea.`,
          category: "misc",
          solves: 1,
          points: 500,
          solved: false,
          commentCount: 1,
          difficulty: 3,
          instance: false,
          files: [],
        },
        {
          name: "hardcore",
          description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis ex
      itaque voluptatum magni molestias soluta dolorem voluptatibus quos
      quibusdam sunt alias provident eos sint labore officiis ad, quod assumenda
      ea.`,
          category: "misc",
          solves: 0,
          points: 500,
          solved: false,
          commentCount: 1,
          difficulty: 4,
          instance: false,
          files: [],
        },
      ],
    };
  },
};
</script>
