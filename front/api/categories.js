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
  async join(id) {
    let res = await $axios.post(`${BASE}/join/${id}`);
    return res.data;
  },
  async create(name, description) {
    let res = await $axios.post(`${BASE}/`, { name, description });
    return res.data;
  },
  async edit(id, payload) {
    let res = await $axios.patch(`${BASE}/${id}`, payload);
    return res.data;
  },
  async getCategoryMode() {
    let res = await $axios.get(`${BASE}/isEnabled`);
    return res.data;
  },
});
