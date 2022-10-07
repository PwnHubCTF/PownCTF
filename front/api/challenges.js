const BASE = "/challenges";

export default ($axios) => ({
  async getMine() {
    let res = await $axios.get(`${BASE}/mine`);
    return res.data;
  },
  async submit(challengeId, flag){
    let res = await $axios.post(`submissions`, {challengeId, flag});
    return res.data;
  }
});
