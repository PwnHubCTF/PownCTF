const BASE = "/events";

export default ($axios) => ({
  async getAll() {
    let res = await $axios.get(`${BASE}`);
    return res.data;
  },
  async messageToUser(userId, message) {
    let res = await $axios.post(`${BASE}/${userId}`, {message});
    return res.data;
  },
  async broadcast(message) {
    let res = await $axios.post(`${BASE}`, {message});
    return res.data;
  },
});
