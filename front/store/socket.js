export const state = () => ({
  lastFlag: 'null',
});

export const mutations = {
  FLAG_EVENT(state, val) {
    state.lastFlag = val;
  },
};
