<template>
  <label class="block">
    <span v-if="label" class="block text-sm font-medium text-slate-700">
      {{ label }}
    </span>
    <input
      @click="toggleChoices = !toggleChoices"
      :value="currentValue"
      @input="(e) => changeEvent(e.target.value)"
      :type="type"
      class="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
      v-bind:class="{ 'rounded-b-none': toggleChoices }"
      :placeholder="placeholder"
    />
    <div
      class="border border-sky-500 ring-sky-500 rounded-b-md ring-1"
      v-if="choices && toggleChoices"
    >
      <p class="cursor-pointer hover:bg-slate-100" @click="changeEvent(choice)" v-for="choice in choices" :key="choice">
        {{ choice }}
      </p>
    </div>
  </label>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    required: {
      // after:content-['*'] after:ml-0.5 after:text-red-500
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "text",
    },
    choices: {
      type: Array,
      default: null,
    },
    value: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      currentValue: "",
      toggleChoices: false,
    };
  },
  mounted() {
    this.currentValue = this.value;
  },
  methods: {
    changeEvent(newVal) {
      this.currentValue = newVal;
      this.$emit("input", newVal);
    },
  },
};
</script>
