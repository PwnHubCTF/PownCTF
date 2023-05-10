<template>
  <div class="min-w-max">
    <section
      class="flex justify-between bg-white rounded-b-lg border border-gray-200 px-10 py-3 text-gray-700"
    >
      <ul class="flex items-center">
        <li class="pr-6" v-if="hasPrev()">
          <a href="#" @click.prevent="changePage(prevPage)">
            <div
              class="flex items-center justify-center hover:bg-gray-200 rounded-md transform rotate-45 h-6 w-6"
            >
              <div class="transform -rotate-45">
                <svg
                  class="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </div>
            </div>
          </a>
        </li>
        <li class="pr-6" v-if="hasFirst()">
          <a href="#" @click.prevent="changePage(1)">
            <div
              class="flex hover:bg-gray-200 rounded-md transform rotate-45 h-6 w-6 items-center justify-center"
            >
              <span class="transform -rotate-45"> 1 </span>
            </div>
          </a>
        </li>
        <li class="pr-6" v-if="hasFirst()">...</li>
        <li class="pr-6" v-for="page in pages" :key="page">
          <a href="#" @click.prevent="changePage(page)">
            <div
              :class="{
                ' text-white bg-gradient-to-r from-primary to-gray-600':
                  current == page,
              }"
              class="flex hover:bg-gray-200 rounded-md transform rotate-45 h-6 w-6 items-center justify-center"
            >
              <span class="transform -rotate-45">{{ page }}</span>
            </div>
          </a>
        </li>
        <li class="pr-6" v-if="hasLast()">...</li>
        <li class="pr-6" v-if="hasLast()">
          <a href="#" @click.prevent="changePage(totalPages)">
            <div
              class="flex hover:bg-gray-200 rounded-md transform rotate-45 h-6 w-6 items-center justify-center"
            >
              <span class="transform -rotate-45">
                {{ totalPages }}
              </span>
            </div>
          </a>
        </li>
        <li class="pr-6" v-if="hasNext()">
          <a href="#" @click.prevent="changePage(nextPage)">
            <div
              class="flex items-center justify-center hover:bg-gray-200 rounded-md transform rotate-45 h-6 w-6"
            >
              <div class="transform -rotate-45">
                <svg
                  class="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </a>
        </li>
      </ul>

      <div class="flex items-center">
        <div class="pr-2 text-gray-400 font-medium">
          <span id="text-before-input"> Items per page </span>
        </div>
        <div class="w-14 rounded-md border border-gray-400 px-1 py-1">
          <select class="bg-transparent" :value="perPage" @change="v=>$emit('per-page', parseInt(v.target.value))">
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    current: {
      type: Number,
      default: 1,
    },
    total: {
      type: Number,
      default: 0,
    },
    perPage: {
      type: Number,
      default: 9,
    },
    pageRange: {
      type: Number,
      default: 2,
    },
  },
  methods: {
    hasFirst: function () {
      return this.rangeStart !== 1;
    },
    hasLast: function () {
      return this.rangeEnd < this.totalPages;
    },
    hasPrev: function () {
      return this.current > 1;
    },
    hasNext: function () {
      return this.current < this.totalPages;
    },
    changePage: function (page) {
      if (page > 0 && page <= this.totalPages) {
        this.$emit("page-changed", page);
      }
    },
  },
  computed: {
    pages: function () {
      var pages = [];

      for (var i = this.rangeStart; i <= this.rangeEnd; i++) {
        pages.push(i);
      }

      return pages;
    },
    rangeStart: function () {
      var start = this.current - this.pageRange;

      return start > 0 ? start : 1;
    },
    rangeEnd: function () {
      var end = this.current + this.pageRange;

      return end < this.totalPages ? end : this.totalPages;
    },
    totalPages: function () {
      return Math.ceil(this.total / this.perPage);
    },
    nextPage: function () {
      return this.current + 1;
    },
    prevPage: function () {
      return this.current - 1;
    },
  },
};
</script>
