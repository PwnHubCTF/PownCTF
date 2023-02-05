<template>
  <div>
    <p @click="changePage(page-1)">-</p>
      <p @click="changePage(page+1)">+</p>
  </div>
</template>

<script>
export default {
    props: ['input', 'page'],
    data(){
        return {
            page: 0
        }
    },
    mounted(){
        console.log(input)
    }
}
</script>

<style>

</style>