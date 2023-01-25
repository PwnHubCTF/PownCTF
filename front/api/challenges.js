const BASE = "/challenges";

export default ($axios) => ({
  async getMine() {
    let res = await $axios.get(`${BASE}/mine`);
    return res.data;
  },
  async submit(challengeId, flag){
    let res = await $axios.post(`submissions`, {challengeId, flag});
    return res.data;
  },
  async getCategories(){
    let res = await $axios.get(`${BASE}/categories`);
    return res.data;
  },
  async getAll(){
    let res = await $axios.get(`${BASE}`);
    return res.data;
  },
  async fetchFromGit(){
    let res = await $axios.get(`${BASE}/github`);
    return res.data;
  },
});
