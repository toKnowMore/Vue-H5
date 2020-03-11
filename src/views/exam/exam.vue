<template>
  <div class="examPage">
    <van-pull-refresh
      v-model="pagePullLoading"
      :loosing-text="$t('table.loosingText')"
      :loading-text="$t('table.loadingText')"
      @refresh="onRefresh">
      <div class="exam-head">
        {{ $t("exam.head") }}
      </div>
      <div class="exam-container">
        <van-form validate-first input-align="right" @submit="onSubmit" @failed="onFailed">
          <div class="info-area">
            <van-field
              v-model="reallyName"
              :rules="rules.rule"
              :placeholder="$t('form.realyName')"
              :name="$t('exam.realyName')"
              :label="$t('exam.realyName')"
              required
              label-class="label"
              readonly/>
            <van-field
              v-model="examEdit.platformName"
              :rules="rules.platformName"
              :placeholder="$t('form.platform')"
              :name="$t('exam.platform')"
              :label="$t('exam.platform')"
              is-link
              label-class="label"
              clickable
              required
              @click.stop="showPlatformPicker = true"/>
            <van-popup v-model="showPlatformPicker" position="bottom">
              <van-picker
                :columns="platformList"
                value-key="platformName"
                show-toolbar
                @confirm="onConfirmPlatform"
                @cancel="showPlatformPicker = false"/>
            </van-popup>
            <van-field
              v-model="examEdit.jobName"
              :rules="rules.jobName"
              :name="$t('exam.job')"
              :label="$t('exam.job')"
              :placeholder="$t('form.job')"
              is-link
              label-class="label"
              clickable
              required
              @click.stop="showJobPicker = true"/>
            <van-popup v-model="showJobPicker" position="bottom">
              <van-picker
                :columns="jobList"
                value-key="jobName"
                show-toolbar
                @confirm="onConfirmJob"
                @cancel="showJobPicker = false"/>
            </van-popup>
            <van-field
              v-model="examEdit.categoryName"
              :rules="rules.categoryName"
              :name="$t('exam.category')"
              :label="$t('exam.category')"
              :placeholder="$t('form.category')"
              is-link
              label-class="label"
              clickable
              required
              @click.stop="showCategoryPicker = true"/>
            <van-popup v-model="showCategoryPicker" position="bottom">
              <van-picker
                :columns="categoryList"
                value-key="categoryName"
                show-toolbar
                @confirm="onConfirmCategory"
                @cancel="showCategoryPicker = false"/>
            </van-popup>
            <van-field
              v-model="examEdit.contentName"
              :rules="rules.contentName"
              :name="$t('exam.content')"
              :label="$t('exam.content')"
              :placeholder="$t('form.content')"
              required
              label-class="label"
              clickable
              clearable
              @input="contentNameInput"
              @click.stop="showContentPicker = true"/>
            <van-popup
              v-model="showContentPicker"
              :overlay="false"
              :lock-scroll="true"
              position="bottom">
              <van-picker
                :columns="contentList"
                value-key="contentName"
                show-toolbar
                @confirm="onConfirmContent"
                @cancel="showContentPicker = false"/>
            </van-popup>
            <van-field
              v-model="examEdit.carrierName"
              :rules="rules.carrierName"
              :name="$t('exam.carrier')"
              :label="$t('exam.carrier')"
              :placeholder="$t('form.carrier')"
              required
              label-class="label"
              clearable
              clickable
              @input="carrierNameInput"
              @click.stop="showCarrierPicker = true"/>
            <van-popup
              v-model="showCarrierPicker"
              :overlay="false"
              :lock-scroll="true"
              position="bottom">
              <van-picker
                :columns="carrierList"
                value-key="carrierName"
                show-toolbar
                @confirm="onConfirmCarrier"
                @cancel="showCarrierPicker = false"/>
            </van-popup>
            <van-field
              v-for="(item, index) in licenseList"
              :key="index"
              v-model="item.status"
              :rules="item.isMust > 0 ? rules.rule : rules.ruleNo"
              :name="item.licenseName"
              :label="item.licenseName"
              :placeholder="$t('form.upload')"
              :required="item.isMust > 0"
              label-class="label"
              label-width="150px"
              is-link
              clickable
              readonly
              @click.stop="toUpload(item)"/>
          </div>
          <van-button
            :loading="btnLoading"
            block
            type="info"
            class="large"
            native-type="submit">
            {{ $t("exam.startExam") }}
          </van-button>
        </van-form>
      </div>
    </van-pull-refresh>
  </div>
</template>
<script>
import {
  jobAll,
  categoryAll,
  trainContentByName,
  trainCarrierByName,
  platformAll,
  contentAll,
  carrierAll
} from '@/api/public'
import { licenseInfoByJob, getExamPrice } from '@/api/exam'
import { update } from '@/api/login'
export default {
  data() {
    return {
      pagePullLoading: false,
      licenseList: [],
      rules: {
        platformName: [{ required: true, message: this.$t('form.selectText'), trigger: 'onChange' }],
        jobName: [{ required: true, message: this.$t('form.selectText'), trigger: 'onChange' }],
        categoryName: [{ required: true, message: this.$t('form.selectText'), trigger: 'onChange' }],
        contentName: [{ required: true, message: this.$t('form.rulesText') }],
        carrierName: [{ required: true, message: this.$t('form.rulesText') }],
        rule: [{ required: true, message: this.$t('form.rulesText') }],
        ruleNo: [{ required: false, message: this.$t('form.rulesText') }]
      },
      examEdit: {},
      btnLoading: false,
      platformList: [],
      jobList: [],
      realyName: '',
      categoryList: [],
      contentList: [],
      carrierList: [],
      showPlatformPicker: false,
      showJobPicker: false,
      showCategoryPicker: false,
      showContentPicker: false,
      showCarrierPicker: false,
      contentName: '',
      carrierName: ''
    }
  },
  created() {
    this.examEdit.platformId = this.$store.getters.platformId
    this.examEdit.jobId = this.$store.getters.jobId
    this.examEdit.categoryId = this.$store.getters.categoryId
    this.examEdit.contentId = this.$store.getters.contentId
    this.examEdit.carrierId = this.$store.getters.carrierId
    this.reallyName = this.$store.getters.reallyName
  },
  mounted() {
    this.getPlatform()
    this.getContent()
    this.getCarrier()
  },
  methods: {
    onRefresh() {
      this.getPlatform()
      this.getContent()
      this.getCarrier()
      this.getUserInfo()
    },
    getUserInfo() {
      this.$store.dispatch('GetUserInfo').then(() => {
        this.examEdit.platformId = this.$store.getters.platformId
        this.examEdit.jobId = this.$store.getters.jobId
        this.examEdit.categoryId = this.$store.getters.categoryId
        this.examEdit.contentId = this.$store.getters.contentId
        this.examEdit.carrierId = this.$store.getters.carrierId
      })
    },
    getPlatform() {
      platformAll().then(response => {
        this.platformList = response.data
        this.pagePullLoading = false
        for (let i = 0; i < this.platformList.length; i++) {
          const item = this.platformList[i]
          if (this.examEdit.platformId === item.id) {
            this.examEdit.platformName = item.platformName
            break
          }
        }
        this.getJob()
      }).catch(() => {
        this.pagePullLoading = false
      })
    },
    getJob() {
      if (!this.examEdit.platformId) {
        return
      }
      jobAll({ platformId: this.examEdit.platformId }).then(response => {
        this.jobList = response.data
        for (let i = 0; i < this.jobList.length; i++) {
          const item = this.jobList[i]
          if (this.examEdit.jobId === item.id) {
            this.examEdit.jobName = item.jobName
            break
          }
        }
        this.getLicenseInfoByJobId()
        this.getCategory()
      })
    },
    getCategory() {
      if (!this.examEdit.jobId) {
        return
      }
      categoryAll({ jobId: this.examEdit.jobId }).then(response => {
        this.categoryList = response.data
        for (let i = 0; i < this.categoryList.length; i++) {
          const item = this.categoryList[i]
          if (this.examEdit.categoryId === item.id) {
            this.examEdit.categoryName = item.categoryName
            break
          }
        }
      })
    },
    getContent() {
      contentAll().then(response => {
        this.contentList = response.data
        for (let i = 0; i < this.contentList.length; i++) {
          const item = this.contentList[i]
          if (this.examEdit.contentId === item.id) {
            this.examEdit.contentName = item.contentName
            break
          }
        }
      })
    },

    getCarrier() {
      carrierAll().then(response => {
        this.carrierList = response.data
        for (let i = 0; i < this.carrierList.length; i++) {
          const item = this.carrierList[i]
          if (this.examEdit.carrierId === item.id) {
            this.examEdit.carrierName = item.carrierName
            break
          }
        }
      })
    },

    // 根据jobId请求所需证件
    getLicenseInfoByJobId() {
      if (!this.examEdit.jobId) {
        return
      }
      this.$toast.loading({
        message: this.$t('exam.getLicenseInfoLoadingText'),
        forbidClick: true,
        loadingType: 'spinner'
      })
      licenseInfoByJob({ jobId: this.examEdit.jobId }).then(response => {
        this.$toast.clear()
        this.licenseList = response.data.examLicenseInfoVOList
        this.licenseList.forEach(item => {
          if (item.licenseId) {
            item.status = '已上传'
          }
        })
      }).catch(() => {
        this.$toast.clear()
      })
    },
    onConfirmPlatform(item, index) {
      this.showPlatformPicker = false
      this.examEdit.platformName = item.platformName
      this.examEdit.platformId = this.platformList[index].id
      this.$set(this.examEdit, 'jobName', null)
      this.$set(this.examEdit, 'jobId', null)
      this.updateUserInfo()
      this.getJob()
    },
    onConfirmJob(item, index) {
      this.showJobPicker = false
      this.examEdit.jobName = item.jobName
      this.examEdit.jobId = this.jobList[index].id
      this.$set(this.examEdit, 'categoryName', null)
      this.$set(this.examEdit, 'categoryId', null)
      this.updateUserInfo()
      this.getLicenseInfoByJobId()
      this.getCategory()
    },
    onConfirmCategory(item, index) {
      this.showCategoryPicker = false
      this.examEdit.categoryName = item.categoryName
      this.examEdit.categoryId = this.categoryList[index].id
      this.updateUserInfo()
    },
    onConfirmContent(item, index) {
      this.showContentPicker = false
      this.examEdit.contentName = item.contentName
      this.examEdit.contentId = this.contentList[index].id
    },
    onConfirmCarrier(item, index) {
      this.showCarrierPicker = false
      this.examEdit.carrierName = item.carrierName
      this.examEdit.carrierId = this.carrierList[index].id
    },
    contentNameInput() {
      // 防止重复数据重复请求
      if (this.examEdit.contentName && this.examEdit.contentName !== this.contentName) {
        setTimeout(() => {
          this.contentName = this.examEdit.contentName
          this.$set(this.examEdit, 'contentId', null)
          this.getTrainContent()
        }, 500)
      }
    },
    getTrainContent() {
      trainContentByName({ trainContentName: this.examEdit.contentName }).then(
        response => {
          this.contentList = response.data
        }
      )
    },
    carrierNameInput() {
      // 防止重复数据重复请求
      if (this.examEdit.carrierName && this.examEdit.carrierName !== this.carrierName) {
        setTimeout(() => {
          this.carrierName = this.examEdit.carrierName
          this.$set(this.examEdit, 'carrierId', null)
          this.getTrainCarrier()
        }, 500)
      }
    },
    getTrainCarrier() {
      trainCarrierByName({ trainCarrierName: this.examEdit.carrierName }).then(
        response => {
          this.carrierList = response.data
        }
      )
    },
    toUpload(item) {
      this.$router.push({
        path: '/upload',
        query: { licenseName: item.licenseName, licenseKey: item.licenseKey, id: item.licenseId }
      })
    },
    updateUserInfo() {
      // 更新用户信息
      this.$toast.loading({
        message: this.$t('exam.updateLoadingText'),
        forbidClick: true,
        loadingType: 'spinner'
      })
      update(this.examEdit).then(response => {
        this.getUserInfo()
        if (this.btnLoading) {
          this.getInfoBeforeExam()
        }
        this.btnLoading = false
        this.$toast.clear()
      })
    },

    getInfoBeforeExam() {
    // 首先判断当前是否有未完成的考试，提示，选择
    // 继续考试，直接考试，考试次数不增加，余额不扣
    // 重新考试，加考试次数，扣钱
      getExamPrice({ jobId: this.examEdit.jobId, platformId: this.examEdit.platformId, categoryId: this.examEdit.categoryId }).then(response => {
        if (response.data) {
          const data = response.data
          if (data.isItFinished) {
            // 已完成
            this.examEdit.isNewExam = 1
            this.dialog(data)
          } else {
            this.$dialog.confirm({
              title: this.$t('mockAndExam.tip'),
              message: this.$t('mockAndExam.hasExam')
            }).then(() => {
              // 继续未完成考试
              this.examEdit.isNewExam = 0
              this.toExamIng()
            }).catch(() => {
              // 开始新的一场考试
              this.examEdit.isNewExam = 1
              this.dialog(data)
            })
          }
        } else {
          this.$toast.fail(this.$t('mockAndExam.beforeExamInfoFail'))
        }
      })
    },

    dialog(data) {
      let message = '培训角色:' + this.examEdit.jobName + '\n' + '试题类别:' + this.examEdit.categoryName + '\n' + '考试时长:' + data.exam_Length + '\n'
      const isMonitor = '在线考试期间请勿直接退出考试系统，否则失去1次考试机会，此次成绩计0分。在考试期间，系统会自动进行人脸识别抓拍，请务必为您本人完成此次考试，否则会被系统判为作弊行为，此次成绩计0分。'
      const price = '支付费用:' + data.price
      if (data.price > 0) {
        message = message + price
      }
      if (data.isMonitor === 1) {
        message = message + isMonitor
      }
      this.$dialog.confirm({
        title: this.$t('exam.startExam'),
        message: message
      }).then(() => {
        localStorage.setItem('currentIndex', 0)
        this.toExamIng()
      }).catch(() => {
        this.$toast(this.$t('exam.cancle'))
      })
    },

    // 去考试页
    toExamIng() {
      const info = JSON.stringify(this.examEdit)
      localStorage.setItem('examParams', info)
      this.$router.push({ path: '/examIng' })
    },

    onSubmit(values) {
      this.btnLoading = true
      this.updateUserInfo()
    },
    onFailed(errorInfo) {
      console.log('failed', errorInfo)
    }
  }
}
</script>
<style lang="scss" scoped>
.exam-head {
  font-size: 20px;
  font-weight: 500;
  color: rgba(68, 68, 68, 1);
  text-align: center;
  padding: 20px 0;
}
.exam-container {
  padding: 5px 20px 20px 20px;
  overflow-y: auto;
  height: calc(100vh - 150px);

  .info-area {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 7px 0px rgba(183, 183, 183, 0.5);
    border-radius: 14px;
    padding: 10px;
    margin-bottom: 20px;
    .label {
      font-size: 18px;
      color: rgba(68, 68, 68, 1);
    }

    .van-field__control {
      font-size: 18px;
      font-weight: 500;
      color: rgba(0, 0, 0, 1);
    }
  }
}
</style>
<style lang="scss">
.examPage {
  input {
    font-size: 18px;
    font-weight: 500;
    color: rgba(0, 0, 0, 1);
  }
  input::placeholder {
    font-size: 18px;
    color: rgba(162, 162, 162, 1);
  }
}
</style>
