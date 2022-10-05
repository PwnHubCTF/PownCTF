const BASE = "/categories";

export default ($axios) => ({
  async getAll() {
    let res = await $axios.get(`${BASE}`);
    return res.data;
  },
  async get(id) {
    let res = await $axios.get(`${BASE}/${id}`);
    return res.data;
  },
});
