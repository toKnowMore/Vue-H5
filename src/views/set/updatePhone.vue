<template>
  <div class="updatePhonePage">
    <van-nav-bar
      :title="$t('updatePhone.title')"
      left-arrow
      fixed
      @click-left="onClickLeft"/>
    <div class="app-container">
      <van-form validate-first @submit="onSubmit">
        <div v-if="step == 1" class="step">
          请验证你的手机号以进行下一步操作
        </div>
        <div v-if="step == 2" class="step">请输入你的新手机号码</div>

        <van-field
          v-model="info.phone"
          :rules="phoneRules"
          :left-icon="phoneIcon"
          :placeholder="$t('form.username')"
          name="phone"
          clearable
          type="number"/>

        <van-field
          v-model="info.dynamicCode"
          :placeholder="$t('form.code')"
          :rules="rules"
          :left-icon="codeIcon"
          name="dynamicCode"
          clearable
          type="number">
          <van-button
            slot="button"
            :disabled="isTiming"
            type="info"
            size="large"
            class="input-button"
            @click.stop="getCode">{{ isTiming ? second + "s" : codeText }}</van-button>
        </van-field>

        <van-button
          :loading="btnLoading"
          class="normal"
          round
          block
          type="info"
          native-type="submit">{{ text }}</van-button>
      </van-form>
    </div>
  </div>
</template>
<script>
import { validPhone } from '@/utils/validate'
import { updatePhone } from '@/api/updatePhone'
import { dynamicCode } from '@/api/public'
export default {
  data() {
    return {
      info: {},
      phoneRules: [
        { required: true, message: this.$t('form.username') },
        { validator: validPhone, message: this.$t('form.validatePhone') }
      ],
      rules: [{ required: true, message: this.$t('form.rulesText') }],
      phoneIcon: require('@/assets/login/login-phone.png'),
      codeIcon: require('@/assets/login/code.png'),
      codeText: this.$t('form.sendCode'),
      isTiming: false,
      second: 60,
      btnLoading: false,
      step: 1,
      text: this.$t('updatePhone.stepFirst')
    }
  },
  beforeDestroy() {
    if (this.timer) {
      // 如果定时器还在运行 或者直接关闭，不用判断
      clearInterval(this.timer) // 关闭
    }
  },
  mounted() {},
  methods: {
    toLogin() {
      this.$store.dispatch('LogOut').then(() => {
        this.btnLoading = false
        this.$router.replace({ path: '/login' })
      }).catch(() => {
        this.btnLoading = false
        this.$store.dispatch('FedLogOut').then(() => {
          this.$router.replace({ path: '/login' })
        })
      })
    },
    onClickLeft() {
      this.$router.back(-1)
    },
    onSubmit(values) {
      this.btnLoading = true
      if (this.step === 1) {
        this.step = 2
        this.text = this.$t('table.confirm')
        this.info = {}
        this.btnLoading = false
        clearInterval(this.timer) // 关闭
        this.isTiming = false
        this.second = 60
      } else if (this.step === 2) {
        updatePhone(this.info).then(response => {
          this.btnLoading = false
          if (response.data) {
            this.$toast(this.$t('updatePhone.success'))
            this.toLogin()
          } else {
            this.$toast(this.$t('updatePhone.fail'))
          }
        }).catch(() => {
          this.btnLoading = false
        })
      }
    },
    getCode() {
      if (this.isTiming) {
        return false
      }

      if (!this.info.phone) {
        this.$toast.fail(this.$t('form.username'))
        return false
      }

      dynamicCode({ mobile: this.info.phone }).then(response => {
        if (response.data) {
          this.info.dynamicCode = response.data
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
.step {
  font-size: 14px;
  color: rgba(68, 68, 68, 1);
  line-height: 20px;
  margin-bottom: 30px;
}
</style>
<style lang="scss">
.updatePhonePage {
  .van-field {
    height: 58px;
    box-shadow: 0px 1px 16px 7px rgba(219, 219, 219, 0.5);
    border-radius: 20px;
    margin: 10px 0;
    display: flex;
    align-items: center;
    font-size: 18px;
    color: rgba(0, 0, 0, 1);

    .input-button {
      font-size: 16px;
      width: 100px;
      border-radius: 15px;
    }
  }
}
</style>
