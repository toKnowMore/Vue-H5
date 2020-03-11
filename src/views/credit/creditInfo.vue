<template>
  <div class="creditInfoPage">
    <van-nav-bar
      :title="$t('creditInfo.title')"
      left-arrow
      fixed
      @click-left="onClickLeft"/>

    <div class="app-container">
      <div class="list-item">
        <van-cell
          :title="$t('creditInfo.name')"
          value="内容"
          title-class="title"
          value-class="value"/>
        <van-cell
          :title="$t('creditInfo.idCardNo')"
          value="内容"
          title-class="title"
          value-class="value"/>
        <van-cell
          :title="$t('creditInfo.describe')"
          value="内容"
          title-class="title"
          value-class="value"/>
        <van-cell
          :title="$t('creditInfo.validity')"
          value="内容"
          title-class="title"
          value-class="value"/>
        <van-cell
          :title="$t('creditInfo.queryTime')"
          value="内容"
          title-class="title"
          value-class="value"/>
        <van-cell
          :title="$t('creditInfo.queryCost')"
          value="内容"
          title-class="title"
          value-class="value"/>
        <van-cell
          :title="$t('creditInfo.explain')"
          value="内容"
          title-class="title"
          value-class="value"/>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },
  methods: {
    onClickLeft() {
      this.$router.back(-1)
    }
  }
}
</script>
<style lang="scss" scoped>
.list-item {
  padding: 5px;
  box-shadow: 0px 0px 7px 0px rgba(119, 119, 119, 0.5);
  border-radius: 12px;
}
.van-cell {
  width: 100%;
  .title {
    font-size: 16px;
    color: rgba(68, 68, 68, 1);
  }
  .value {
    font-size: 16px;
    font-weight: 500;
    color: rgba(0, 0, 0, 1);
  }
}
</style>
