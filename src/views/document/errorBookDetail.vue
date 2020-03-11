<!-- 模拟考试 -->
<template>
  <div class="qDetailPage">
    <van-nav-bar :title="$t('mine.errorBookDetail')" left-arrow fixed @click-left="onClickLeft"/>
    <div class="app-container">
      <header>
        <div class="header-left">
          <div class="kuai"/>
          <div class="examType">
            {{ currentExam.type | questionType(translate) }}
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
        <van-button
          :loading="btnLoading"
          type="info"
          class="large"
          size="large"
          icon="delete"
          @click.stop="remove">
          {{ $t("mine.remove") }}
        </van-button>
      </footer>
    </div>
  </div>
</template>

<script>
import { deleteError, infoError } from '@/api/record'
export default {
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
      errorId: null,
      btnLoading: false,
      activeIcon: require('@/assets/mockAndExam/right.png'),
      inactiveIcon: require('@/assets/mockAndExam/error.png'),
      noactiveIcon: require('@/assets/mockAndExam/no.png')
    }
  },
  created() {
    this.errorId = this.$route.query.id
  },
  mounted() {
    this.getInfo()
  },
  methods: {
    translate(str) {
      return this.$t(str)
    },
    getInfo() {
      infoError({ id: this.errorId }).then(response => {
        const data = response.data
        data.optionList = JSON.parse(data.options)

        const answerRightArray = data.answer.split(',')
        data.optionList.forEach((mitem, index) => {
          // 我选了
          if (data.myAnswer.includes(mitem.key)) {
            // 答案正确
            if (answerRightArray.includes(mitem.key)) {
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

        this.currentExam = response.data
      })
    },
    onClickLeft() {
      this.$router.back(-1)
    },
    remove() {
      this.btnLoading = true
      deleteError({ id: this.currentExam.id }).then(response => {
        this.btnLoading = false
        if (response.data) {
          this.$toast.success(this.$t('mockAndExam.removeErrorSuccess'))
          setTimeout(() => {
            this.onClickLeft()
          }, 2000)
        } else {
          this.$toast.success(this.$t('mockAndExam.removeErrorFail'))
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
    margin-bottom: 20px;
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
  height: 50px;
  position: fixed;
  bottom: 0;
  left: 0;
  width: calc(100% - 80px);
  padding: 0 40px;
}
</style>
<style lang="scss">
.qDetailPage {
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
}
</style>
