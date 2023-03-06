const BASE = "/deployer";

export default ($axios) => ({
  async deploy(challengeId){
    let res = await $axios.post(`${BASE}/deploy/${challengeId}/`);
    return res.data;
  },
  async stop(challengeId){
    let res = await $axios.post(`${BASE}/stop/${challengeId}/`);
    return res.data;
  },
  async resetCooldown(challengeId){
    let res = await $axios.post(`${BASE}/reset-cooldown/${challengeId}/`);
    return res.data;
  },
  async instanceStatus(challengeId){
    let res = await $axios.get(`${BASE}/challenge/${challengeId}`);
    return res.data;
  },
  async instances(){
    let res = await $axios.get(`${BASE}`);
    return res.data;
  },
  async ressources(){
    let res = await $axios.get(`${BASE}/ressources`);
    return res.data;
  },
});
