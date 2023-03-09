const BASE = "/comments";

export default ($axios) => ({
  async postComment(challengeId, comment) {
    let res = await $axios.post(`${BASE}/${challengeId}`, {
      text: comment
    });
    return res.data;
  },
  async getAll(limit = 10, page = 0) {
    let res = await $axios.get(`${BASE}/?limit=${limit}&page=${page}`);
    return res.data;
  },
});
