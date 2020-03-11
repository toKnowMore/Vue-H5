<template>
  <div class="coursePage">
    <van-nav-bar
      :title="$t('course.title')"
      left-arrow
      fixed
      @click-left="onClickLeft"/>

    <div class="app-container">
      <van-panel :title="courseInfo.title" :desc="courseInfo.createTime">
        <van-tag
          v-show="false"
          type="primary"
          text-color="#257FFF">司机押运员</van-tag>
        <video
          v-if="courseInfo.videoUrl"
          ref="videoPlayer"
          controls="controls"
          preload="auto"
          poster
          muted
          class="video">
          <source :src="courseInfo.videoUrl">
          您的浏览器不支持 video
        </video>
        <div class="content" v-html="courseInfo.content"/>
      </van-panel>
      <van-button
        :loading="bntLoading"
        class="large"
        block
        size="large"
        type="info"
        @click.stop="handleCopy(courseInfo.content, $event)">{{ $t("course.copy") }}</van-button>
    </div>
  </div>
</template>
<script>
import { courseInfo, saveOrModify } from '@/api/course'
// 剪切可以用指令方式，也可以用事件
import clip from '@/utils/clipboard' // use clipboard directly
export default {
  data() {
    return {
      courseId: '',
      bntLoading: false,
      courseInfo: {},
      timer: null,
      // 秒钟
      seconds: 0
    }
  },
  created() {
    this.courseId = this.$route.query.id
  },
  mounted() {
    this.getInfo()
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
    }
    if (this.courseInfo.isFinish === 0) {
      this.addCourseHour()
    }
  },
  methods: {
    onClickLeft() {
      this.$router.back(-1)
    },
    // 请求课程详情,根据学习记录判断是否已经完成，没完成继续学习，增加学习时长，已完成时，终止逻辑
    // 视频课程判断学习进度，自动跳转到相应的进度
    getInfo() {
      courseInfo({ id: this.courseId }).then(response => {
        this.courseInfo = response.data
        this.courseInfo.content = this.courseInfo.content.replace(/\<img/gi, '<img style="max-width:100%;height:auto"')
        if (this.courseInfo.isFinish === 0) {
          this.startLearnTime()
        }
        // 无论是否课时完成，video都要进行此类判断
        this.$nextTick(() => {
          this.judgeVideo()
        })
      })
    },
    async judgeVideo() {
      const video = this.$refs['videoPlayer']
      if (!video) {
        return false
      }
      const courseDuration = this.courseInfo.duration
      const recordDuration = this.courseInfo.memberDuration
      const timeOut = setTimeout(() => {
        const videoDuration = video.duration
        clearTimeout(timeOut)
        if (isNaN(videoDuration)) {
          this.judgeVideo()
        } else {
          if (videoDuration - courseDuration > 1) {
            video.currentTime = recordDuration
          }
          video.play()
        }
      }, 1000)
    },
    // 复制到剪切板
    handleCopy(text, event) {
      clip(text, event)
    },
    startLearnTime() {
      // 计时开始
      this.timer = setInterval(() => {
        this.seconds++
        if (this.seconds >= 60) {
          this.addCourseHour()
          this.seconds = 0
        }
      }, 1000)
    },

    addCourseHour() {
      saveOrModify({ courseId: this.courseId, duration: this.seconds }).then(response => {
        if (response.data) {
          this.$toast.success('课程学习进度更新成功')
        } else {
          this.$toast.fail('课程学习进度更新失败')
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.video {
  width: 100%;
  margin-top: 20px;
}
.van-button {
  position: fixed;
  bottom: 10px;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 294px;
}
.van-panel {
  width: 100%;
  margin-bottom: 20px;
  .van-tag {
    margin: 0 20px 0 0;
    background: rgba(236, 244, 255, 1);
    border-radius: 5px;
  }
  .van-cell {
    padding: 10px 0;
  }
  .van-cell__title {
    font-size: 20px;
    color: rgba(68, 68, 68, 1);
  }
  .van-cell__label {
    margin-top: 7px;
    font-size: 12px;
    color: rgba(141, 141, 141, 1);
  }
  .van-panel__content {
    padding-bottom: 20px;
    font-size: 17px;
    color: rgba(68, 68, 68, 1);
    line-height: 24px;
  }
}
</style>
