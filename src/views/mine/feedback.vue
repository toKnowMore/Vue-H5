<template>
  <div class="feedbackPage">
    <van-nav-bar
      :title="$t('feedback.title')"
      left-arrow
      fixed
      @click-left="onClickLeft"/>

    <div class="app-container">
      <van-form validate-first @submit="onSubmit">
        <van-field
          v-model="feedbackEdit.message"
          :placeholder="$t('feedback.textarea')"
          :rules="rules"
          :rows="5"
          class="textarea"
          clearable
          type="textarea"/>

        <div class="box">
          <div class="title">{{ $t("feedback.addImg") }}</div>
          <van-uploader
            v-model="imageList"
            :max-count="4"
            :after-read="afterReadImg"
            :before-read="beforeUploadFile"
            :before-delete="deleteFile"
            multiple
            result-type="file"
            @delete="deleteFile">
            <img v-show="feedbackEdit.imgUrl1" :src="feedbackEdit.imgUrl1">
            <van-button
              v-show="!feedbackEdit.imgUrl1"
              icon="add"
              deletable/>
          </van-uploader>
        </div>

        <div class="box">
          <div class="title">{{ $t("feedback.linkType") }}</div>
          <van-field
            v-model="feedbackEdit.number"
            :placeholder="$t('feedback.input')"
            clearable/>
        </div>

        <van-button
          :loading="bntLoading"
          class="normal"
          round
          block
          type="info"
          native-type="submit">{{ $t("table.confirm") }}</van-button>
      </van-form>
    </div>
  </div>
</template>

<script>
import { uploadFile } from '@/api/public'
import { feedbackSave } from '@/api/feedback'
export default {
  data() {
    return {
      imageList: [],
      imageUrlList: [],
      rules: [{ required: true, message: this.$t('form.rulesText') }],
      feedbackEdit: {},
      bntLoading: false
    }
  },
  created() {},
  methods: {
    onClickLeft() {
      this.$router.back(-1)
    },
    onRemoveImage(index) {
      this.imageList.splice(index, 1)
    },
    afterReadImg(file) {
      var formData = new FormData()
      formData.append('file', file.file)
      uploadFile(formData).then(response => {
        console.log(this.imageList)
      })
    },
    beforeUploadFile(file, detail) {
      return true
    },
    deleteFile(file, detail) {
      console.log(file, detail)
    },
    onSubmit(values) {
      this.bntLoading = true
      feedbackSave()
        .then(response => {
          this.bntLoading = false
          if (response.data) {
            this.$toast.success(this.$t('feedback.success'))
          } else {
            this.$toast.fail(this.$t('feedback.fail'))
          }
        })
        .catch(() => {
          this.bntLoading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.textarea {
  width: 100%;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 7px 0px rgba(183, 183, 183, 0.5);
  border-radius: 16px;
}

.box {
  margin-top: 20px;
  .title {
    font-size: 16px;
    font-weight: 500;
    color: rgba(68, 68, 68, 1);
    margin-bottom: 15px;
  }
}
.van-form {
  align-items: flex-start;
}
.van-field {
  width: 346px;
  min-height: 44px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 7px 0px rgba(183, 183, 183, 0.5);
  border-radius: 12px;
}
.van-uploader {
  width: 100px;
  height: 100px;
}
</style>
