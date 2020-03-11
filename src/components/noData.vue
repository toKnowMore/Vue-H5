<template>
  <div class="noData">
    <img src="@/assets/public/noData.png" alt="">
  </div>
</template>

<script>
export default {
  name: 'NoData',
  data() {
    return {}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.noData {
  width: 100%;
  text-align: center;
  margin: 20px 0;
  img {
    width: 200px;
  }
}
</style>
