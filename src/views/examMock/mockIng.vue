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
  trainQuestions,
  submitTrain
} from '@/api/mock'
export default {
  components: {
    modalNumbers
  },
  filters: {
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
      submitMockEdit: {},
      answers: [],
      btnLoading: false,
      showModal: false,
      isLeave: true
    }
  },
  created(e) {},
  mounted() {
    if (localStorage.getItem('currentIndex')) {
      this.secondEnter()
    } else {
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
      localStorage.removeItem('currentIndex')
      localStorage.removeItem('examQuestions')
      localStorage.removeItem('trainResultId')
      localStorage.removeItem('answers')
      next()
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
    // 刷新或者某种原因第二次进
    secondEnter() {
      const questions = localStorage.getItem('trainQuestions')

      this.listData = JSON.parse(questions)

      this.answers = JSON.parse(localStorage.getItem('answers'))

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

      this.submitMockEdit.trainResultId = localStorage.getItem('trainResultId')

      this.submitMockEdit.questions = questions

      if (localStorage.getItem('currentIndex')) {
        this.currentIndex = localStorage.getItem('currentIndex') - 0
      }

      this.buildData()
    },
    /**
     * 获取正式考题列表
     */
    getQuestions() {
      trainQuestions(this.examParams).then(response => {
        if (response.data) {
          const data = response.data

          localStorage.setItem('trainQuestions', data.trainQuestions)
          localStorage.setItem('trainResultId', data.trainResultId)

          this.listData = JSON.parse(data.trainQuestions)

          this.listData.forEach((item, index) => {
            item.checkList = []
            item.select = ''
            item.options = JSON.parse(item.options)
          })

          this.submitMockEdit.trainResultId = data.trainResultId

          this.submitMockEdit.questions = data.trainQuestions

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
      localStorage.setItem('answers', answers)
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
      this.submitMockEdit.answers = JSON.stringify(this.answers)
      submitTrain(this.submitMockEdit).then(response => {
        if (response.data) {
          this.isLeave = false
          localStorage.removeItem('currentIndex')
          localStorage.removeItem('trainQuestions')
          localStorage.removeItem('trainResultId')
          localStorage.removeItem('answers')
          this.$router.replace({
            path: '/examResult',
            query: {
              score: response.data.score,
              type: 'mock',
              isPass: response.data.ispassed
            }
          })
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
  span {
    font-size: 18px;
    font-weight: 500;
    color: rgba(68, 68, 68, 1);
    line-height: 25px;
    margin-right: 150px;
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
