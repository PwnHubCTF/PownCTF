import { forceJsonFileDownload } from "../common/download.js";
const BASE = "/submissions";

export default ($axios) => ({
  async getAll(limit = 10, page = 0) {
    // let cat = category ? `&category=${category}` : '' ${cat} , category = null
    let res = await $axios.get(`${BASE}/all?limit=${limit}&page=${page}`);
    return res.data
  },
  async dump() {
    let res = await this.getAll(0, 0)
    forceJsonFileDownload(res, 'submissions.json')
  },
  async getForUser(userId) {
    let res = await $axios.get(`${BASE}/user/${userId}`);
    return res.data;
  },
  async forTeam(id) {
    let res = await $axios.get(`${BASE}/team/valids/${id}`);
    return res.data;
  },
  forChallenge(challengeId){
    return async (limit = 10, page = 0) => {
      let res = await $axios.get(`${BASE}/challenge/valids/${challengeId}?limit=${limit}&page=${page}`);
      return res.data;
    }
  },
  async getTopUsersFromChallengeCategory(
    playerCategory = null
  ) {
    let cat = playerCategory ? `?category=${playerCategory}` : "";
    let res = await $axios.get(
      `${BASE}/top-users-challenge-categories/${cat}`
    );
    return res.data;
  },
  async getTopTeamsFromChallengeCategory(
    playerCategory = null
  ) {
    let cat = playerCategory ? `?category=${playerCategory}` : "";
    let res = await $axios.get(
      `${BASE}/top-teams-challenge-categories/${cat}`
    );
    return res.data;
  },
  async validate(challengeId, userId){
    let res = await $axios.post(`${BASE}/validate`, {challengeId, userId});
    return res.data;
  },
  async remove(challengeId, userId){
    let res = await $axios.patch(`${BASE}/validate`, {challengeId, userId});
    return res.data;
  },
});
