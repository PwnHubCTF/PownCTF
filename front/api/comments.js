const BASE = "/comments";

export default ($axios) => ({
  async postComment(challengeId, comment) {
    let res = await $axios.post(`${BASE}/${challengeId}`, {
      text: comment
    });
    return res.data;
  },
  async getComments(challengeId) {
    let res = await $axios.get(`${BASE}/${challengeId}`);
    return res.data;
  },
});
