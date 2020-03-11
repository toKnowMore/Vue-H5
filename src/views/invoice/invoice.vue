<template>
  <div>
    <van-nav-bar
      :title="$t('invoice.title')"
      left-arrow
      fixed
      @click-left="onClickLeft"/>
    <div class="app-container">
      <van-form validate-first input-align="right" @submit="onSubmit">
        <van-cell-group class="list-item">
          <van-radio-group v-model="invoiceEdit.invType" :rules="invType">
            <van-cell :title="$t('invoice.invoiceType')">
              <van-radio slot="right-icon" :name="0" icon-size= "16px">{{ $t('invoice.VATInvoice') }}</van-radio>
              <van-radio slot="right-icon" :name="1" icon-size= "16px">{{ $t('invoice.VATIcoupon') }}</van-radio>
            </van-cell>
          </van-radio-group>

          <van-field v-model="invoiceEdit.invPayable" :rules="rules" :placeholder="$t('invoice.invPayable')" :label="$t('invoice.invPayable')" name="invPayable" clearable/>

          <van-field v-model="invoiceEdit.taxNum" :rules="rules" :placeholder="$t('invoice.taxNum')" :label="$t('invoice.taxNum')" name="taxNum" clearable/>

          <van-field v-model="invoiceEdit.orgName" :placeholder="$t('form.optional')" :label="$t('invoice.orgName')" name="orgName" clearable/>

          <van-field v-model="invoiceEdit.orgAddr" :placeholder="$t('form.optional')" :label="$t('invoice.address')" name="orgAddr" clearable/>

          <van-field v-model="invoiceEdit.orgMobile" :placeholder="$t('form.optional')" :label="$t('invoice.phone')" name="orgMobile" clearable type="number"/>

          <van-field v-model="invoiceEdit.bankName" :placeholder="$t('form.optional')" :label="$t('invoice.bank')" name="bankName" clearable/>

          <van-field v-model="invoiceEdit.bankAccount" :placeholder="$t('form.optional')" :label="$t('invoice.bankAccount')" name="bankAccount" clearable type="number"/>
        </van-cell-group>

        <van-button :loading="btnLoading" class="submit" round block type="info" native-type="submit">{{ $t('invoice.submit') }}</van-button>
      </van-form>
    </div>
  </div>

</template>
<script>
import { applyInv } from '@/api/consume'
export default {
  data() {
    return {
      invoiceEdit: {
        invType: 0
      },
      rules: [
        { required: true, message: this.$t('form.rulesText') }
      ],
      invType: [
        { required: true, message: this.$t('form.rulesText'), trigger: 'onChange' }
      ],
      btnLoading: false,
      ids: []
    }
  },
  created() {
    const ids = this.$route.query.ids
    this.invoiceEdit.ids = ids.split(',')
  },
  methods: {
    onClickLeft() {
      this.$router.back(-1)
    },
    onSubmit(values) {
      this.btnLoading = true
      applyInv(this.invoiceEdit).then(response => {
        this.btnLoading = false
        if (response.data) {
          this.$toast.success('申请开票成功')
        } else {
          this.$toast.fail('申请开票失败')
        }
        setTimeout(() => {
          this.onClickLeft()
        }, 3000)
      }).catch(() => {
        this.btnLoading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.list-item {
  padding: 5px;
  box-shadow: 0px 0px 7px 0px rgba(119,119,119,0.5);
  border-radius:12px;
  margin-bottom: 50px;
  font-size: 14px;
}
</style>
