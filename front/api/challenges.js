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
    let res = await $axios.post(`${BASE}/github`);
    return res.data;
  },
  async deploy(challengeId){
    let res = await $axios.post(`deployer/deploy/${challengeId}/`);
    return res.data;
  },
  async stop(challengeId){
    let res = await $axios.post(`deployer/stop/${challengeId}/`);
    return res.data;
  },
  async instanceStatus(challengeId){
    let res = await $axios.get(`deployer/${challengeId}`);
    return res.data;
  },
  async instances(){
    let res = await $axios.get(`deployer`);
    return res.data;
  },
  async delete(challengeId){
    let res = await $axios.delete(`${BASE}/${challengeId}`);
    return res.data;
  },
  async updateChallengesPoints(){
    let res = await $axios.post(`${BASE}/update-points`);
    return res.data;
  },
  
});
