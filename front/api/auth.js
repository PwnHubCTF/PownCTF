const BASE = "/auth";

export default ($axios) => ({
  async login(email, password) {
    let res = await $axios.post(`${BASE}/login`, { email, password });
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
  async resetLink(token){
    let res = await $axios.get(`${BASE}/reset/${token}`);
    return res.data;
  },
  async setNewPassword(token, password){
    let res = await $axios.patch(`${BASE}/reset/${token}`, {
      password
    });
    return res.data;
  },
  async resetPassword(email){
    let res = await $axios.post(`${BASE}/reset`, {
      email
    });
    return res.data;
  }
});
