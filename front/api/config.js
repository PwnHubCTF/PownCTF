const BASE = "/configs/";

export default ($axios) => ({
  async getCtfState() {
    let res = await $axios.get(`/configs/value/state`);
    return res.data;
  },
  async getTeamMode() {
    let res = await $axios.get(`/configs/value/team_mode`);
    return res.data;
  },
  async getMaxPlayerPerTeam() {
    let res = await $axios.get(`/configs/value/players_max_per_team`);
    return res.data;
  },
});
