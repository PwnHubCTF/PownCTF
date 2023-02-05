<template>
  <span class="italic text-gray-500">{{ prettyTime | prettify }}</span>
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
      let time = this.countdown;
      let minutes = Math.floor((time) / 60 % 60);
      let hours = Math.floor((time) / 60 / 60); 
      let secondes = Math.floor((time)%60);
      return hours + ":" + minutes + ":" + secondes;
    },
  },
  filters: {
    prettify: function (value) {
      return value.split(":")/* .filter(e => e != '0') */.map(e => (e < 10 ? `0${e}` : e)).join(':');
    },
  },
  async mounted() {
    if (this.timer) clearInterval(this.timer);
    if (this.end) {
      this.countdown = new Date(this.end) - new Date().getTime();
      this.countdown =  Math.round(this.countdown/1000);
      this.timer = setInterval(() => {
        this.countdown--;
      }, 1000);
    }
  },
};
</script>

<style></style>
