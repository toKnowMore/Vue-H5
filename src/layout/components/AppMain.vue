<template>
  <section class="app-main">
    <transition :name="transitionName" mode="out-in">
      <keep-alive>
        <router-view :key="key"/>
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  data() {
    return {
      transitionName: 'van-fade' // 初始过渡动画方向
    }
  },
  computed: {
    key() {
      return this.$route.name
    }
  }
}
</script>

<style lang="scss">
.app-main {
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
</style>

