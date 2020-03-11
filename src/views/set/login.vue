<template>
  <div class="loginPage">
    <div class="app-container">
      <img src="@/assets/login/logo.png" alt="" class="logo">

      <div class="title">{{ platformName }}</div>
      <lang-select class="set-language"/>
      <van-form validate-first @submit="onSubmit">
        <van-field
          v-model="loginForm.username"
          :rules="phoneRules"
          :left-icon="phoneIcon"
          :placeholder="$t('form.username')"
          name="username"
          clearable
          type="number"/>

        <van-field
          v-model="loginForm.password"
          :placeholder="$t('form.password')"
          :rules="pwRules"
          :left-icon="pwIcon"
          name="password"
          clearable
          type="password"/>

        <div class="forget-pw" @click="toForgetPassword">{{ $t('login.forgetPassword') }}?</div>

        <van-button
          :disabled="code"
          :loading="btnLoading"
          class="normal"
          round
          block
          type="info"
          native-type="submit">{{ $t("login.logIn") }}</van-button>

        <div class="register" @click="toRegister">
          {{ $t("login.register") }}
        </div>
      </van-form>
    </div>
  </div>
</template>
<script>
import LangSelect from '@/components/LangSelect'
import { validPhone } from '@/utils/validate'
import { getQueryObject } from '@/utils'
import { setEntranceCode, setPlatformId } from '@/utils/auth'
import { sendToken, platformAll } from '@/api/public'
export default {
  components: { LangSelect },
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      phoneRules: [
        { required: true, message: this.$t('form.username') },
        { validator: validPhone, message: this.$t('form.validatePhone') }
      ],
      pwRules: [{ required: true, message: this.$t('form.password') }],
      phoneIcon: require('@/assets/login/login-phone.png'),
      pwIcon: require('@/assets/login/login-pw.png'),
      btnLoading: false,
      code: false,
      platformName: '安全培训'
    }
  },
  created() {
    // 保存一下平台码，可能后面会用到, 没有平台码不能登录
    const obj = getQueryObject()
    if (obj.entranceKey) {
      setEntranceCode(obj.entranceKey)
    }
    if (obj.id) {
      setPlatformId(obj.id)
      this.getPlatfromAll(obj.id)
    }
    if (Object.keys(obj).length === 0) {
      this.$toast.fail(this.$t('login.noLogin'))
      this.code = false
    }
    if (obj.token) {
      this.getUserInfoByToken(obj.token)
    }
  },
  mounted() {
    this.getPlatfromAll()
  },
  methods: {
    getPlatfromAll(id) {
      platformAll({ id: id }).then(response => {
        this.platformList = response.data
        if (this.platformList.length > 0) {
          this.platformName = response.data[0].platformName
        }
      })
    },
    zh() {
      this.$i18n.locale = 'zh'
      this.$store.dispatch('setLanguage', 'zh')
    },
    en() {
      this.$i18n.locale = 'en'
      this.$store.dispatch('setLanguage', 'en')
    },
    toForgetPassword() {
      this.$router.push({ path: '/forgetPassword' })
    },
    getUserInfoByToken(token) {
      sendToken({ token: token }).then(response => {
        if (response.data) {
          this.loginForm.username = response.data.username
          this.loginForm.password = response.data.cipher
          this.onSubmit()
        } else {
          this.$toast.fail(this.$t('login.loginFailByToken'))
        }
      })
    },
    onSubmit() {
      this.btnLoading = true
      this.$store.dispatch('Login', this.loginForm).then(() => {
        this.$store.dispatch('GetUserInfo').then(() => {
          this.$router.replace({ path: '/' })
          this.btnLoading = false
        }).catch(() => {
          this.btnLoading = false
        })
      }).catch(() => {
        this.btnLoading = false
      })
    },
    toRegister() {
      this.$router.push({ path: '/register' })
    }
  }
}
</script>
<style lang="scss" scoped>
.logo {
  width: 89px;
  margin: 5px auto 27px;
  display: block;
}

.switch {
  position: fixed;
  top: 100px;
  right: 20px;
}

.title {
  font-size: 22px;
  font-weight: 600;
  color: rgba(37, 126, 255, 1);
  text-align: center;
  margin-bottom: 20px;
}

.forget-pw {
  width: 100%;
  text-align: right;
  font-size: 14px;
  color: rgba(141, 141, 141, 1);
}

.register {
  font-size: 16px;
  color: rgba(37, 126, 255, 1);
}
</style>
<style lang="scss">
.loginPage {
  .van-field {
    width: 273px;
    height: 58px;
    box-shadow: 0px 1px 16px 7px rgba(219, 219, 219, 0.5);
    border-radius: 21px;
    margin: 24px 0;
    display: flex;
    font-size: 18px;
    align-items: center;
    .van-icon__image {
      width: 18px;
      height: 22px;
    }

    input::placeholder {
      font-size: 18px;
    }
  }
}
</style>
