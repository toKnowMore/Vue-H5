<template>
  <div>
    <van-pull-refresh
      v-model="pagePullLoading"
      :loosing-text="$t('table.loosingText')"
      :loading-text="$t('table.loadingText')"
      @refresh="onRefresh">
      <div class="mine-container">
        <div class="header">
          <img src="@/assets/public/default-avatar.jpg" class="avatar">
          <div class="head-center">
            <div class="name" v-text="reallyName"/>
            <div class="text" v-text="username"/>
            <div class="text" v-text="jobName"/>
          </div>
          <img src="@/assets/mine/mine-edit.png" class="edit" @click="toUpdatePhone">
        </div>

        <div class="info-area">
          <van-cell
            v-for="(item, index) in list"
            :key="index"
            :title="item.name"
            :to="item.path"
            :icon="item.icon"
            title-class="title"
            is-link/>
        </div>

        <van-button
          :loading="btnLoading"
          class="large"
          block
          type="info"
          size="large"
          @click="exit">{{ $t("mine.exit") }}</van-button>
      </div>
    </van-pull-refresh>
  </div>
</template>
<script>
export default {
  data() {
    return {
      pagePullLoading: false,
      list: [
        {
          icon: require('@/assets/mine/exam-record.png'),
          name: this.$t('mine.examRecord'),
          path: '/examRecords?type=exam'
        },
        {
          icon: require('@/assets/mine/mock-record.png'),
          name: this.$t('mine.mockRecord'),
          path: '/examRecords?type=mock'
        },
        {
          icon: require('@/assets/mine/xinyong.png'),
          name: this.$t('mine.xinyong'),
          path: '/creditEnquiry'
        },
        {
          icon: require('@/assets/mine/xiaofei.png'),
          name: this.$t('mine.xiaofei'),
          path: '/consume'
        },
        {
          icon: require('@/assets/mine/renzheng.png'),
          name: this.$t('mine.renzheng'),
          path: '/certification'
        },
        {
          icon: require('@/assets/mine/buqian.png'),
          name: this.$t('mine.buqian'),
          path: '/supplement?type=buqian'
        },
        {
          icon: require('@/assets/mine/gonggao.png'),
          name: this.$t('mine.gonggao'),
          path: '/notice'
        },
        {
          icon: require('@/assets/mine/help.png'),
          name: this.$t('mine.help'),
          path: '/document?to=help'
        }
        // {
        //   icon: require('@/assets/mine/fankui.png'),
        //   name: this.$t('mine.fankui'),
        //   path: '/feedback'
        // }
      ],
      btnLoading: false
    }
  },
  computed: {
    reallyName() {
      return this.$store.getters.reallyName
    },
    username() {
      return this.$store.getters.username
    },
    jobName() {
      return this.$store.getters.jobName
    }
  },
  mounted() {
    this.$store.dispatch('GetUserInfo').then(reponse => {})
  },
  methods: {
    onRefresh() {
      this.$store.dispatch('GetUserInfo').then(reponse => {
        this.pagePullLoading = false
      }).catch(() => {
        this.pagePullLoading = false
      })
    },
    exit() {
      this.btnLoading = true
      this.$store.dispatch('LogOut').then(() => {
        this.btnLoading = false
        this.$router.replace({ path: '/login' })
      }).catch(() => {
        this.btnLoading = false
        this.$store.dispatch('FedLogOut').then(() => {
          this.$router.replace({ path: '/login' })
        })
      })
    },
    toUpdatePhone() {
      this.$router.push({ path: '/updatePhone' })
    }
  }
}
</script>
<style lang="scss" scoped>
.mine-container {
  padding: 20px;
  overflow-y: auto;
  height: calc(100vh - 90px);
  .header {
    padding: 25px 17px;
    display: flex;
    align-items: center;
    box-shadow: 0px 0px 7px 0px rgba(183, 183, 183, 0.5);
    border-radius: 17px;
    .avatar {
      border-radius: 100%;
      width: 85px;
      height: 85px;
    }
    .head-center {
      margin: 0 13px;
      color: rgba(68, 68, 68, 1);
      font-size: 16px;
      font-weight: 500;
      .name {
        font-size: 18px;
      }
    }
    .edit {
      width: 14px;
      height: 14px;
    }
  }
  .info-area {
    box-shadow: 0px 0px 7px 0px rgba(183, 183, 183, 0.5);
    border-radius: 14px;
    margin: 20px 0;
    padding: 5px;
    .van-cell {
      height: 45px;
      display: flex;
      align-items: center;
    }
    .van-icon__image {
      width: 23px;
      height: 23px;
    }
    .title {
      font-size: 16px;
      color: rgba(68, 68, 68, 1);
      margin-left: 13px;
      text-align: left;
    }
  }
}
</style>
