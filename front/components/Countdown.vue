<template>
  <span class="italic text-gray-500">{{ prettyTime  }}</span>
</template>

<script>
export default {
  props: ["end"],
  data() {
    return {
      timer: null,
      countdown: null,
    };
  },
  computed: {
    prettyTime() {
      let time = this.countdown / 60;
      let hours = parseInt(time / 24)
      let minutes = Math.round((time - hours) / 60);
      let secondes =Math.round((time - hours - minutes) / 60);
      return hours + ":" + minutes + ":" + secondes;
    },
  },
  filters: {
    prettify: function (value) {
      let data = value.split(":");
      let minutes = data[0];
      let secondes = data[1];
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (secondes < 10) {
        secondes = "0" + secondes;
      }
      return minutes + ":" + secondes;
    },
  },
  async mounted() {
    if (this.timer) clearInterval(this.timer);
    if (this.end) {
      this.countdown = new Date(this.end) - new Date().getTime();
      this.countdown /= 1000;
      this.timer = setInterval(() => {
        this.countdown--;
      }, 1000);
    }
  },
};
</script>

<style></style>
