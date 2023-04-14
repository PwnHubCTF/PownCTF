<template>
  <div>
    <div v-for="(challengeList, category) in challenges" :key="category" class="pb-6">
      <h2
        :id="category"
        v-if="challengeList.length > 0"
        class="text-4xl font-bold mt-3 capitalize text-gray-800"
      >
        {{ category }}
      </h2>
      <div class="my-3 flex flex-wrap gap-4">
        <div
          v-for="challenge of challengeList"
          :key="challenge.id"
          class="flex text-white rounded-xl cursor-pointer"
        >
          <ChallengeTiny
            @click.native="$emit('openChall', challenge)"
            :challenge="challenge"
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
