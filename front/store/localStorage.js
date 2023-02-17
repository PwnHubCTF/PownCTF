export const state = () => ({
  userConfig: {
    view: "detailed",
    showSolved: true,
    showCategories: []
  },
});

export const mutations = {
  setView(state, val) {
    state.userConfig.view = val;
  },
  setShowSolved(state, val) {
    state.userConfig.showSolved = val;
  },
  toggleShowCategory(state, category){
    if(!state.userConfig.showCategories) state.userConfig.showCategories = []
    if(state.userConfig.showCategories.some(c => category == c)){
      state.userConfig.showCategories = state.userConfig.showCategories.filter(c => category != c)
    } else {
      state.userConfig.showCategories.push(category)
    }
  }
};
