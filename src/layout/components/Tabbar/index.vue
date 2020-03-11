<template>
  <div>
    <van-tabbar fixed route>
      <van-tabbar-item name="home" to="/" replace>
        <span>{{ $t('tabbar.home') }}</span>
        <img
          slot="icon"
          slot-scope="props"
          :src="props.active ? homeIcon.active : homeIcon.inactive">
      </van-tabbar-item>
      <van-tabbar-item name="exam" icon="records" to="/exam/index" replace>
        <span>{{ $t('tabbar.exam') }}</span>
        <img
          slot="icon"
          slot-scope="props"
          :src="props.active ? examIcon.active : examIcon.inactive">
      </van-tabbar-item>
      <van-tabbar-item name="mine" icon="contact" to="/mine/index" replace>
        <span>{{ $t('tabbar.mine') }}</span>
        <img
          slot="icon"
          slot-scope="props"
          :src="props.active ? mineIcon.active : mineIcon.inactive">
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      homeIcon: {
        active: require('@/assets/tabbar/home-active.png'),
        inactive: require('@/assets/tabbar/home-inactive.png')
      },
      examIcon: {
        active: require('@/assets/tabbar/exam-active.png'),
        inactive: require('@/assets/tabbar/exam-inactive.png')
      },
      mineIcon: {
        active: require('@/assets/tabbar/mine-active.png'),
        inactive: require('@/assets/tabbar/mine-inactive.png')
      }
    }
  }
}
</script>
<style lang="scss">
.van-tabbar {
  background:rgba(243,243,243,1);
}
</style>
