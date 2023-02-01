const BASE = "/users";

export default ($axios) => ({
  async getAll() {
    let res = await $axios.get(`${BASE}`);
    return res.data;
  },
  async getOne(id) {
    let res = await $axios.get(`${BASE}/infos/${id}`);
    return res.data;
  },
  async getAdmin() {
    let res = await $axios.get(`${BASE}/admin`);
    return res.data;
  },
  async getForCategory(category) {
    let res = await $axios.get(`${BASE}/category/${category}`);
    return res.data;
  },
});
