<template>
  <div>
    <van-nav-bar
      :title="title"
      left-arrow
      fixed
      @click-left="onClickLeft"/>

    <div class="app-container">
      <img src="@/assets/mine/mine-invoice.png" class="logo">

      <div v-if="fromPage === 'invoice'">
        <div class="title">{{ $t('invoiceResult.invoiceSuccessful') }}</div>
        <div class="title2">{{ $t('invoiceResult.wait') }}</div>
      </div>

      <div v-if="fromPage === 'feedback'">
        <div class="title2">{{ $t('invoiceResult.submitSuccessfully') }}</div>
      </div>

      <!-- 认证 -->
      <div v-if="fromPage === 'supplement'">
        <div class="title2">{{ $t('supplement.success') }}</div>
      </div>

      <!-- 认证补签 -->
      <div v-if="fromPage === 'buqian'">
        <div class="title2">{{ $t('supplement.successB') }}</div>
      </div>

      <van-button class="normal" round block type="info" native-type="submit" to="/" replace>{{ $t('table.confirm') }}</van-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      title: '',
      fromPage: ''
    }
  },
  created() {
    this.fromPage = this.$route.query.from
    if (this.fromPage === 'feedback') {
      this.title = this.$t('feedback.title')
    } else if (this.fromPage === 'invoice') {
      this.title = this.$t('invoice.title')
    } else if (this.fromPage === 'exam') {
      this.title = this.$t('supplement.examTitle')
    } else if (this.fromPage === 'buqian') {
      this.title = this.$t('supplement.buqianTitle')
    }
  },
  mounted() {
  },
  methods: {
    onClickLeft() {
      this.$router.back(-1)
    }
  }
}
</script>
<style lang="scss">
  .logo {
    width: 127px;
    margin: 27px auto;
    display: block;
  }

  .title {
    font-size:16px;
    color:rgba(68,68,68,1);
    text-align: center;
    margin-bottom: 40px;
  }

  .title2 {
    font-size:16px;
    color:rgba(68,68,68,1);
    text-align: center;
    margin-bottom: 100px;
  }
</style>
