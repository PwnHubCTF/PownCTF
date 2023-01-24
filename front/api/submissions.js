const BASE = "/submissions";

export default ($axios) => ({
  async getAll(){
    let res = await $axios.get(`${BASE}/all`);
    return res.data;
  },
});
