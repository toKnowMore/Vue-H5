<!-- 模拟考试 -->
<template>
  <div class="examIngPage">
    <div class="app-container">
      <header>
        <div class="header-left">
          <div class="kuai"/>
          <div class="examType">
            {{ currentExam.type | questionType(translate) }}
          </div>
        </div>
        <div class="header-center">
          <div class="timeDesc">剩余时间</div>
          <van-count-down
            :time="examTime"
            format="HH:mm:ss"
            @finish="timeFinish">
            <template v-slot="timeData">
              <span class="van-count-down-item">{{ timeData.hours }}</span>
              <span class="van-count-down-item">{{ timeData.minutes }}</span>
              <span class="van-count-down-item">{{ timeData.seconds }}</span>
            </template>
          </van-count-down>
        </div>
        <div class="header-right" @click="toShowModal">
          <van-icon name="apps-o"/>
          <div class="qProgress">
            <span class="currentQs">{{ currentIndex + 1 }}</span>
            <span>/</span>
            <span class="totalQs">{{ listData.length }}</span>
          </div>
        </div>
      </header>
      <section class="container">
        <div class="qTitle">
          <span>{{ currentExam.title }}</span>
          <video ref="myVideo" controls/>
          <canvas ref="myCanvas" width="150" height="200"/>
        </div>
        <div class="selectArea">
          <van-checkbox-group
            v-show="currentExam.type == 1"
            v-model="currentExam.checkList"
            icon-size="20px"
            @change="optionChange">
            <van-checkbox
              v-for="(item, index) in currentExam.options"
              :key="index"
              :name="item.key">{{ item.key }}、{{ item.value }}</van-checkbox>
          </van-checkbox-group>
          <van-radio-group
            v-show="currentExam.type == 2 || currentExam.type == 0"
            v-model="currentExam.select"
            icon-size="20px"
            @change="optionChange">
            <van-radio
              v-for="(item, index) in currentExam.options"
              :key="index"
              :name="item.key">{{ item.key }}、{{ item.value }}</van-radio>
          </van-radio-group>
        </div>
        <div v-if="currentExam.attachType > 0" class="attach">
          <video
            v-if="currentExam.attachType == 2"
            controls="controls"
            preload="auto"
            poster
            muted>
            <source :src="currentExam.attach">
            您的浏览器不支持 video
          </video>
          <img v-if="currentExam.attachType == 1" :src="currentExam.attach">
        </div>
      </section>
      <footer>
        <div class="footerLeft">
          <van-button class="qButton" @click.stop="toLast">{{
            $t("exam.lastQ")
          }}</van-button>
          <van-button class="qButton" @click.stop="toNext">{{
            $t("exam.nextQ")
          }}</van-button>
        </div>
        <van-button
          :loading="btnLoading"
          type="info"
          class="submit"
          @click.stop="submitExam">
          {{ $t("exam.submit") }}
        </van-button>
      </footer>
    </div>

    <!-- 题目序列板 -->
    <modal-numbers
      :show="showModal"
      :list="listData"
      :styles="{ top: '50px' }"
      :current-index="currentIndex"
      position="top"
      @click="itemClick"
      @close="toCloseNumbers"/>

  </div>
</template>

<script>
import modalNumbers from '@/components/modalNumbers'
import {
  examQuestions,
  saveExamQuestion,
  submitExamQ,
  checkFaceImg
} from '@/api/exam'
import { uploadFile } from '@/api/public'
export default {
  components: {
    modalNumbers
  },
  filters: {
    isPass: function(val, translate) {
      switch (val) {
        case 0:
          return translate('mockAndExam.passStatus')
        case 1:
          return translate('mockAndExam.nopassStatus')
        default:
          break
      }
    },
    questionType(val, translate) {
      switch (val) {
        case 0:
          return translate('filter.singleChoice')
        case 1:
          return translate('filter.multipleChoice')
        case 2:
          return translate('filter.truefalse')
        default:
          break
      }
    }
  },
  data() {
    return {
      currentExam: {},
      currentIndex: 0,
      listData: [],
      submitExamEdit: {},
      answers: [],
      examTime: 5400000,
      submit: false,
      btnLoading: false,
      showModal: false,
      examParams: {},
      faceImg: '',
      isLeave: true,

      video: null,
      context: null,
      canvas: null,
      isMonitor: 0,
      timer: null,
      startVideo: false
    }
  },
  created(e) {
    const info = localStorage.getItem('examParams')
    this.examParams = JSON.parse(info)
  },
  mounted() {
    if (this.examParams) {
      this.getQuestions()
    }
  },
  beforeRouteEnter(to, from, next) {
    next()
  },

  beforeRouteLeave(to, from, next) {
    if (this.isLeave) {
      this.$dialog
        .confirm({
          title: this.$t('mockAndExam.tip'),
          message: this.$t('mockAndExam.giveUp')
        })
        .then(() => {
          this.sendSubmitData()
        })
    } else {
      next()
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  methods: {
    translate(str) {
      return this.$t(str)
    },
    itemClick(item, index) {
      this.currentIndex = index
      this.showModal = false
      this.buildData()
    },
    toCloseNumbers() {
      this.showModal = false
    },
    parseDate(date) {
      const t = Date.parse(date)
      if (isNaN(t)) {
        return new Date(Date.parse(date.replace(/-/g, '/'))).getTime()
      } else {
        return t
      }
    },
    /**
     * 获取正式考题列表
     */
    getQuestions() {
      examQuestions(this.examParams).then(response => {
        if (response.data) {
          const data = response.data

          this.listData = JSON.parse(data.examQuestions)

          this.answers = JSON.parse(data.answers)

          if (this.answers.length > 0) {
            this.listData.forEach((item, index) => {
              // 多选
              item.checkList = []
              item.select = ''
              if (item.type === 1 && this.answers[index]) {
                item.checkList = this.answers[index].split(',')
              } else {
                item.select = this.answers[index]
              }
              item.options = JSON.parse(item.options)
            })
          } else {
            this.listData.forEach((item, index) => {
              item.checkList = []
              item.select = ''
              item.options = JSON.parse(item.options)
            })
          }

          // 是否开启监控
          this.isMonitor = data.isMonitor

          if (this.isMonitor > 0) {
            this.startCamera()
          }

          this.submitExamEdit.examResultId = data.examResultId

          this.submitExamEdit.questions = data.examQuestions
          // 判断是否为继续考试
          const examLength = data.examLength * 60 * 1000
          if (this.examParams.isNewExam) {
            // 新考试，时间为考试时长
            this.examTime = examLength
          } else {
            // 继续考试，时间为时间间隔
            const lastTime = this.parseDate(data.createTime)
            const nowTime = new Date().getTime()

            if (nowTime - lastTime < examLength) {
              this.examTime = examLength
            } else {
              this.timeFinish()
              return
            }
          }

          // 进来之后就变成了正在考试中，没有新题
          this.examParams.isNewExam = 0

          const info = JSON.stringify(this.examParams)

          localStorage.setItem('examParams', info)

          const value = localStorage.getItem('currentIndex')
          if (value) {
            this.currentIndex = value - 0
          }
          this.buildData()
        }
      })
    },

    /**
     * 构建数据
     */
    buildData() {
      this.currentExam = this.listData[this.currentIndex]
      localStorage.setItem('currentIndex', this.currentIndex)
      this.currentExam = JSON.parse(JSON.stringify(this.currentExam))
    },

    toLast() {
      if (this.currentIndex > 0) {
        this.currentIndex--
        this.buildData()
      } else {
        this.$toast(this.$t('mockAndExam.first'))
      }
    },
    toNext() {
      if (this.currentIndex < this.listData.length - 1) {
        this.currentIndex++
        this.buildData()
      } else {
        this.$toast(this.$t('mockAndExam.last'))
      }
    },

    optionChange() {
      this.listData[this.currentIndex] = this.currentExam
      const answer = []
      this.listData.forEach((item, index) => {
        if (item.select) {
          answer.push(item.select)
        } else if (item.checkList.length > 0) {
          item.check = item.checkList.join(',')
          answer.push(item.check)
        } else {
          answer.push('')
        }
      })
      const answers = JSON.stringify(answer)
      saveExamQuestion({
        id: this.submitExamEdit.examResultId,
        answers: answers
      }).then(response => {})
    },

    toShowModal() {
      this.showModal = !this.showModal
    },

    submitExam() {
      this.$dialog.confirm({
        title: this.$t('mockAndExam.tip'),
        message: this.$t('mockAndExam.submit')
      }).then(() => {
        this.sendSubmitData()
      }).catch(() => {
        console.log('123')
      })
    },
    sendSubmitData() {
      this.answers = []
      this.listData.forEach((item, index) => {
        if (item.select) {
          this.answers.push(item.select)
        } else if (item.checkList.length > 0) {
          item.check = item.checkList.join(',')
          this.answers.push(item.check)
        } else {
          this.answers.push('')
        }
      })
      this.submitExamEdit.answers = JSON.stringify(this.answers)
      submitExamQ(this.submitExamEdit).then(response => {
        if (response.data) {
          this.isLeave = false
          localStorage.removeItem('currentIndex')
          localStorage.removeItem('examParams')
          this.$router.replace({
            path: '/examResult',
            query: {
              id: response.data.examResultId,
              score: response.data.examScore,
              type: 'exam',
              isPass: response.data.ispassed
            }
          })
        }
      })
    },

    /**
     * 时间结束
     */
    timeFinish() {
      this.$toast('答题时间到')
      this.sendSubmitData()
    },

    startCamera() {
      // 首先清除计时器
      if (this.timer) {
        clearInterval(this.timer)
      }

      this.startVideo = true
      this.initVideo()
    },

    initVideo() {
      this.video = this.$refs.myVideo
      this.canvas = this.$refs.myCanvas
      this.context = this.canvas.getContext('2d')
      if (navigator.mediaDevices.getUserMedia || navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia) {
      // 调用用户媒体设备, 访问摄像头
        this.getUserMedia({ video: { width: 150, height: 200, 'facingMode': 'user' }}, this.success, this.error)
      } else {
        this.$toast('不支持访问用户媒体')
      }
    },

    getUserMedia(constraints, success, error) {
      if (navigator.mediaDevices.getUserMedia) {
        // 最新的标准API
        navigator.mediaDevices.getUserMedia(constraints).then(success).catch(error)
      } else if (navigator.webkitGetUserMedia) {
        // webkit核心浏览器
        navigator.webkitGetUserMedia(constraints, success, error)
      } else if (navigator.mozGetUserMedia) {
        // firfox浏览器
        navigator.mozGetUserMedia(constraints, success, error)
      } else if (navigator.getUserMedia) {
        // 旧版API
        navigator.getUserMedia(constraints, success, error)
      }
    },

    success(stream) {
      // 兼容webkit核心浏览器
      try {
        this.video.srcObject = stream
        this.video.play()
      } catch (err) {
        const CompatibleURL = window.URL || window.webkitURL
        this.video.src = CompatibleURL.createObjectURL(stream)
        this.video.play()
      }
      this.startTimer()
    },

    error(error) {
      this.$toast(error)
    },

    startTimer() {
      this.timer = setInterval(() => {
        this.capture()
        clearInterval(this.timer)
      }, 3000)
    },

    async capture() {
      // 指定图片的DataURL(图片的base64编码数据)
      this.context.drawImage(this.video, 0, 0, 150, 200)
      const file = {}
      file.content = this.canvas.toDataURL('image/png', 0.92)
      file.name = 'sign.png'
      file.type = 'image/png'
      const fileImg = await this.dataURLtoFile(file)
      this.$toast(JSON.stringify(fileImg))
      this.uploadImg(fileImg)
    },

    dataURLtoFile(file) {
      var arr = file.content.split(',')
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], file.name, {
        type: file.type
      })
    },

    uploadImg(file) {
      var formData = new FormData()
      formData.append('file', file)
      uploadFile(formData).then(response => {
        this.faceImg = response.data
        this.context.clearRect(0, 0, 150, 200)
        this.sendFaceImg()
      })
    },

    // 人脸照片比对
    sendFaceImg() {
      checkFaceImg({
        faceImg: this.faceImg,
        examResultId: this.submitExamEdit.faceImg ? this.submitExamEdit.faceImg : 20214
      }).then(response => {
        if (response.data) {
          this.submitExamEdit.isCheat = 0
        } else {
          this.submitExamEdit.isCheat = 1
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
header {
  width: calc(100% - 30px);
  position: fixed;
  height: 68px;
  left: 0;
  top: 0;
  background: rgba(245, 249, 254, 1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  & > div {
    display: flex;
    align-items: center;
  }
}

.header-left {
  .kuai {
    width: 6px;
    height: 18px;
    background: rgba(78, 140, 238, 1);
    margin-right: 10px;
  }
  .examType {
    font-size: 18px;
    font-weight: 500;
    color: rgba(68, 68, 68, 1);
  }
}
.timeDesc {
  font-size: 12px;
  color: rgba(68, 68, 68, 1);
  margin-right: 5px;
}
.van-count-down-item {
  width: 20px;
  height: 20px;
  background: rgba(57, 57, 57, 1);
  border-radius: 2px;
  display: inline-block;
  margin-right: 2px;
  font-size: 12px;
  text-align: center;
  color: #fff;
}
.header-right {
  .van-icon {
    font-size: 18px;
  }
  .qProgress {
    font-size: 14px;
    margin-left: 5px;
  }
}
section.container {
  margin-bottom: 50px;
}
.qTitle {
  margin-top: 20px;
  display: flex;
  height: 200px;
  span {
    font-size: 18px;
    font-weight: 500;
    color: rgba(68, 68, 68, 1);
    line-height: 25px;
    margin-right: 150px;
  }
  video {
    width: 150px;
    height: 200px;
    position: fixed;
    right: 0;
    top: 70px;
  }
  canvas {
    position: fixed;
    right: 0;
    top: 70px;
  }
}
.selectArea {
  display: flex;
  margin: 20px auto;

}
.attach {
  video {
    width: 330px;
    height: 178px;
    background: rgba(216, 216, 216, 1);
    border-radius: 17px;
  }
  img {
    width: 330px;
    height: 178px;
    background: rgba(216, 216, 216, 1);
    border-radius: 17px;
  }
}
footer {
  display: flex;
  height: 50px;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  justify-content: space-between;
}
.footerLeft {
  width: 244px;
  display: flex;
  align-items: center;
  .qButton {
    flex: 1;
    text-align: center;
    height: 50px;
    line-height: 50px;
    font-size: 14px;
    background: rgba(245, 249, 254, 1);
  }
  .qButton + .qButton {
    border-left: 1px solid #4e8cee;
  }
}
</style>
<style lang="scss">
.examIngPage {
  .van-checkbox,
  .van-radio {
    min-height: 40px;
    display: flex;
    align-items: center;
    margin-bottom: 5px;
  }
  .van-checkbox__label,
  .van-radio__label {
    font-size: 16px;
    line-height: 30px;
  }
  .submit {
    flex: 1;
  }
}
</style>
