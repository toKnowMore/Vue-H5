<template>
  <div>
    <van-pull-refresh
      v-model="pagePullLoading"
      :loosing-text="$t('table.loosingText')"
      :loading-text="$t('table.loadingText')"
      @refresh="onRefresh">
      <div class="home-container">
        <div class="head">
          <div class="head-item" @click.stop="toMock">
            <img src="@/assets/home/mock-icon.png" alt="">
            <div>{{ $t("home.mock") }}</div>
          </div>
          <div class="head-item" @click.stop="toErrorBook">
            <img src="@/assets/home/errorBook-icon.png" alt="">
            <div>{{ $t("home.errorBook") }}</div>
          </div>
        </div>
        <div class="title">
          <div class="kuai"/>
          <div class="text">{{ $t("home.learnOnline") }}</div>
        </div>

        <div class="course-head">
          <van-dropdown-menu>
            <van-dropdown-item
              v-model="listQuery.jobId"
              :options="jobList"
              @change="jobChange"/>
            <van-dropdown-item
              v-model="listQuery.categoryId"
              :options="categoryList"
              @change="categoryChange"/>
          </van-dropdown-menu>
        </div>
        <van-list
          v-if="list.length > 0"
          v-model="listLoading"
          :finished="finished"
          :finished-text="$t('table.isNoMore')"
          :loading-text="$t('table.loadingText')"
          class="course-list"
          @load="onLoad">
          <div v-for="(item, index) in list" :key="index" class="course-item" @click.stop="toCourseDetail(item)">
            <img :src="item.cover" class="course-cover">
            <div class="course-item-right">
              <div class="course-name van-multi-ellipsis--l2">
                {{ item.title }}
              </div>
              <div class="course-right-bottom">
                <div class="course-hour">
                  {{ $t("home.learnHour") }}：{{ item.totalDuration | totalDuration
                  }}{{ $t("home.minutes") }}
                </div>
                <div class="process">
                  <van-progress
                    :percentage="item.plannedSpeed"
                    stroke-width="4"/>
                </div>
              </div>
            </div>
          </div>
        </van-list>
        <noData v-else/>
      </div>
    </van-pull-refresh>
  </div>
</template>
<script>
import { list } from '@/api/course'
import { beforeMock } from '@/api/mock'
import { categoryAll, jobAll } from '@/api/public'
import noData from '@/components/noData'
export default {
  components: {
    noData
  },
  filters: {
    totalDuration: function(val) {
      return (val / 60).toFixed(2)
    }
  },
  data() {
    return {
      pagePullLoading: false,
      categoryList: [{ text: '全部试题类别', value: null }],
      jobList: [{ text: '全部培训角色', value: null }],
      list: [],
      listLoading: false,
      finished: false,
      listQuery: {
        page: 1,
        limit: 5,
        categoryId: null,
        jobId: null
      },
      loadIng: true
    }
  },
  created() {
    this.listQuery.jobId = this.$store.getters.jobId
    this.listQuery.categoryId = this.$store.getters.categoryId
  },
  mounted() {
    this.getJob()
    this.getCategory()
    this.getList()
  },
  methods: {
    toMock() {
      beforeMock().then(response => {
        if (response.data) {
          this.$router.replace('/mockIng')
        }
      })
    },
    toErrorBook() {
      this.$router.push('/document?to=errorBook')
    },
    getCategory() {
      if (!this.listQuery.jobId) {
        return false
      }
      categoryAll({ jobId: this.listQuery.jobId }).then(response => {
        response.data.forEach(item => {
          item.text = item.categoryName
          item.value = item.id
        })
        response.data.unshift({ text: '全部试题类别', value: null })
        this.categoryList = response.data
      })
    },
    getJob() {
      jobAll().then(response => {
        response.data.forEach(item => {
          item.text = item.jobName
          item.value = item.id
        })
        response.data.unshift({ text: '全部培训角色', value: null })
        this.jobList = response.data
      })
    },
    onRefresh() {
      this.listQuery.categoryId = null
      this.listQuery.jobId = null
      this.resetList()
      this.getJob()
      this.getCategory()
    },
    onLoad() {
      this.listQuery.page++
      this.getList()
    },
    jobChange() {
      this.resetList()
      this.$set(this.listQuery, 'categoryId', null)
      this.getCategory()
    },
    categoryChange() {
      this.resetList()
    },
    resetList() {
      this.listQuery.page = 1
      this.list = []
      this.getList()
    },
    getList() {
      // 根据反馈
      this.listLoading = true
      list(this.listQuery).then(response => {
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
    toCourseDetail(item) {
      this.$router.push({ path: '/courseDetail', query: { id: item.id }})
    }
  }
}
</script>
<style lang="scss" scoped>
.home-container {
  padding: 25px 0;
  .head {
    padding: 0 21px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .head-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    width: 158px;
    height: 158px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 7px 0px rgba(183, 183, 183, 0.5);
    border-radius: 23px;
    img {
      width: 94px;
      height: 75px;
      display: block;
    }
    div {
      text-align: center;
      font-size: 18px;
      color: rgba(68, 68, 68, 1);
    }
  }
  .head-item+.head-item {
    margin-left: 17px;
  }

  .title {
    height: 55px;
    display: flex;
    align-items: center;
    padding: 0 21px;
    margin-top: 10px;
    .kuai {
      width: 10px;
      height: 20px;
      background: rgba(37, 126, 255, 1);
      margin-right: 5px;
    }
    .text {
      font-size: 20px;
      font-weight: 500;
      color: rgba(68, 68, 68, 1);
    }
  }

  .course-head {
    width: 375px;
    height: 55px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 5px 6px 0px rgba(208, 208, 208, 0.5);
  }
  .course-list {
    padding: 20px 20px 0 20px;
    .course-item {
      border-bottom: 1px solid #ebedf0;
      display: flex;
      margin-bottom: 15px;
    }
    .course-cover {
      width: 139px;
      height: 100px;
      display: block;
      margin-right: 20px;
    }
    .course-item-right {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding-bottom: 10px;
    }
    .course-right-bottom {
      display: flex;
      flex-direction: column;
    }
    .course-name {
      width: 100%;
      font-size: 16px;
      color: rgba(68, 68, 68, 1);
    }
    .course-hour {
      font-size: 12px;
      color: rgba(154, 154, 154, 1);
      line-height: 30px;
    }
    .process {
      display: flex;
      flex-direction: column;
      .process-text {
        font-size: 10px;
        line-height: 28px;
        color: rgba(154, 154, 154, 1);
      }
    }
  }
}
</style>
