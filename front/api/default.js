export default ($axios) => ({
  async scoreboard() {
    let res = await $axios.get(`/scoreboard`);
    return res.data;
  },
});
