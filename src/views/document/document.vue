<template>
  <div class="documentPage">
    <van-nav-bar :title="title" left-arrow fixed @click-left="onClickLeft"/>

    <van-pull-refresh
      v-model="pagePullLoading"
      :loosing-text="$t('table.loosingText')"
      :loading-text="$t('table.loadingText')"
      @refresh="onRefresh">
      <div class="app-container">
        <van-cell-group v-if="list.length > 0 && type === 'errorBook'">
          <van-list
            v-model="listLoading"
            :finished="finished"
            :finished-text="$t('table.isNoMore')"
            :loading-text="$t('table.loadingText')"
            @load="onLoad">
            <van-cell
              v-for="(item, index) in list"
              :key="index"
              :title="item.title"
              is-link
              class="list-item"
              @click.stop="toErrorDetail(item)"/>
          </van-list>
        </van-cell-group>
        <van-cell-group v-else-if="list.length > 0 && type === 'help'">
          <van-cell
            v-for="(item, index) in list"
            :key="index"
            :title="item.title"
            is-link
            class="list-item"
            @click.stop="toDocument(item)"/>
        </van-cell-group>
        <noData v-else/>
      </div>
    </van-pull-refresh>
  </div>
</template>
<script>
import { documentList, errorList } from '@/api/document'
import noData from '@/components/noData'
export default {
  components: {
    noData
  },
  data() {
    return {
      pagePullLoading: false,
      list: [],
      title: '',
      type: '',
      listLoading: false,
      finished: false,
      listQuery: {
        page: 1,
        limit: 5
      }
    }
  },
  created() {
    this.type = this.$route.query.to
    if (this.type === 'help') {
      this.title = this.$t('document.title')
    } else if (this.type === 'errorBook') {
      this.title = this.$t('home.errorBook')
    }
  },
  mounted() {
    if (this.type === 'help') {
      this.getDocument()
    } else {
      this.getList()
    }
  },
  methods: {
    onClickLeft() {
      this.$router.back(-1)
    },
    onRefresh() {
      this.resetList()
    },
    resetList() {
      this.listQuery.page = 1
      this.list = []
      if (this.type === 'help') {
        this.getDocument()
      } else {
        this.getList()
      }
    },
    onLoad() {
      this.listQuery.page++
      if (this.type === 'help') {
        this.getDocument()
      } else {
        this.getList()
      }
    },
    getList() {
      this.listLoading = true
      errorList(this.listQuery).then(response => {
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
    getDocument() {
      documentList().then(response => {
        this.list = response.data
        this.pagePullLoading = false
      }).catch(() => {
        this.pagePullLoading = false
      })
    },
    toErrorDetail(item) {
      this.$router.push({ path: '/errorBookDetail', query: { id: item.id }})
    },
    toDocument(item) {
      this.$router.push({ path: '/documentInfo', query: { id: item.id }})
    }
  }
}
</script>
<style lang="scss" scoped>
.list-item {
  border-radius: 21px;
  margin: 10px auto;
}
.van-cell-group {
  padding: 0 5px;
  .van-cell {
    font-size: 16px;
    color: rgba(68, 68, 68, 1);
    box-shadow: 0px 0px 7px 0px rgba(119, 119, 119, 0.5);
    border-radius: 21px;
  }
}
</style>
