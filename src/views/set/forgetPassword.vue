<template>
  <div>
    <van-nav-bar
      :title="$t('forgetPassword.title')"
      left-arrow
      fixed
      @click-left="onClickLeft"/>
    <div class="app-container">
      <van-form validate-first @submit="onSubmit">

        <van-field v-model="findPwdEdit.username" :rules="phoneRules" :left-icon="phoneIcon" :placeholder="$t('form.username')" name="username" clearable type="number"/>

        <van-field v-model="findPwdEdit.dynamicCode" :placeholder="$t('form.code')" :rules="rules" :left-icon="codeIcon" name="dynamicCode" clearable type="number">
          <van-button slot="button" :disabled="isTiming" type="info" size="large" class="input-button" @click="getCode">{{ isTiming ? second + 's' : codeText }}</van-button>
        </van-field>

        <van-field v-model="findPwdEdit.newPassword" :placeholder="$t('form.password')" :rules="rules" :left-icon="pwIcon" name="newPassword" clearable type="password"/>

        <van-field v-model="psd" :placeholder="$t('form.pwAgain')" :rules="rules" :left-icon="pwIcon" name="pwAgain" clearable type="password"/>

        <van-button :loading="btnLoading" class="normal" round block type="info" native-type="submit">{{ $t('forgetPassword.find') }}</van-button>

      </van-form>
    </div>
  </div>
</template>
<script>
import { validPhone } from '@/utils/validate'
import { findPassword } from '@/api/forgetPassword'
import { dynamicCode } from '@/api/public'
export default {
  data() {
    return {
      findPwdEdit: {},
      phoneRules: [
        { required: true, message: this.$t('form.username') },
        { validator: validPhone, message: this.$t('form.validatePhone') }
      ],
      rules: [
        { required: true, message: this.$t('form.rulesText') }
      ],
      phoneIcon: require('@/assets/login/login-phone.png'),
      codeIcon: require('@/assets/login/code.png'),
      pwIcon: require('@/assets/login/login-pw.png'),
      vaIcon: require('@/assets/login/code.png'),
      codeText: this.$t('form.sendCode'),
      isTiming: false,
      second: 60,
      btnLoading: false,
      psd: ''
    }
  },
  beforeDestroy() {
    if (this.timer) { // 如果定时器还在运行 或者直接关闭，不用判断
      clearInterval(this.timer) // 关闭
    }
  },
  methods: {
    onClickLeft() {
      this.$router.back(-1)
    },

    pwdBlur() {
      if (this.findPwdEdit.newPassword !== this.psd) {
        this.$toast.fail(this.$t('register.pwd'))
        return false
      } else {
        return true
      }
    },
    async onSubmit(values) {
      const pwdRes = await this.pwdBlur()

      if (!pwdRes) {
        return
      }

      this.btnLoading = true
      findPassword(this.findPwdEdit).then(response => {
        this.btnLoading = false
        if (response.data) {
          this.$toast(this.$t('forgetPassword.success'))
        }
      })
    },

    getCode() {
      if (this.isTiming) {
        return false
      }

      if (!this.findPwdEdit.username) {
        this.$toast.fail(this.$t('form.username'))
        return false
      }

      dynamicCode({ mobile: this.findPwdEdit.username }).then(response => {
        if (response.data) {
          this.findPwdEdit.dynamicCode = response.data
          this.countDown()
        }
      })
    },
    countDown() {
      this.timer = setInterval(() => {
        this.second--
        this.isTiming = true
        if (this.second === 0) {
          this.second = 60
          this.isTiming = false
          clearInterval(this.timer)
        }
      }, 1000)
    }
  }
}
</script>
<style lang="scss" scoped>
  .van-field {
    height:58px;
    background:rgba(255,255,255,1);
    box-shadow:0px 1px 16px 7px rgba(219,219,219,0.5);
    border-radius: 20px;
    margin: 10px 0;
    display: flex;
    align-items: center;

    .input-button {
      width: 100px;
      border-radius: 15px;
    }
  }
</style>
