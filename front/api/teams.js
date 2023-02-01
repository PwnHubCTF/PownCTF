const BASE = "/teams";

export default ($axios) => ({
  async create(name, password) {
    let res = await $axios.post(`${BASE}`, { name, password });
    return res.data;
  },
  async getAll() {
    let res = await $axios.get(`${BASE}`);
    return res.data;
  },
  async join(name, password) {
    let res = await $axios.post(`${BASE}/join/${name}`, { password });
    return res.data;
  },
  async directJoin(secret) {
    let res = await $axios.post(`${BASE}/join/direct/${secret}`);
    return res.data;
  },
  async getMine() {
    let res = await $axios.get(`${BASE}/mine`);
    return res.data;
  },
  async get(id) {
    let res = await $axios.get(`${BASE}/${id}`);
    return res.data;
  },
});
