<template>
  <div>
    <div class="border rounded-lg border-gray-700 w-full">
      <div class="flex flex-wrap items-center mt-2">
        <!-- Actuals tags -->
        <div class="" v-for="actualTag in actualTags" :key="actualTag">
          <p
            class="cursor-pointer flex items-stretch mx-1 mb-2"
            @click="removeTag(actualTag)"
          >
            <span
              class="rounded-xl rounded-r-none bg-slate-800 text-gray-50 px-2"
              >{{ actualTag }}</span
            >
            <span
              class="
                flex
                items-center
                rounded-xl rounded-l-none
                bg-white
                text-red-400
                border-2600blue border
                px-1
              "
            >
              X</span
            >
          </p>
        </div>
        <!-- Inputs for new tags -->
        <input
          v-model="inputTag"
          type="text"
          class="
            p-1
            bg-white
            shadow-sm
            placeholder-slate-400
            focus:outline-none
            block
            rounded-md
            sm:text-sm
            relative
            flex-grow
          "
          style="width: 8rem"
          placeholder="Add a new tag"
          @keyup.enter="addTag()"
        />
      </div>
    </div>

    <div
      class="border border-gray-400 text-black"
      v-if="autocomplete.length > 0 && inputTag.length > 0"
    >
      <p
        class="cursor-pointer hover:bg-slate-100"
        @click="addTagFromCompletion(choice)"
        v-for="choice in autocomplete"
        :key="choice"
      >
        {{ choice }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    autocomplete: {
      type: Array,
      default: [],
    },
    actualTags: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      inputTag: "",
    };
  },
  watch: {
    inputTag() {
      // Add a debounce ?
      if (this.inputTag.length > 0) this.getChoice();
    },
  },
  methods: {
    addTag() {
      if (this.inputTag.length == 0) return;
      if (this.actualTags.some((t) => t == this.inputTag)) return;
      this.$emit("addTag", this.inputTag);
      this.inputTag = "";
    },
    addTagFromCompletion(tag) {
      if (this.actualTags.some((t) => t == tag)) return;
      this.$emit("addTag", tag);
      this.inputTag = "";
    },
    removeTag(tag) {
      this.$emit("removeTag", tag);
    },
    getChoice() {
      this.$emit("askChoice", this.inputTag);
    },
  },
};
</script>
