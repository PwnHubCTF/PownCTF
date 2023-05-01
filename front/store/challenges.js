import IconFirstBlood from "@/components/Icon/FirstBlood.vue";

export const state = () => ({
  challenges: {},
  lastFlag: null,
});

export const mutations = {
  SET_CHALLENGES(state, val) {
    state.challenges = val;
  },
  DEPLOY(state, val) {
    for (const challenges in state.challenges) {
      for (const challenge of state.challenges[challenges]) {
        if (challenge.id == val.challengeId) {
          if (val.action == "start") {
            this._vm.$nuxt.$toast.success(
              `${val.user}: Starting challenge ${val.challenge}..`
            );
          } else {
            this._vm.$nuxt.$toast.error(
              `${val.user}: Stopping challenge ${val.challenge}..`
            );
          }

          return;
        }
      }
    }
  },
  ADD_COMMENT(state, val) {
    for (const challenges in state.challenges) {
      for (const challenge of state.challenges[challenges]) {
        if (challenge.id == val.challengeId) {
          challenge.comments.push(val.comment);
          return;
        }
      }
    }
  },
  GET_MESSAGE(state, val) {
    this._vm.$nuxt.$toast.info(`ADMIN: ${val}`, {
      position: "top-center",
      timeout: 60000,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: false,
      showCloseButtonOnHover: true,
    });
  },
  USER_SOLVE(state, val) {
    state.lastFlag = val;
    for (const challenges in state.challenges) {
      for (const challenge of state.challenges[challenges]) {
        if (challenge.id == val.challengeId) {
          challenge.solves = val.solves;
          challenge.points = val.points;
          return;
        }
      }
    }
    if (val.solves == 1) {
      this._vm.$nuxt.$toast.error(
        `FIRST BLOOD! ${val.user} solve ${val.challenge} !`,
        {
          icon: IconFirstBlood,
        }
      );
    }
  },
};
