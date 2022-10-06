<template>
  <div>
    <InputText
      :label="label"
      :type="type"
      :value="value"
      @input="changeEvent"
      :placeholder="placeholder"
      :required="required"
      :choices="choices"
    />
    <div class="bg-orange-300 p-2 cursor-pointer hover:bg-orange-400 rounded-md mt-2 text-white" v-if="hasChanged" @click="editValue">Save</div>
  </div>
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
      newValue: "",
      hasChanged: false,
    };
  },
  mounted() {
    this.newValue = this.value;
  },
  methods: {
    changeEvent(e) {
      this.newValue = e;
      this.hasChanged = this.newValue != this.value;
    },
    editValue() {
      this.$emit("edited", this.newValue);
      this.hasChanged = false
    },
  },
};
</script>
