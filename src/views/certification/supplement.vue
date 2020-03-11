<template>
  <div class="supplementPage">
    <van-nav-bar
      :title="title"
      left-arrow
      fixed
      @click-left="onClickLeft"/>
    <van-pull-refresh
      v-model="pagePullLoading"
      :loosing-text="$t('table.loosingText')"
      :loading-text="$t('table.loadingText')"
      @refresh="onRefresh">
      <div class="app-container">
        <div v-show="list.length > 0" class="list-item">
          <van-cell
            :title="$t('supplement.name')"
            :value="info.reallyName"
            title-class="title"
            value-class="value"/>
          <van-cell
            :title="$t('supplement.idCardNo')"
            :value="info.identityCardId"
            title-class="title"
            value-class="value"/>
          <van-cell
            :title="$t('supplement.platform')"
            :value="info.platformName"
            title-class="title"
            value-class="value"/>
          <van-cell
            :title="$t('supplement.job')"
            :value="info.jobName"
            title-class="title"
            value-class="value"/>
          <van-cell
            :title="$t('supplement.examTime')"
            :value="info.createTime"
            title-class="title"
            value-class="value"/>
          <van-cell
            :title="$t('supplement.examResult')"
            :value="info.isPassed | isPass(translate)"
            title-class="title"
            value-class="value"/>
        </div>

        <div v-show="list.length > 0" class="upload-container">
          <div class="area-header">
            <div class="kuai"/>
            <div class="header-title">{{ this.$t('form.upload') }}</div>
          </div>
          <div class="upload-area">
            <van-uploader v-if="type=== 'exam'" :after-read="afterReadImg">
              <img v-show="info.HandIdImg" :src="info.HandIdImg">
              <van-button
                v-show="!info.HandIdImg"
                icon="add"
                deletable>{{ this.$t('supplement.uploadIdCardText') }}</van-button>
            </van-uploader>
            <div class="van-uploader" @click.stop="signStart">
              <img v-show="info.signatureImg" :src="info.signatureImg">
              <van-button
                v-show="!info.signatureImg"
                icon="add"
                deletable>{{ this.$t('supplement.uploadSignText') }}</van-button>
            </div>
          </div>
        </div>

        <van-button
          v-show="list.length > 0"
          :loading="bntLoading"
          size="large"
          class="large"
          type="info"
          @click.stop="submit">{{ $t("table.confirm") }}</van-button>

        <noData v-show="list.length == 0"/>
      </div>
    </van-pull-refresh>

    <sign-canvas
      :show="showCanvas"
      @cancle="cancleCanvas"
      @save="saveCanvas"
      @clear="clearCanvas"/>
  </div>
</template>
<script>
import { examAuthInfo, supplementInfo, uploadIdCardAndSignImg } from '@/api/supplement'
import { uploadFile } from '@/api/public'
import noData from '@/components/noData'
import signCanvas from '@/components/signCanvas'
export default {
  components: {
    noData,
    signCanvas
  },
  filters: {
    isPass: function(val, translate) {
      switch (val) {
        case '是':
          return translate('mockAndExam.passStatus')
        case '否':
          return translate('mockAndExam.nopassStatus')
        default:
          break
      }
    }
  },
  data() {
    return {
      bntLoading: false,
      info: {},
      pagePullLoading: false,
      type: '',
      list: [],
      showCanvas: false,
      id: ''
    }
  },
  created() {
    this.type = this.$route.query.type
    this.id = this.$route.query.id
    if (this.type === 'exam') {
      this.title = this.$t('supplement.examTitle')
    } else if (this.type === 'buqian') {
      this.title = this.$t('supplement.buqianTitle')
    }
  },
  mounted() {
    this.getInfo()
  },
  methods: {
    translate(str) {
      return this.$t(str)
    },
    onClickLeft() {
      this.$router.back(-1)
    },
    onRefresh() {
      this.pagePullLoading = false
      this.getInfo()
    },
    getInfo() {
      if (this.type === 'buqian') {
        supplementInfo().then(response => {
          if (response.data) {
            this.info = response.data
          }
          this.list = Object.keys(this.info)
          this.pagePullLoading = false
        }).catch(() => {
          this.pagePullLoading = false
        })
      } else if (this.type === 'exam') {
        examAuthInfo({ id: this.id }).then(response => {
          if (response.data) {
            this.info = response.data
            this.info.id = response.data.examResultId
            this.list = Object.keys(this.info)
          }
          this.pagePullLoading = false
        }).catch(() => {
          this.pagePullLoading = false
        })
      }
    },
    afterReadImg(file) {
      this.$toast.loading()
      var formData = new FormData()
      formData.append('file', file.file)
      uploadFile(formData).then(response => {
        this.$toast.clear()
        this.$set(this.info, 'HandIdImg', response.data)
      }).catch(() => {
        this.$toast.clear()
      })
    },

    signStart() {
      this.showCanvas = true
    },

    cancleCanvas() {
      this.showCanvas = false
      console.log('取消画布')
    },
    clearCanvas() {
      console.log('清除画布')
    },
    saveCanvas(file) {
      this.$toast.loading()
      var formData = new FormData()
      formData.append('file', file)
      uploadFile(formData).then(response => {
        this.$toast.clear()
        this.$set(this.info, 'signatureImg', response.data)
        this.showCanvas = false
      }).catch(() => {
        this.$toast.clear()
      })
    },
    submit() {
      if (!this.info.HandIdImg && this.type === 'exam') {
        this.$toast.fail(this.$t('supplement.uploadIdCardText'))
        return false
      }
      if (!this.info.signatureImg) {
        this.$toast.fail(this.$t('supplement.uploadSignText'))
        return false
      }
      uploadIdCardAndSignImg(this.info).then(response => {
        if (response.data) {
          this.$router.replace({ path: '/invoiceResult', query: { from: this.type }})
        } else {
          this.$dialog.confirm({
            title: this.$t('mockAndExam.tip'),
            message: this.$t('supplement.fail')
          }).then(() => {
            this.$router.replace({ path: '/' })
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.list-item {
  padding: 29px 10px 10px 10px;
  box-shadow: 0px 0px 7px 0px rgba(119, 119, 119, 0.5);
  border-radius: 23px;
}
.upload-container {
  margin: 20px 0 30px 0;
}
.area-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
  .kuai {
    width: 6px;
    height: 18px;
    background: rgba(78, 140, 238, 1);
    margin-right: 10px;
  }
  .header-title {
    font-size: 14px;
    font-weight: 500;
    color: rgba(68, 68, 68, 1);
  }
}

.upload-area {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.van-cell {
  .title {
    font-size: 16px;
    color: rgba(68, 68, 68, 1);
    width: 100px;
  }
  .value {
    font-size: 16px;
    font-weight: 600;
    color: rgba(0, 0, 0, 1);
  }
}
</style>
