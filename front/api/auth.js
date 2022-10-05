const BASE = "/auth";

export default ($axios) => ({
  async login(email, password) {
    let res = await $axios.post(`${BASE}/login`, { login, password });
    return res.data;
  },
  async register(pseudo, email, password) {
    let res = await $axios.post(`${BASE}/register`, {
      pseudo,
      email,
      password,
    });
    return res.data;
  },
  async getMe() {
    let res = await $axios.get(`${BASE}/me`);
    return res.data;
  },
});
