export const state = () => ({
    challenges: {},
    lastFlag: null
  });
  
  export const mutations = {
    SET_CHALLENGES(state, val) {
      state.challenges = val;
    },
    USER_SOLVE(state, val) {
        console.log(val);
        state.lastFlag = val
        for (const challenges in state.challenges) {
            for (const challenge of state.challenges[challenges]) {
                if(challenge.id == val.challengeId){
                    challenge.solves = val.solves
                    challenge.points = val.points
                }
            }
        }
        // if (val.solves == 1) {
        //     this.$toast.error(`${val.user} first blood ${val.challenge} !`);
        //   }
    },
  };
  