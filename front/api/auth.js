const BASE = "/auth";

export default ($axios) => ({
  async login() {
    let res = await $axios.get(`${BASE}/login`);
    return res.data;
  },
  async register() {
    let res = await $axios.get(`${BASE}/register`);
    return res.data;
  },
  async getMe() {
    let res = await $axios.get(`${BASE}/me`);
    return res.data;
  },
});
