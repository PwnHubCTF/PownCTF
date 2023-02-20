<template>
  <div class="p-0 md:p-2 lg:p-8 grid md:grid-cols-2 xl:grid-cols-3 gap-4">
    <CategoryScoreboard
      :users="users"
      v-for="(users, category) in challengeCategories"
      :key="category"
      :category="category"
      :limit="3"
    />
  </div>
</template>

<script>
export default {
  props: {
    playerCategory: {
      type: Object,
      default: null,
    },
  },
  data(){
    return {
      challengeCategories: {}
    }
  },
  watch: {
    async playerCategory() {
      await this.getPlayers();
    },
  },
  computed: {
    categories() {
      return this.$store.state.categories;
    },
  },
  async fetch(){
    await this.getPlayers()
  },
  methods: {
    async getPlayers(){
    if (this.$store.state.ctfOptions.teamMode)
    this.challengeCategories = await this.$api.submissions.getTopTeamsFromChallengeCategory(this.playerCategory?.id)
    else
    this.challengeCategories = await this.$api.submissions.getTopUsersFromChallengeCategory(this.playerCategory?.id)
    }
  }
};
</script>
