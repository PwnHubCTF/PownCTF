const BASE = "/events";

export default ($axios) => ({
  async getAll() {
    let res = await $axios.get(`${BASE}`);
    return res.data;
  },
});
