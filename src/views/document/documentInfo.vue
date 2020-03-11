<template>
  <div class="documentInfoPage">
    <van-nav-bar
      :title="$t('document.title')"
      left-arrow
      fixed
      @click-left="onClickLeft"/>

    <van-pull-refresh
      v-model="pagePullLoading"
      :loosing-text="$t('table.loosingText')"
      :loading-text="$t('table.loadingText')"
      @refresh="onRefresh">
      <div class="app-container">
        <van-panel :title="info.title">
          <div class="footer-class" v-html="info.content"/>
        </van-panel>
      </div>
    </van-pull-refresh>
  </div>
</template>
<script>
import { helpDocumentInfo } from '@/api/document'
export default {
  data() {
    return {
      info: {},
      pagePullLoading: false,
      id: null
    }
  },
  created() {
    this.id = this.$route.query.id
  },
  mounted() {
    this.getInfo()
  },
  methods: {
    onClickLeft() {
      this.$router.back(-1)
    },
    onRefresh() {
      this.getInfo()
    },
    getInfo() {
      helpDocumentInfo({ id: this.id })
        .then(response => {
          this.pagePullLoading = false
          if (response.data) {
            this.info = response.data
          }
        })
        .catch(() => {
          this.pagePullLoading = false
        })
    }
  }
}
</script>
<style lang="scss">
.documentInfoPage {
  .van-cell {
    padding: 0;
  }
  .van-cell:not(:last-child)::after {
    border: none;
  }
  [class*=van-hairline]::after {
    border: none;
  }
  .van-cell__title {
    font-size: 22px;
    font-weight: 600;
    color: rgba(68, 68, 68, 1);
  }
  .footer-class {
    font-size: 18px;
    color: rgba(68, 68, 68, 1);
    line-height: 20px;
  }
}
</style>
