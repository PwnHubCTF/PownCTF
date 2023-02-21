<template>
    
<div class="table w-full text-sm text-center text-gray-800">
    <div class="table-header-group text-xs text-gray-700 uppercase bg-gray-400">
        <div class="table-row">
            <div scope="col" class="table-cell py-3 px-6" v-for="header in headers" :key="header.value" colspan="2">{{header.name}}</div>
        </div>
    </div>
    <div class="w-full table-row-group">
        <div :class="[index % 2 == 0 ? 'bg-gray-200' : 'bg-gray-300']" class="border-b border-gray-200 table-row" v-for="(item, index) in items" :key="index">
            <div class="table-cell py-4 px-6" v-for="header in headers">
              <slot :item="item" :name="header.value">
                {{item[header.value] }}
              </slot>
            </div>
        </div>
    </div>
</div>

</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    items: Array,
    headers: Array,
  },
  methods: {
  },
};
</script>
