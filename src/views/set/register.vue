<template>
  <div class="register">
    <van-nav-bar
      :title="$t('register.title')"
      left-arrow
      fixed
      @click-left="onClickLeft"/>
    <div class="app-container">
      <van-form validate-first label-width="70px" @submit="onSubmit">
        <van-field v-model="registerEdit.realname" :rules="rules" :placeholder="$t('form.realyName')" :label="$t('register.realyName')" name="realyName" clearable/>

        <van-field v-model="registerEdit.cardId" :rules="idCardNoRules" :placeholder="$t('form.idCardNo')" :label="$t('register.idCardNo')" name="idCardNo" clearable type="number"/>

        <van-field
          v-model="registerEdit.platformName"
          :placeholder="$t('form.platform')"
          :left-icon="jobIcon"
          :rules="rules"
          clickable
          name="platformName"
          @click="platformPicker = true"/>
        <van-popup v-model="platformPicker" position="bottom">
          <van-picker
            :columns="platformList"
            value-key="platformName"
            show-toolbar
            @confirm="pfConfirm"
            @cancel="platformPicker = false"/>
        </van-popup>
        <van-field
          v-model="registerEdit.jobName"
          :placeholder="$t('form.job')"
          :left-icon="jobIcon"
          :rules="rules"
          clickable
          name="jobName"
          @click="showPicker = true"/>
        <van-popup v-model="showPicker" position="bottom">
          <van-picker
            :columns="jobList"
            value-key="jobName"
            show-toolbar
            @confirm="jobConfirm"
            @cancel="showPicker = false"/>
        </van-popup>

        <van-field v-model="registerEdit.username" :placeholder="$t('form.username')" :rules="phoneRules" :left-icon="phoneIcon" name="username" clearable type="number"/>

        <van-field v-model="registerEdit.dynamicCode" :placeholder="$t('form.code')" :rules="rules" :left-icon="codeIcon" name="dynamicCode" clearable type="number">
          <van-button slot="button" :disabled="isTiming" type="info" size="large" class="input-button" @click="getCode">{{ isTiming ? second + 's' : codeText }}</van-button>
        </van-field>

        <van-field v-model="registerEdit.password" :placeholder="$t('form.password')" :rules="rules" :left-icon="pwIcon" name="password" clearable type="password"/>

        <van-field v-model="psd" :placeholder="$t('form.pwAgain')" :rules="rules" :left-icon="pwIcon" name="psd" clearable type="password" @blur="pwdBlur"/>

        <div class="xieyi">
          <van-checkbox v-model="checked" icon-size="16px">同意</van-checkbox>
          <span class="agreement" @click="toAgreement">《用户许可协议》</span>
        </div>

        <van-button :loading="btnLoading" class="normal" round block type="info" native-type="submit">{{ $t('register.title') }}</van-button>
      </van-form>
    </div>
  </div>
</template>
<script>
import { validPhone, validIdCardNo } from '@/utils/validate'
import { register } from '@/api/register'
import { dynamicCode, jobAll, platformAll } from '@/api/public'
export default {
  data() {
    return {
      registerEdit: {},
      phoneRules: [
        { required: true, message: this.$t('form.username') },
        { validator: validPhone, message: this.$t('form.validatePhone') }
      ],
      idCardNoRules: [
        { required: true, message: this.$t('form.idCardNo') },
        { validator: validIdCardNo, message: this.$t('form.validateIdCardNo') }
      ],
      rules: [
        { required: true, message: this.$t('form.rulesText') }
      ],
      jobIcon: require('@/assets/login/job.png'),
      codeIcon: require('@/assets/login/code.png'),
      phoneIcon: require('@/assets/login/login-phone.png'),
      pwIcon: require('@/assets/login/login-pw.png'),
      btnLoading: false,
      showPicker: false,
      platformPicker: false,
      codeText: this.$t('form.sendCode'),
      isTiming: false,
      second: 60,
      timer: null,
      selectAgreement: false,
      jobList: [],
      platformList: [],
      psd: '',
      checked: false
    }
  },
  beforeDestroy() {
    if (this.timer) { // 如果定时器还在运行 或者直接关闭，不用判断
      clearInterval(this.timer) // 关闭
    }
  },
  mounted() {
    console.log(this.$store.getters.platformId, this.$store.getters.exranceCode)
    this.getPlatfromAll()
  },
  methods: {
    getPlatfromAll() {
      let id = null
      let key = null
      if (this.$store.getters.exranceCode) {
        key = this.$store.getters.exranceCode
      }
      if (this.$store.getters.platformId) {
        key = null
        id = this.$store.getters.platformId
      }
      platformAll({ key: key, id: id }).then(response => {
        this.platformList = response.data
      })
    },
    getJobAll() {
      jobAll({ platformId: this.registerEdit.platformId }).then(response => {
        this.jobList = response.data
      })
    },
    onClickLeft() {
      this.$router.back(-1)
    },
    pwdBlur() {
      if (this.registerEdit.password !== this.psd) {
        this.$toast.fail(this.$t('register.pwd'))
        return false
      } else {
        return true
      }
    },
    async onSubmit(values) {
      if (!this.checked) {
        this.$toast.fail(this.$t('register.agreement'))
        return false
      }

      const pwdRes = await this.pwdBlur()

      if (!pwdRes) {
        return
      }

      this.btnLoading = true
      register(this.registerEdit).then(response => {
        this.btnLoading = false
        if (response.data) {
          this.$toast(this.$t('register.success'))
          this.onClickLeft()
        }
      }).catch(() => {
        this.btnLoading = false
      })
    },
    jobConfirm(item, index) {
      this.showPicker = false
      this.registerEdit.jobName = item.jobName
      this.registerEdit.jobId = this.jobList[index].id
    },
    pfConfirm(item, index) {
      this.platformPicker = false
      this.registerEdit.platformName = item.platformName
      this.registerEdit.platformId = this.platformList[index].id
      this.$set(this.registerEdit, 'jobId', null)
      this.$set(this.registerEdit, 'jobName', null)
      this.getJobAll()
    },
    getCode() {
      if (this.isTiming) {
        return false
      }

      if (!this.registerEdit.username) {
        this.$toast.fail(this.$t('form.username'))
        return false
      }

      dynamicCode({ mobile: this.registerEdit.username }).then(response => {
        if (response.data) {
          this.registerEdit.dynamicCode = response.data
          this.countDown()
        }
      })
    },
    agreementSelect() {
      this.selectAgreement = !this.selectAgreement
    },
    toAgreement() {
      this.$toast('去用户协议界面')
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
  .xieyi {
    width: 100%;
    display: flex;
    align-items: center;
    margin-top: 10px;
    .agreement {
      color: #257EFF;
    }
  }
</style>
<style lang="scss">
.register {
  .van-field {
    height:58px;
    background:rgba(255,255,255,1);
    box-shadow:0px 1px 16px 7px rgba(219,219,219,0.5);
    border-radius:21px;
    margin: 10px 0;
    display: flex;
    align-items: center;
    .input-button {
      width: 100px;
      border-radius: 15px;
    }
  }
}

</style>
