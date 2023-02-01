const BASE = "/submissions";

export default ($axios) => ({
  async getAll(){
    let res = await $axios.get(`${BASE}/all`);
    return res.data;
  },
  async getForUser(userId){
    let res = await $axios.get(`${BASE}/user/${userId}`);
    return res.data;
  },
  async forTeam(id) {
    let res = await $axios.get(`${BASE}/team/valids/${id}`);
    return res.data;
  },
});
