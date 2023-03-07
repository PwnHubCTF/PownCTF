<template>
  <div>
    <div
      v-for="(challengeList, category) in challenges"
      :key="category"
      class="w-full"
    >
      <h2
        :id="category"
        v-if="challengeList.length > 0"
        class="text-4xl font-bold mt-3 capitalize text-gray-800"
      >
        {{ category }}
      </h2>
      <div class="my-3">
        <div
          v-for="challenge of challengeList"
          :key="challenge.id"
          class="flex text-white my-2"
        >
          <ChallengeModal
            class="rounded-sm w-full mb-4"
            :challenge="challenge"
            @flag="$emit('flag')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["challenges"],
};
</script>

<style></style>
