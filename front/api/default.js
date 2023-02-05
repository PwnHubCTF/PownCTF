export default ($axios) => ({
  async scoreboard() {
    let res = await $axios.get(`/scoreboard`);
    return res.data;
  },
  async getTheme() {
    let res = await $axios.get(`/theme.css`);
    return res.data;
  },
  async setTheme(theme) {
    let res = await $axios.post(`/theme`, {
      theme
    });
    return res.data;
  },
});
