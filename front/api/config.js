const BASE = "/configs";

export default ($axios) => ({
  async getCtfState() {
    let res = await $axios.get(`${BASE}/state`);
    return res.data;
  },
  async getTeamMode() {
    let res = await $axios.get(`${BASE}/value/team_mode`);
    return res.data;
  },
  async getDates() {
    let res = await $axios.get(`${BASE}/dates`);
    return res.data;
  },
  async getMaxPlayerPerTeam() {
    let res = await $axios.get(`${BASE}/value/players_max_per_team`);
    return res.data;
  },
  // ADMIN
  async getAllConfigs() {
    let res = await $axios.get(`${BASE}`);
    return res.data;
  },
  async editConfig(key, value) {
    let res = await $axios.patch(`${BASE}/key/${key}`, { value });
    return res.data;
  },
});
