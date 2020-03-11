<template>
  <div class="noticePage">
    <van-nav-bar
      :title="$t('notice.title')"
      left-arrow
      fixed
      @click-left="onClickLeft"/>
    <van-pull-refresh
      v-model="pagePullLoading"
      :finished="finished"
      :loosing-text="$t('table.loosingText')"
      :loading-text="$t('table.loadingText')"
      @refresh="onRefresh">
      <div class="app-container">
        <van-list
          v-if="list.length > 0"
          v-model="listLoading"
          :finished="finished"
          :finished-text="$t('table.isNoMore')"
          :loading-text="$t('table.loadingText')"
          @load="onLoad">
          <van-panel v-for="(item,index) in list" :key="index" :title="item.title" :desc="item.updateTime">
            <div class="van-multi-ellipsis--l2" v-html="item.content"/>
          </van-panel>
        </van-list>
        <noData v-else/>
      </div>
    </van-pull-refresh>
  </div>
</template>
<script>
import { list } from '@/api/notice'
import noData from '@/components/noData'
export default {
  components: {
    noData
  },
  data() {
    return {
      listLoading: false,
      pagePullLoading: false,
      finished: false,
      list: [],
      listQuery: {
        page: 1,
        limit: 5
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
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
    onLoad() {
      this.listQuery.page++
      this.getList()
    },
    onRefresh() {
      this.pagePullLoading = false
      this.resetList()
    },
    resetList() {
      this.listQuery.page = 1
      this.list = []
      this.getList()
    },
    onClickLeft() {
      this.$router.back(-1)
    }
  }
}
</script>
<style lang="scss">
.noticePage {
  .van-panel {
    width: 100%;
    box-shadow: 0px 1px 16px 7px rgba(219, 219, 219, 0.5);
    border-radius: 12px;
    margin-bottom: 20px;

    .van-panel__header {
      border-radius: 12px 12px 0 0;
    }

    .van-cell__title {
      font-size: 16px;
      font-weight: 500;
      color: rgba(68, 68, 68, 1);
    }

    .van-cell__label {
      font-size: 10px;
      color: rgba(141, 141, 141, 1);
    }

    .van-panel__content {
      padding: 0 20px 10px;
      font-size: 12px;
      color: rgba(141, 141, 141, 1);
      line-height: 20px;
    }
  }
}
</style>
