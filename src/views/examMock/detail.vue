<!-- 模拟考试 -->
<template>
  <div class="detailPage">
    <van-nav-bar :title="title" left-arrow fixed @click-left="onClickLeft"/>
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
          {{ currentExam.title }}
        </div>
        <div class="selectArea">
          <van-checkbox-group
            v-show="currentExam.type == 1"
            icon-size="20px">
            <van-checkbox
              v-for="(item, index) in currentExam.optionList"
              :key="index"
              :name="item.key">
              <img
                v-if="item.status == 1"
                slot="icon"
                :src="activeIcon"
                class="answer_icon">
              <img
                v-if="item.status == 0"
                slot="icon"
                :src="inactiveIcon"
                class="answer_icon">
              <img
                v-if="item.status == 2"
                slot="icon"
                :src="noactiveIcon"
                class="answer_icon">
              {{ item.key }}、{{ item.value }}
            </van-checkbox>
          </van-checkbox-group>
          <van-radio-group
            v-show="currentExam.type == 2 || currentExam.type == 0"
            icon-size="20px">
            <van-radio
              v-for="(item, index) in currentExam.optionList"
              :key="index"
              :name="item.key">
              <img
                v-if="item.status == 1"
                slot="icon"
                :src="activeIcon"
                class="answer_icon">
              <img
                v-if="item.status == 0"
                slot="icon"
                :src="inactiveIcon"
                class="answer_icon">
              <img
                v-if="item.status == 2"
                slot="icon"
                :src="noactiveIcon"
                class="answer_icon">
              {{ item.key }}、{{ item.value }}
            </van-radio>
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
        <div class="correct">
          <span class="title">{{ $t('mockAndExam.rightAnswer') }}：</span>
          <span class="value">{{ currentExam.answer }}</span>
        </div>
      </section>
      <footer>
        <div class="footerLeft">
          <div class="qButton" @click.stop="toLast">{{ $t("exam.lastQ") }}</div>
          <div class="qButton" @click.stop="toNext">{{ $t("exam.nextQ") }}</div>
        </div>
        <van-button
          :loading="btnLoading"
          type="info"
          class="submit"
          icon="add-o"
          @click.stop="addError">
          {{ $t("mockAndExam.addError") }}
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
import { trainResultInfo, examResultInfo, saveError } from '@/api/record'
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
      answers: [],
      fromPage: '',
      btnLoading: false,
      showModal: false,
      title: '',
      id: '',
      activeIcon: require('@/assets/mockAndExam/right.png'),
      inactiveIcon: require('@/assets/mockAndExam/error.png'),
      noactiveIcon: require('@/assets/mockAndExam/no.png')
    }
  },
  created() {
    this.type = this.$route.query.type
    this.id = this.$route.query.id
    if (this.type === 'mock') {
      this.title = this.$t('mockAndExam.mockDetail')
    } else if (this.type === 'exam') {
      this.title = this.$t('mockAndExam.examDetail')
    }
  },
  mounted() {
    this.getDetail()
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
    onClickLeft() {
      this.$router.back(-1)
    },
    getDetail() {
      if (this.type === 'mock') {
        trainResultInfo({ id: this.id }).then(response => {
          this.questions(response)
        })
      } else if (this.type === 'exam') {
        examResultInfo({ id: this.id }).then(response => {
          this.questions(response)
        })
      }
    },
    toShowModal() {
      this.showModal = !this.showModal
    },
    /**
     * 获取正式考题列表
     */
    questions(response) {
      const data = response.data

      this.listData = JSON.parse(data.questions)

      this.answers = JSON.parse(data.answers)

      this.listData.forEach((item, index) => {
        item.optionList = JSON.parse(item.options)

        item.myAnswer = this.answers[index]
        item.questionId = item.id
        delete item.id
        item.answerRightArray = item.answer.split(',')
        item.optionList.forEach((mitem, index) => {
          // 我选了
          if (item.myAnswer.includes(mitem.key)) {
            // 答案正确
            if (item.answerRightArray.includes(mitem.key)) {
              mitem.status = 1
            } else {
              // 答案错误
              mitem.status = 0
            }
          } else {
            // 没选
            mitem.status = 2
          }
        })

        if (item.answer === this.answers[index]) {
          item.isRight = true
        } else {
          item.isRight = false
        }
      })

      this.buildData()
    },
    /**
     * 构建数据
     */
    buildData() {
      this.currentExam = this.listData[this.currentIndex]
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
    addError() {
      this.btnLoading = true
      saveError(this.currentExam).then(response => {
        this.btnLoading = false
        if (response.data) {
          this.$toast.success(this.$t('mockAndExam.addErrorSuccess'))
        } else {
          this.$toast.success(this.$t('mockAndExam.addErrorFail'))
        }
      }).catch(() => {
        this.btnLoading = false
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
  top: 50px;
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
  margin: 68px 0 51px 0;
}
.qTitle {
  font-size: 18px;
  font-weight: 500;
  color: rgba(68, 68, 68, 1);
  line-height: 25px;
  margin-top: 20px;
}
.selectArea {
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
.correct {
  .title {
    color: #000000;
    font-size: 18px;
    font-weight: 600;
  }
  .value {
    color: #257fff;
    font-size: 28px;
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
  height: 50px;
  background: rgba(245, 249, 254, 1);
  display: flex;
  align-items: center;
  .qButton {
    flex: 1;
    text-align: center;
    height: 30px;
    line-height: 30px;
    padding: 10px 0;
    font-size: 14px;
  }
  .qButton + .qButton {
    border-left: 1px solid #4e8cee;
  }
}
</style>
<style lang="scss">
.detailPage {
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
