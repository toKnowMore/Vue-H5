<template>
  <div>
    <van-nav-bar
      :title="$t('consume.title')"
      left-arrow
      fixed
      @click-left="onClickLeft"/>
    <div class="app-container">
      <div class="list-header">
        <div
          v-for="(item, index) in headerList"
          :key="item.type"
          :class="activeIndex === index ? 'active' : ''"
          class="header-item"
          @click="selectType(index)"
          v-text="item.name"/>
      </div>
      <van-pull-refresh
        v-model="pagePullLoading"
        :loosing-text="$t('table.loosingText')"
        :loading-text="$t('table.loadingText')"
        @refresh="onRefresh">
        <van-checkbox-group
          ref="checkboxGroup"
          v-model="result"
          :class="activeIndex == 1 ? 'showCheckBox' : 'hideCheckBox'">
          <van-list
            v-if="list.length > 0"
            v-model="listLoading"
            :finished="finished"
            :finished-text="$t('table.isNoMore')"
            :loading-text="$t('table.loadingText')"
            @load="onLoad">
            <van-checkbox v-for="(item,index) in list" :key="index" :name="item.id">
              <div class="list-item">
                <div class="top">
                  <div class="title">{{ $t("consume.use") }}：</div>
                  <div class="content">{{ item.purpose }}</div>
                </div>
                <div class="top">
                  <div class="title">{{ $t("consume.amount") }}：</div>
                  <div class="content money">{{ item.price }}</div>
                </div>
                <div class="top">
                  <div class="title">{{ $t("consume.payType") }}：</div>
                  <div class="content">{{ item.payType | payType(translate) }}</div>
                </div>
                <div class="top">
                  <div class="title">{{ $t("consume.payTime") }}：</div>
                  <div class="content">{{ item.successPayTime }}</div>
                </div>
                <div class="top">
                  <div class="title">{{ $t("consume.invoiceStatus") }}：</div>
                  <div class="content yes">{{ item.invStatus | invStatus(translate) }}</div>
                  <div v-show="item.invStatus == 1" class="applyInv" @click.stop="toApplyInvoice">
                    {{ $t("consume.applyInv") }}
                  </div>
                </div>
              </div>
            </van-checkbox>
          </van-list>
          <noData v-else/>
        </van-checkbox-group>
        <div v-show="activeIndex == 1" class="bottom-area">
          <van-checkbox
            v-model="checkAll"
            @change="toggleCheckAll">全选</van-checkbox>
          <van-button
            type="info"
            round
            size="large"
            class="large"
            @click.stop="toApplyInvoice">申请开票</van-button>
        </div>
      </van-pull-refresh>
    </div>
  </div>
</template>
<script>
import { list } from '@/api/consume'
import noData from '@/components/noData'
export default {
  components: {
    noData
  },
  filters: {
    invStatus: function(val, translate) {
      switch (val) {
        case 1:
          return translate('consume.invStatus1')
        case 2:
          return translate('consume.invStatus2')
        case 3:
          return translate('consume.invStatus3')
        default:
          break
      }
    },
    payType: function(val, translate) {
      switch (val) {
        case 1:
          return translate('consume.payType1')
        case 2:
          return translate('consume.payType2')
        case 3:
          return translate('consume.payType3')
        case 4:
          return translate('consume.payType4')
        default:
          break
      }
    }
  },
  data() {
    return {
      pagePullLoading: false,
      activeIndex: 0,
      headerList: [
        { name: '全部', type: 0 },
        { name: '待开票', type: 1 },
        { name: '开票中', type: 2 },
        { name: '已开票', type: 3 }
      ],
      list: [],
      listLoading: false,
      finished: false,
      result: [],
      listQuery: {
        page: 1,
        limit: 5,
        type: 0
      },
      checkAll: false
    }
  },
  created() {},
  mounted() {
    this.getList()
  },
  methods: {
    translate(str) {
      return this.$t(str)
    },
    onClickLeft() {
      this.$router.back(-1)
    },
    onRefresh() {
      this.resetList()
    },
    resetList() {
      this.listQuery.page = 1
      this.list = []
      this.getList()
    },
    selectType(index) {
      this.activeIndex = index
      this.listQuery.type = index
      this.resetList()
    },
    onLoad() {
      this.listQuery.page++
      this.getList()
    },
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
    toApplyInvoice() {
      this.$router.push({
        path: '/invoice', query: { ids: this.result.join(',') }
      })
    },
    toggleCheckAll() {
      if (this.checkAll) {
        this.$refs.checkboxGroup.toggleAll(true)
      } else {
        this.$refs.checkboxGroup.toggleAll()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.list-header {
  display: flex;
  align-items: center;
  justify-content: space-around;
  position: fixed;
  height: 50px;
  top: 49px;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: calc(100% -40px);
  z-index: 10;
  box-shadow: 0px 5px 10px rgba(119, 119, 119, 0.1);
  background-color: #fff;
  .header-item {
    width: 53px;
    height: 30px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 1px 10px 0px rgba(193, 193, 193, 0.5);
    border-radius: 8px;
    font-size: 12px;
    color: rgba(37, 127, 255, 1);
    text-align: center;
    line-height: 30px;
  }
  .active {
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    background: rgba(37, 127, 255, 1);
  }
}

.list-item {
  padding: 15px;
  justify-content: space-between;
  box-shadow: 0px 0px 7px 0px rgba(119, 119, 119, 0.5);
  border-radius: 10px;

  .top {
    display: flex;
    align-items: center;
    height: 40px;
    position: relative;
  }

  .title {
    width: 90px;
    font-size: 14px;
    color: rgba(160, 160, 160, 1);
  }

  .content {
    font-size: 14px;
    color: rgba(68, 68, 68, 1);
    flex: 1;
  }

  .yes {
    color: #257fff;
  }
  .no {
    color: #a0a0a0;
  }
  .money {
    font-size: 16px;
    font-weight: 600;
    color: #f56c4b;
  }

  .applyInv {
    position: absolute;
    right: 50px;
    width: 75px;
    height: 21px;
    background: rgba(37, 127, 255, 1);
    border-radius: 9px;
    font-size: 12px;
    color: rgba(255, 255, 255, 1);
    text-align: center;
    line-height: 21px;
  }
}
.bottom-area {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: calc(100% -40px);
  padding: 5px 20px;
  z-index: 10;
  height: 50px;
  box-shadow: 0px -5px 10px rgba(119, 119, 119, 0.1);
  background-color: #fff;
  .large {
    flex: 1;
    margin-left: 30px;
  }
}
.showCheckBox {
  margin-bottom: 50px;
}
</style>
<style lang="scss">
.van-checkbox-group {
  margin-top: 50px;
}
.van-checkbox {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .van-checkbox__icon {
    margin-right: 10px;
  }
  .van-checkbox__label {
    flex: 1;
    padding: 5px;
    margin-left: 0px;
  }
}
.hideCheckBox {
  .van-checkbox__icon {
    display: none;
  }
}
</style>
