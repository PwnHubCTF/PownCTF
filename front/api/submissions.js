const BASE = "/submissions";

export default ($axios) => ({
  async getAll(limit = 10, page = 0) {
    // let cat = category ? `&category=${category}` : '' ${cat} , category = null
    let res = await $axios.get(`${BASE}/all?limit=${limit}&page=${page}`);
    return res.data;
  },
  async getForUser(userId) {
    let res = await $axios.get(`${BASE}/user/${userId}`);
    return res.data;
  },
  async forTeam(id) {
    let res = await $axios.get(`${BASE}/team/valids/${id}`);
    return res.data;
  },
  async getTopUsersFromChallengeCategory(
    category,
    limit,
    playerCategory = null
  ) {
    let cat = playerCategory ? `?category=${playerCategory}` : "";
    let res = await $axios.get(
      `${BASE}/top-users-challenge-category/${category}/${limit}${cat}`
    );
    return res.data;
  },
  async getTopTeamsFromChallengeCategory(
    category,
    limit,
    playerCategory = null
  ) {
    let cat = playerCategory ? `?category=${playerCategory}` : "";
    let res = await $axios.get(
      `${BASE}/top-teams-challenge-category/${category}/${limit}${cat}`
    );
    return res.data;
  },
});
