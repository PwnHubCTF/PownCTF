export default ($axios) => ({
  async scoreboard(category = null) {
    let cat = category ? `?category=${category}` : "";
    let res = await $axios.get(`/scoreboard${cat}`);
    return res.data;
  },
  async getTheme() {
    let res = await $axios.get(`/theme.css`);
    return res.data;
  },
  async setTheme(theme) {
    let res = await $axios.post(`/theme`, {
      theme,
    });
    return res.data;
  },
});
