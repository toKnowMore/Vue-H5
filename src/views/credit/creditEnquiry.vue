<template>
  <div class="creditEnquiryPage">
    <van-nav-bar
      :title="$t('creditEnquiry.title')"
      left-arrow
      fixed
      @click-left="onClickLeft"/>

    <div class="app-container">
      <van-form validate-first @submit="onSubmit">
        <van-field v-model="registerEdit.realyName" :rules="realyName" :placeholder="$t('form.realyName')" :label="$t('creditEnquiry.realyName')" name="realyName" clearable/>

        <van-field v-model="registerEdit.idCardNo" :rules="idCardRules" :placeholder="$t('form.idCardNo')" :label="$t('creditEnquiry.idCardNo')" name="idCardNo" clearable type="number"/>

        <van-button :loading="btnLoading" class="normal" round block type="info" native-type="submit">{{ $t('creditEnquiry.title') }}</van-button>
      </van-form>
    </div>
  </div>
</template>
<script>
import { validIdCardNo } from '@/utils/validate'
export default {
  data() {
    return {
      registerEdit: {},
      idCardRules: [
        { required: true, message: this.$t('form.username') }
      ],
      realyName: [
        { required: true, message: this.$t('form.rulesText') },
        { validator: validIdCardNo, message: this.$t('form.validateIdCardNo') }
      ],
      btnLoading: false
    }
  },
  methods: {
    onClickLeft() {
      this.$router.back(-1)
    },
    onSubmit(values) {
      this.btnLoading = true
    }
  }
}
</script>
<style lang="scss">
.creditEnquiryPage {
  .van-field {
    box-shadow: 0px 1px 16px 7px rgba(219,219,219,0.5);
    border-radius: 11px;
    margin: 20px 0;
    height: 58px;
    display: flex;
    align-items: center;
  }
}
</style>
