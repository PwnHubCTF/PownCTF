<template>
  <label class="block">
    <span v-if="label" class="block text-sm font-medium text-slate-700">
      {{ label }}
    </span>
    <input
      v-model="value"
      type="email"
      name="email"
      class="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
      :placeholder="placeholder"
    />
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
    value: {
      type: String,
      required: true,
    },
  },
};
</script>
