<template>
  <div>
    <van-nav-bar :title="title" left-arrow fixed @click-left="onClickLeft"/>
    <van-pull-refresh
      v-model="pagePullLoading"
      :loosing-text="$t('table.loosingText')"
      :loading-text="$t('table.loadingText')"
      @refresh="onRefresh">
      <div class="app-container">
        <van-list
          v-if="list.length > 0 && type === 'mock'"
          v-model="listLoading"
          :finished="finished"
          :finished-text="$t('table.isNoMore')"
          :loading-text="$t('table.loadingText')"
          @load="onLoad">
          <div v-for="(item,index) in list" :key="index" class="list-item" @click.stop="toDetail(item)">
            <div class="top">
              <div class="jobName">{{ item.jobName }}</div>
              <div class="status pass nopass">{{ item.ispassed | isPass(translate) }}</div>
            </div>
            <div class="top">
              <div class="time">{{ item.submitTime }}</div>
              <div class="score">{{ item.score }}</div>
            </div>
          </div>
        </van-list>
        <van-list
          v-else-if="list.length > 0 && type === 'exam'"
          v-model="listLoading"
          :finished="finished"
          :finished-text="$t('table.isNoMore')"
          :loading-text="$t('table.loadingText')"
          @load="onLoad">
          <div v-for="(item,index) in list" :key="index" class="list-item" @click.stop="toDetail(item)">
            <div class="top">
              <div class="jobName">{{ item.authType }}</div>
              <div class="status pass nopass">{{ item.isPassed | isPass(translate) }}</div>
            </div>
            <div class="top">
              <div class="time">{{ item.createDate }}</div>
              <div class="score">{{ item.examScore }}</div>
            </div>
          </div>
        </van-list>
        <noData v-else/>
      </div>

    </van-pull-refresh>
  </div>
</template>
<script>
import { trainResultList, examResultList } from '@/api/record'
import noData from '@/components/noData'
export default {
  components: {
    noData
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
      title: '',
      // type==exam, 考试, type=mock模拟
      type: '',
      pagePullLoading: false,
      listLoading: false,
      finished: false,
      list: [],
      listQuery: {
        page: 1,
        limit: 5
      }
    }
  },
  created() {
    this.type = this.$route.query.type
    if (this.type === 'mock') {
      this.title = this.$t('mockAndExam.mockTitle')
    } else if (this.type === 'exam') {
      this.title = this.$t('mockAndExam.examTitle')
    }
  },
  mounted() {
    // 获取参数根据参数判断是考试结果还是模拟结果
    if (this.type === 'mock') {
      this.getMock()
    } else {
      this.getList()
    }
  },
  methods: {
    translate(str) {
      return this.$t(str)
    },
    onLoad() {
      this.listQuery.page++
      if (this.type === 'mock') {
        this.getMock()
      } else {
        this.getList()
      }
    },
    getMock() {
      trainResultList(this.listQuery).then(response => {
        this.list = this.list.concat(response.data.list)
        this.listLoading = false
        this.pagePullLoading = false
        if (response.data.isLastPage) {
          this.finished = true
        }
      }).catch(() => {
        this.listLoading = false
        this.pagePullLoading = false
      })
    },
    getList() {
      examResultList(this.listQuery).then(response => {
        this.list = this.list.concat(response.data.list)
        this.listLoading = false
        this.pagePullLoading = false
        if (response.data.isLastPage) {
          this.finished = true
        }
      }).catch(() => {
        this.listLoading = false
        this.pagePullLoading = false
      })
    },

    onClickLeft() {
      this.$router.back(-1)
    },
    onRefresh() {
      this.pagePullLoading = false
      this.resetList()
    },
    resetList() {
      this.listQuery.page = 1
      this.list = []
      if (this.type === 'mock') {
        this.getMock()
      } else {
        this.getList()
      }
    },
    toDetail(item) {
      this.$router.push({ path: '/quesDetail', query: { type: this.type, id: item.id }})
    }
  }
}
</script>
<style lang="scss" scoped>
.list-item {
  padding: 15px 20px;
  width: calc(100% - 40px);
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 7px 0px rgba(183, 183, 183, 0.5);
  border-radius: 17px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 20px;
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .top + .top {
    margin-top: 10px;
  }
  .jobName {
    font-size: 15px;
    color: #000000;
  }
  .status {
    font-size: 22px;
    font-weight: 500;
  }
  .pass {
    color: rgba(37, 127, 255, 1);
  }
  .nopass {
    color: rgba(160, 160, 160, 1);
  }
  .time {
    font-size: 12px;
    color: rgba(84, 84, 84, 1);
  }

  .score {
    font-size: 12px;
    font-weight: 600;
    color: rgba(245, 108, 75, 1);
  }
}
</style>
