<template>
  <div class="uploadPage">
    <van-nav-bar :title="title" left-arrow fixed @click-left="onClickLeft"/>
    <div class="app-container">
      <div class="upload-container">
        <div class="area-header">
          <div class="kuai"/>
          <div class="header-title">{{ title }}</div>
        </div>
        <div class="upload-area">
          <van-uploader :after-read="afterReadImg1" :before-read="beforeRead">
            <img v-show="info.imgUrl1" :src="info.imgUrl1">
            <van-button
              v-show="!info.imgUrl1"
              icon="add"
              deletable>{{ upload }}{{ title }}{{ front }}</van-button>
          </van-uploader>
          <van-uploader
            v-if="
              info.licenseKey == 2 ||
                info.licenseKey == 3 ||
                info.licenseKey == 9 ||
                info.licenseKey > 9
            "
            :after-read="afterReadImg2"
            :before-read="beforeRead">
            <img v-show="info.imgUrl2" :src="info.imgUrl2">
            <van-button
              v-show="!info.imgUrl2"
              icon="add"
              deletable>{{ upload }}{{ title }}{{ back }}</van-button>
          </van-uploader>
        </div>
        <div class="tip">
          <img src="@/assets/public/tip.png" alt="">
          <span>{{ tip }}</span>
        </div>
      </div>

      <div class="upload-container">
        <div class="area-header">
          <div class="kuai"/>
          <div class="header-title">信息核对</div>
        </div>
        <van-form validate-first input-align="right" @submit="onSubmit">
          <!-- 营业执照 -->
          <div v-if="info.licenseKey == 1" class="info-area">
            <van-field
              v-model="info.licenseCode"
              :rules="rule"
              :placeholder="$t('form.rulesText')"
              :name="$t('upload.Registration')"
              :label="$t('upload.Registration')"/>
            <van-field
              v-model="info.extraEdit.regName"
              :placeholder="$t('form.rulesText')"
              :name="$t('upload.regName')"
              :label="$t('upload.regName')"
              clearable/>
            <van-field
              v-model="info.extraEdit.licenseType"
              :name="$t('upload.licenseType')"
              :label="$t('upload.licenseType')"
              :placeholder="$t('form.rulesText')"
              clearable/>
            <van-field
              v-model="info.extraEdit.address"
              :name="$t('upload.address')"
              :label="$t('upload.address')"
              :placeholder="$t('form.rulesText')"
              clearable/>
            <van-field
              v-model="info.extraEdit.personCharge"
              :name="$t('upload.personCharge')"
              :label="$t('upload.personCharge')"
              :placeholder="$t('form.rulesText')"
              clearable/>
            <van-field
              v-model="info.extraEdit.regCapital"
              :name="$t('upload.regCapital')"
              :label="$t('upload.regCapital')"
              :placeholder="$t('form.rulesText')"
              clearable/>
            <van-field
              v-model="info.issueDateStr"
              :rules="rule"
              :name="$t('upload.foundedDate')"
              :label="$t('upload.foundedDate')"
              :placeholder="$t('form.selectText')"
              readonly
              is-link
              clickable
              clearable
              @click="clickDate('foundedDate')"/>
            <van-field
              v-model="info.validDateStr"
              :name="$t('upload.validDate')"
              :label="$t('upload.validDate')"
              :placeholder="$t('form.validDate')"
              readonly
              is-link
              clickable
              clearable
              @click="clickDate('validDateStr')"/>
            <van-field
              v-model="info.extraEdit.businessScope"
              :name="$t('upload.businessScope')"
              :label="$t('upload.businessScope')"
              :placeholder="$t('form.rulesText')"
              type="textarea"
              rows="2"
              autosize
              clearable/>
          </div>

          <!-- 驾驶证 -->
          <div v-if="info.licenseKey == 2" class="info-area">
            <van-field
              v-model="info.licenseCode"
              :rules="rule"
              :name="$t('upload.licenseNumber')"
              :label="$t('upload.licenseNumber')"
              :placeholder="$t('form.rulesText')"
              clearable/>
            <van-field
              v-model="info.extraEdit.name"
              :rules="rule"
              :name="$t('upload.name')"
              :label="$t('upload.name')"
              :placeholder="$t('form.rulesText')"
              clearable/>
            <van-field
              v-model="info.extraEdit.gender"
              :name="$t('upload.gender')"
              :label="$t('upload.gender')"
              :placeholder="$t('form.rulesText')"
              clearable/>
            <van-field
              v-model="info.extraEdit.birthday"
              :name="$t('upload.birthday')"
              :label="$t('upload.birthday')"
              :placeholder="$t('form.selectText')"
              readonly
              is-link
              clickable
              clearable
              @click="clickDate('birthday')"/>
            <van-field
              v-model="info.extraEdit.level"
              :name="$t('upload.level')"
              :label="$t('upload.level')"
              :placeholder="$t('form.rulesText')"
              clearable/>
            <van-field
              v-model="info.extraEdit.confidence"
              :placeholder="$t('form.rulesText')"
              :name="$t('upload.confidence')"
              :label="$t('upload.confidence')"/>
            <van-field
              v-model="info.extraEdit.version"
              :placeholder="$t('form.rulesText')"
              :name="$t('upload.version')"
              :label="$t('upload.version')"
              clearable/>
            <van-field
              v-model="info.extraEdit.address"
              :name="$t('upload.address')"
              :label="$t('upload.address')"
              :placeholder="$t('form.rulesText')"
              clearable/>
            <van-field
              v-model="info.extraEdit.nationality"
              :name="$t('upload.nationality')"
              :label="$t('upload.nationality')"
              :placeholder="$t('form.rulesText')"
              clearable/>
            <van-field
              v-model="info.extraEdit.issuedBy"
              :name="$t('upload.issuedBy')"
              :label="$t('upload.issuedBy')"
              :placeholder="$t('form.rulesText')"
              clearable/>
            <van-field
              v-model="info.issueDateStr"
              :name="$t('upload.issueDate')"
              :label="$t('upload.issueDate')"
              :placeholder="$t('form.selectText')"
              readonly
              is-link
              clickable
              clearable
              @click="clickDate('issueDateStr')"/>
            <van-field
              v-model="info.extraEdit.validFrom"
              :name="$t('upload.validFrom')"
              :label="$t('upload.validFrom')"
              :placeholder="$t('form.selectText')"
              readonly
              is-link
              clickable
              clearable
              @click="clickDate('validFrom')"/>
            <van-field
              v-model="info.validDateStr"
              :name="$t('upload.validFor')"
              :label="$t('upload.validFor')"
              :placeholder="$t('form.selectText')"
              readonly
              is-link
              clickable
              clearable
              @click="clickDate('validFor')"/>
          </div>

          <!-- 身份证 -->
          <div v-if="info.licenseKey == 3" class="info-area">
            <van-field
              v-model="info.licenseCode"
              :rules="rule"
              :placeholder="$t('form.rulesText')"
              :name="$t('upload.idCardNumber')"
              :label="$t('upload.idCardNumber')"/>
            <van-field
              v-model="info.extraEdit.race"
              :placeholder="$t('form.rulesText')"
              :name="$t('upload.race')"
              :label="$t('upload.race')"
              clearable/>
            <van-field
              v-model="info.extraEdit.address"
              :name="$t('upload.address')"
              :label="$t('upload.address')"
              :placeholder="$t('form.rulesText')"
              clearable/>
            <van-field
              v-model="info.extraEdit.birthday"
              :name="$t('upload.birthday')"
              :label="$t('upload.birthday')"
              :placeholder="$t('form.selectText')"
              readonly
              is-link
              clickable
              clearable
              @click="clickDate('birthday')"/>
            <van-field
              v-model="info.extraEdit.gender"
              :name="$t('upload.gender')"
              :label="$t('upload.gender')"
              :placeholder="$t('form.rulesText')"
              clearable/>
            <van-field
              v-model="info.extraEdit.name"
              :name="$t('upload.name')"
              :label="$t('upload.name')"
              :placeholder="$t('form.rulesText')"
              clearable/>
            <van-field
              v-model="info.extraEdit.issuedBy"
              :name="$t('upload.issuedBy')"
              :label="$t('upload.issuedBy')"
              :placeholder="$t('form.rulesText')"
              clearable/>
            <van-field
              v-model="info.issueDateStr"
              :name="$t('upload.issueDate')"
              :label="$t('upload.issueDate')"
              :placeholder="$t('form.selectText')"
              readonly
              is-link
              clickable
              clearable
              @click="clickDate('issueDateStr')"/>
            <van-field
              v-model="info.validDateStr"
              :name="$t('upload.validDate1')"
              :label="$t('upload.validDate1')"
              :placeholder="$t('form.selectText')"
              readonly
              is-link
              clickable
              clearable
              @click="clickDate('validDateStr')"/>
          </div>

          <!-- 道路运输经营许可证 -->
          <div v-if="info.licenseKey == 4" class="info-area">
            <van-field
              v-model="info.licenseCode"
              :rules="rule"
              :placeholder="$t('form.rulesText')"
              :name="$t('upload.regNumber')"
              :label="$t('upload.regNumber')"/>
            <van-field
              v-model="info.extraEdit.compName"
              :placeholder="$t('form.rulesText')"
              :name="$t('upload.compName')"
              :label="$t('upload.compName')"
              clearable/>
            <van-field
              v-model="info.extraEdit.address"
              :name="$t('upload.address')"
              :label="$t('upload.address')"
              :placeholder="$t('form.rulesText')"
              clearable/>
            <van-field
              v-model="info.extraEdit.businessScope"
              :name="$t('upload.businessScope')"
              :label="$t('upload.businessScope')"
              :placeholder="$t('form.rulesText')"
              type="textarea"
              rows="2"
              clearable/>
            <van-field
              v-model="info.validDateStr"
              :name="$t('upload.validDate1')"
              :label="$t('upload.validDate1')"
              :placeholder="$t('form.selectText')"
              readonly
              is-link
              clickable
              clearable
              @click="clickDate('validDateStr')"/>
          </div>

          <!-- 从业资格证 -->
          <div v-if="info.licenseKey == 5" class="info-area">
            <van-field
              v-model="info.licenseCode"
              :rules="rule"
              :placeholder="$t('form.rulesText')"
              :name="$t('upload.licenseCode')"
              :label="$t('upload.licenseCode')"/>
            <van-field
              v-model="info.extraEdit.name"
              :placeholder="$t('form.rulesText')"
              :name="$t('upload.name')"
              :label="$t('upload.name')"
              clearable/>
            <van-field
              v-model="info.extraEdit.type"
              :name="$t('upload.type')"
              :label="$t('upload.type')"
              :placeholder="$t('form.rulesText')"
              clearable/>
            <van-field
              v-model="info.extraEdit.issuedBy"
              :name="$t('upload.issuedBy')"
              :label="$t('upload.issuedBy')"
              :placeholder="$t('form.rulesText')"
              clearable/>
            <van-field
              v-model="info.validDateStr"
              :name="$t('upload.validDate1')"
              :label="$t('upload.validDate1')"
              :placeholder="$t('form.selectText')"
              readonly
              is-link
              clickable
              clearable
              @click="clickDate('validDateStr')"/>
          </div>

          <!-- 安全员证 -->
          <div v-if="info.licenseKey == 6" class="info-area">
            <van-field
              v-model="info.licenseCode"
              :rules="rule"
              :placeholder="$t('form.rulesText')"
              :name="$t('upload.licenseCode')"
              :label="$t('upload.licenseCode')"/>
            <van-field
              v-model="info.extraEdit.name"
              :placeholder="$t('form.rulesText')"
              :name="$t('upload.name')"
              :label="$t('upload.name')"
              clearable/>
            <van-field
              v-model="info.extraEdit.type"
              :name="$t('upload.type')"
              :label="$t('upload.type')"
              :placeholder="$t('form.rulesText')"
              clearable/>
            <van-field
              v-model="info.extraEdit.issuedBy"
              :name="$t('upload.issuedBy')"
              :label="$t('upload.issuedBy')"
              :placeholder="$t('form.rulesText')"
              clearable/>
            <van-field
              v-model="info.validDateStr"
              :name="$t('upload.validDate1')"
              :label="$t('upload.validDate1')"
              :placeholder="$t('form.selectText')"
              readonly
              is-link
              clickable
              clearable
              @click="clickDate('validDateStr')"/>
          </div>

          <!-- 押运员证 -->
          <div v-if="info.licenseKey == 7" class="info-area">
            <van-field
              v-model="info.licenseCode"
              :rules="rule"
              :placeholder="$t('form.rulesText')"
              :name="$t('upload.licenseCode')"
              :label="$t('upload.licenseCode')"/>
            <van-field
              v-model="info.extraEdit.name"
              :placeholder="$t('form.rulesText')"
              :name="$t('upload.name')"
              :label="$t('upload.name')"
              clearable/>
            <van-field
              v-model="info.extraEdit.type"
              :name="$t('upload.type')"
              :label="$t('upload.type')"
              :placeholder="$t('form.rulesText')"
              clearable/>
            <van-field
              v-model="info.extraEdit.issuedBy"
              :name="$t('upload.issuedBy')"
              :label="$t('upload.issuedBy')"
              :placeholder="$t('form.rulesText')"
              clearable/>
            <van-field
              v-model="info.validDateStr"
              :name="$t('upload.validDate1')"
              :label="$t('upload.validDate1')"
              :placeholder="$t('form.selectText')"
              readonly
              is-link
              clickable
              clearable
              @click="clickDate('validDateStr')"/>
          </div>

          <!-- 运输许可证 -->
          <div v-if="info.licenseKey == 8" class="info-area">
            <van-field
              v-model="info.licenseCode"
              :rules="rule"
              :placeholder="$t('form.rulesText')"
              :name="$t('upload.permitLicenseNo')"
              :label="$t('upload.permitLicenseNo')"/>
            <van-field
              v-model="info.extraEdit.compName"
              :placeholder="$t('form.rulesText')"
              :name="$t('upload.compName')"
              :label="$t('upload.compName')"
              clearable/>
            <van-field
              v-model="info.extraEdit.address"
              :name="$t('upload.address')"
              :label="$t('upload.address')"
              :placeholder="$t('form.rulesText')"
              clearable/>
            <van-field
              v-model="info.extraEdit.plateNo"
              :name="$t('upload.plateNo')"
              :label="$t('upload.plateNo')"
              :placeholder="$t('form.rulesText')"
              clearable/>
            <van-field
              v-model="info.extraEdit.vehicleType"
              :name="$t('upload.vehicleType')"
              :label="$t('upload.vehicleType')"
              :placeholder="$t('form.rulesText')"
              clearable/>
            <van-field
              v-model="info.extraEdit.size"
              :name="$t('upload.size')"
              :label="$t('upload.size')"
              :placeholder="$t('form.rulesText')"
              clearable/>
            <van-field
              v-model="info.extraEdit.tonnage"
              :name="$t('upload.tonnage')"
              :label="$t('upload.tonnage')"
              :placeholder="$t('form.rulesText')"
              clearable/>
            <van-field
              v-model="info.extraEdit.issuedBy"
              :name="$t('upload.issuedBy')"
              :label="$t('upload.issuedBy')"
              :placeholder="$t('form.rulesText')"
              clearable/>
            <van-field
              v-model="info.issueDateStr"
              :name="$t('upload.issuedDate')"
              :label="$t('upload.issuedDate')"
              :placeholder="$t('form.selectText')"
              readonly
              is-link
              clickable
              clearable
              @click="clickDate('issueDateStr')"/>
            <van-field
              v-model="info.validDateStr"
              :name="$t('upload.validDate1')"
              :label="$t('upload.validDate1')"
              :placeholder="$t('form.selectText')"
              readonly
              is-link
              clickable
              clearable
              @click="clickDate('validDateStr')"/>
          </div>

          <!-- 行驶证 -->
          <div v-if="info.licenseKey == 9" class="info-area">
            <van-field
              v-model="info.licenseCode"
              :rules="rule"
              :placeholder="$t('form.rulesText')"
              :name="$t('upload.plateNo')"
              :label="$t('upload.plateNo')"/>
            <van-field
              v-model="info.extraEdit.vin"
              :placeholder="$t('form.rulesText')"
              :name="$t('upload.vin')"
              :label="$t('upload.vin')"
              clearable/>
            <van-field
              v-model="info.extraEdit.address"
              :name="$t('upload.address')"
              :label="$t('upload.address')"
              :placeholder="$t('form.rulesText')"
              clearable/>
            <van-field
              v-model="info.extraEdit.vehicleType"
              :name="$t('upload.vehicleType')"
              :label="$t('upload.vehicleType')"
              :placeholder="$t('form.rulesText')"
              clearable/>
            <van-field
              v-model="info.extraEdit.owner"
              :name="$t('upload.owner')"
              :label="$t('upload.owner')"
              :placeholder="$t('form.rulesText')"
              clearable/>
            <van-field
              v-model="info.extraEdit.useCharacter"
              :name="$t('upload.useCharacter')"
              :label="$t('upload.useCharacter')"
              :placeholder="$t('form.rulesText')"
              clearable/>
            <van-field
              v-model="info.extraEdit.issuedBy"
              :name="$t('upload.issuedBy')"
              :label="$t('upload.issuedBy')"
              :placeholder="$t('form.rulesText')"
              clearable/>
            <van-field
              v-model="info.issueDateStr"
              :name="$t('upload.issuedDate')"
              :label="$t('upload.issuedDate')"
              :placeholder="$t('form.selectText')"
              readonly
              is-link
              clickable
              clearable
              @click="clickDate('issueDateStr')"/>
            <van-field
              v-model="info.extraEdit.registerDate"
              :name="$t('upload.registerDate')"
              :label="$t('upload.registerDate')"
              :placeholder="$t('form.selectText')"
              readonly
              is-link
              clickable
              clearable
              @click="clickDate('registerDate')"/>
            <van-field
              v-model="info.extraEdit.engineNo"
              :name="$t('upload.engineNo')"
              :label="$t('upload.engineNo')"
              :placeholder="$t('form.rulesText')"
              clearable/>
          </div>

          <!-- 新增通用证件 -->
          <div v-if="info.licenseKey > 9" class="info-area">
            <van-field
              v-model="info.licenseCode"
              :rules="rule"
              :placeholder="$t('form.rulesText')"
              :name="$t('upload.licenseCode')"
              :label="$t('upload.licenseCode')"/>
            <van-field
              v-model="info.issueDateStr"
              :name="$t('upload.issuedDate')"
              :label="$t('upload.issuedDate')"
              :rules="rule"
              :placeholder="$t('form.selectText')"
              readonly
              is-link
              clickable
              clearable
              @click="clickDate('issueDateStr')"/>
            <van-field
              v-model="info.issueDateStr"
              :name="$t('upload.issuedDate')"
              :label="$t('upload.issuedDate')"
              :placeholder="$t('form.selectText')"
              readonly
              is-link
              clickable
              clearable
              @click="clickDate('issueDateStr')"/>
          </div>
          <van-button
            :loading="btnLoading"
            block
            type="info"
            class="large"
            native-type="submit">
            {{ $t("table.confirm") }}
          </van-button>
        </van-form>
      </div>
    </div>
    <van-popup v-model="showCalendar" position="bottom">
      <van-datetime-picker
        type="date"
        @confirm="onConfirm"
        @cancel="showCalendar = false"/>
    </van-popup>
  </div>
</template>
<script>
import { uploadFile } from '@/api/public'
import { saveCer, uploadCredentials, updateCer, infoCer } from '@/api/member'
import { compressImage } from '@/utils/compressImage'
export default {
  data() {
    return {
      rule: [{ required: true, message: this.$t('form.rulesText') }],
      info: {
        extraEdit: {}
      },
      btnLoading: false,
      title: '',
      showCalendar: false,
      type: '',
      upload: this.$t('form.upload'),
      front: this.$t('form.front'),
      back: this.$t('form.back'),
      tip: this.$t('upload.tip'),
      id: null
    }
  },
  created() {
    this.id = this.$route.query.id
    this.title = this.$route.query.licenseName
    this.info.licenseKey = this.$route.query.licenseKey - 0
  },
  mounted() {
    if (this.id) {
      this.getDetail()
    }
  },
  methods: {
    clickDate(type) {
      this.showCalendar = true
      this.type = type
    },
    onConfirm(date) {
      const year = `${date.getFullYear()}`
      const month = `${date.getMonth() + 1}`
      const day = `${date.getDate()}`
      const value =
        year +
        '-' +
        (month >= 10 ? month : '0' + month) +
        '-' +
        (day >= 10 ? day : '0' + day)
      this.info[this.type] = value
      this.showCalendar = false
    },
    onSubmit(values) {
      this.btnLoading = true
      this.info.extraInfo = JSON.stringify(this.info.extraEdit)
      if (this.id) {
        setTimeout(() => {
          this.onClickLeft()
        }, 3000)
      } else {
        this.createData()
      }
    },
    createData() {
      saveCer(this.info)
        .then(response => {
          this.btnLoading = false
          if (response.data) {
            this.$toast.success(this.$t('upload.success'))
            setTimeout(() => {
              this.onClickLeft()
            }, 3000)
          } else {
            this.$toast.success(this.$t('upload.fail'))
          }
        })
        .catch(() => {
          this.btnLoading = false
        })
    },

    updateData() {
      updateCer(this.info)
        .then(response => {
          this.btnLoading = false
          if (response.data) {
            this.$toast.success(this.$t('upload.success'))
            setTimeout(() => {
              this.onClickLeft()
            }, 2000)
          } else {
            this.$toast.success(this.$t('upload.fail'))
          }
        })
        .catch(() => {
          this.btnLoading = false
        })
    },

    getDetail() {
      infoCer({ id: this.id }).then(response => {
        if (response.data) {
          this.info = response.data
          this.info.validDateStr = this.info.validDate
          this.info.issueDateStr = this.info.issueDate
          this.info.extraEdit = JSON.parse(response.data.extraInfo)
        }
      })
    },

    onClickLeft() {
      this.$router.back(-1)
    },

    // 可以解析证件：1营业执照、3身份证、2驾驶证、9行驶证
    // 双面：licenseKey == 3 || licenseKey == 2 || licenseKey == 9 || licenseKey > 9
    async afterReadImg1(file) {
      const fileImage = await compressImage(file)
      this.uploadImg(fileImage, 'imgUrl1')
    },

    async afterReadImg2(file) {
      const fileImage = await compressImage(file)
      this.uploadImg(fileImage, 'imgUrl2')
    },

    beforeRead() {
      if (this.id) {
        return false
      } else {
        return true
      }
    },

    uploadImg(fileImage, img) {
      this.$toast.loading()
      var formData = new FormData()
      formData.append('file', fileImage)
      uploadFile(formData).then(response => {
        this.$set(this.info, img, response.data)
        if (this.info.licenseKey === 2 || this.info.licenseKey === 3 || this.info.licenseKey === 9 || this.info.licenseKey === 1) {
          if (this.info.imgUrl1 && this.info.imgUrl2 && this.info.licenseKey !== 1) {
            this.analysisAndSave()
          }

          if (this.info.imgUrl1 && this.info.licenseKey === 1) {
            this.analysisAndSave()
          }
        } else {
          this.$toast.clear()
        }
      }).catch(() => {
        this.$toast.clear()
      })
    },

    analysisAndSave() {
      uploadCredentials(this.info).then(response => {
        this.$toast.clear()
        this.btnLoading = false
        if (response.data) {
          this.$toast.success(this.$t('upload.anaSuceess'))
          const info = response.data
          this.judgeInfoByLicensekey(info)
        }
      }).catch(e => {
        this.$toast.clear()
        this.btnLoading = false
      })
    },
    judgeInfoByLicensekey(info) {
      let memo1 = {}
      if (info.memo1) {
        memo1 = JSON.parse(info.memo1)
      }
      let memo2 = {}
      if (info.memo2) {
        memo2 = JSON.parse(info.memo2)
      }
      this.info.id = info.id
      // 可以解析证件：1营业执照、2驾驶证、3身份证、9行驶证
      if (info.licenseKey === 1) {
        this.info.licenseCode = memo1.reg_num
        this.info.extraEdit.regName = memo1.name
        this.info.extraEdit.address = memo1.address
        this.info.extraEdit.licenseType = memo1.type
        this.info.extraEdit.personCharge = memo1.person
        this.info.extraEdit.regCapital = memo1.capital
        this.info.issueDateStr = this.timeFormatter(memo1.establish_date)
        this.info.extraEdit.businessScope = memo1.business
      } else if (info.licenseKey === 2) {
        this.info.licenseCode = memo1.num
        this.info.extraEdit.name = memo1.name
        this.info.extraEdit.address = memo1.addr
        this.info.extraEdit.gender = memo1.sex
        this.info.extraEdit.birthday = this.timeFormatter(memo1.birth_date)
        this.info.extraEdit.level = memo1.vehicle_type
        this.info.extraEdit.nationality = memo1.nation
        this.info.validDateStr = this.timeFormatter(memo1.end_date)
        this.info.extraEdit.issuedBy = this.timeFormatter(memo1.issue)
        this.info.extraEdit.validFrom = this.timeFormatter(memo1.start_date)
        this.info.issueDateStr = this.timeFormatter(memo1.issue_date)
      } else if (info.licenseKey === 3) {
        this.info.extraEdit.address = memo1.address
        this.info.extraEdit.race = memo1.nationality
        this.info.licenseCode = memo1.num
        this.info.extraEdit.gender = memo1.sex
        this.info.extraEdit.birthday = this.timeFormatter(memo1.birth)
        this.info.extraEdit.name = memo1.name
        this.info.validDateStr = this.timeFormatter(memo2.end_date)
        this.info.extraEdit.issuedBy = this.timeFormatter(memo2.issue)
        this.info.issueDateStr = this.timeFormatter(memo2.start_date)
      } else if (info.licenseKey === 9) {
        this.info.extraEdit.owner = memo1.owner
        this.info.extraEdit.vin = memo1.vin
        this.info.licenseCode = memo1.plate_num
        this.info.extraEdit.address = memo1.addr
        this.info.extraEdit.vehicleType = memo1.vehicle_type
        this.info.extraEdit.useCharacter = memo1.use_character
        this.info.extraEdit.engineNo = memo1.engine_num
        this.info.extraEdit.registerDate = this.timeFormatter(
          memo1.register_date
        )
        this.info.issueDateStr = this.timeFormatter(memo1.issue_date)
      }
      this.info = JSON.parse(JSON.stringify(this.info))
    },
    timeFormatter(str) {
      if (!str) {
        return
      }
      if (str.length === 8) {
        return (
          str.substr(0, 4) + '-' + str.substr(4, 2) + '-' + str.substr(6, 2)
        )
      } else if (str.length === 6) {
        return (
          str.substr(0, 4) + '-0' + str.substr(4, 1) + '-0' + str.substr(5, 1)
        )
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.upload-container {
  margin-bottom: 30px;
}
.tip {
  display: flex;
  margin-top: 20px;
  img {
    width: 16px;
    height: 16px;
  }
  span {
    font-size: 10px;
    color: rgba(255, 70, 70, 1);
    line-height: 14px;
  }
}
.info-area {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 7px 0px rgba(183, 183, 183, 0.5);
  border-radius: 14px;
  padding: 10px;
  margin-bottom: 20px;
  .title {
    font-size: 18px;
    color: #444444;
    width: 36px;
  }
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
</style>
