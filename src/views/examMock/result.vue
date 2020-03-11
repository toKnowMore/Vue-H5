<template>
  <div>
    <van-nav-bar
      :title="title"
      :left-arrow="type === 'mock'"
      fixed
      @click-left="onClickLeft"/>
    <div class="app-container result-container">
      <img v-if="isPass == '是'" src="@/assets/mockAndExam/exam-pass.png">
      <img v-else src="@/assets/mockAndExam/exam-nopass.png">
      <div class="score-area">
        <span class="score" v-text="score"/>
        <span>{{ $t("mockAndExam.score") }}</span>
      </div>
      <van-form validate-first>
        <van-button
          v-show="type === 'exam'"
          type="info"
          size="large"
          class="normal"
          @click="toAuth">{{ $t("mockAndExam.auth") }}</van-button>
      </van-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      title: '',
      type: '',
      examInfo: {},
      score: null,
      id: ''
    }
  },
  created() {
    this.type = this.$route.query.type
    this.score = this.$route.query.score
    this.isPass = this.$route.query.isPass
    this.id = this.$route.query.id
    if (this.type === 'mock') {
      this.title = this.$t('mockAndExam.mockRes')
    } else if (this.type === 'exam') {
      this.title = this.$t('mockAndExam.examRes')
    }
  },
  mounted() {
    // 获取参数根据参数判断是考试结果还是模拟结果
  },
  methods: {
    onClickLeft() {
      this.$router.replace({ path: '/' })
    },
    toAuth() {
      this.$router.replace({ path: '/supplement', query: { type: 'exam', id: this.id }})
    }
  }
}
</script>
<style lang="scss" scoped>
.result-container {
  justify-content: space-around;
}

img {
  width: 232px;
  display: block;
  margin: 20px auto;
}

.score-area {
  font-size: 26px;
  color: #444444;
  text-align: center;
  .score {
    font-size: 45px;
  }
}
</style>
