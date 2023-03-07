<template>
  <div>
    <ul
      v-for="(challengeList, category) in challenges"
      :key="category"
      :id="category"
    >
      <p
        v-if="challengeList.length > 0"
        class="text-2xl font-medium mb-4 capitalize"
      >
        {{ category }}
      </p>
      <ul class="ml-4">
        <li
          class="cursor-pointer flex relative justify-between custom-list"
          v-for="challenge of challengeList"
          :key="challenge.id"
          @click="$emit('openChall', challenge)"
        >
          <span></span>
          <p :class="{ 'text-green-400': challenge.solved }">
            {{ challenge.name }}
          </p>
          <span class="text-gray-400 italic ml-4 hidden sm:block"
            >{{ challenge.solves }} solves / {{ challenge.points }} points</span
          >
        </li>
      </ul>
    </ul>
  </div>
</template>

<script>
export default {
  props: ["challenges"],
};
</script>

<style scoped>
.custom-list span:first-child {
  background-color: black;
  position: absolute;
  left: -14px;
  height: 1px;
  width: 14px;
  bottom: 10px;
}
.custom-list span:first-child::before {
  background-color: black;
  content: "";
  position: absolute;
  height: 24px;
  width: 1px;
  top: -24px;
}
</style>
