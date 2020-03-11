<template>
  <div class="certificationPage">
    <van-nav-bar
      :title="$t('certification.title')"
      left-arrow
      fixed
      @click-left="onClickLeft"/>

    <div class="app-container">
      <van-list
        v-if="list.length > 0"
        v-model="listLoading"
        :finished="finished"
        :finished-text="$t('table.isNoMore')"
        :loading-text="$t('table.loadingText')"
        @load="onLoad">
        <div v-for="(item, index) in list" :key="index" class="list-item">
          <van-cell
            :title="$t('certification.realyName')"
            :value="item.reallyName"
            title-class="title"
            value-class="value"/>
          <van-cell
            :title="$t('certification.phone')"
            :value="item.cellPhone"
            title-class="title"
            value-class="value"/>
          <van-cell
            :title="$t('certification.certificationTime')"
            :value="item.rpDate"
            title-class="title"
            value-class="value"/>
          <van-cell
            :title="$t('certification.platformName')"
            :value="item.platformName"
            title-class="title"
            value-class="value"/>
          <van-cell
            :title="$t('certification.jobName')"
            :value="item.jobName"
            title-class="title"
            value-class="value"/>
          <van-cell
            :title="$t('certification.authEndDate')"
            :value="item.authEndDate"
            title-class="title"
            value-class="value"/>
          <van-cell
            :title="$t('certification.examContent')"
            :value="item.contentName"
            title-class="title"
            value-class="value"/>

          <div v-for="(mitem, index) in item.licenseList" :key="index" class="image">
            <div class="image-list">
              <span class="text">{{ mitem.licenseName }}{{ $t('form.front') }}</span>
              <van-image
                :src="mitem.imgUrl1"
                class="image-class"
                fit="contain"/>
            </div>
            <div v-show="mitem.imgUrl2" class="image-list">
              <span class="text">{{ mitem.licenseName }}{{ $t('form.back') }}</span>
              <van-image
                :src="mitem.imgUrl2"
                class="image-class"
                fit="contain"/>
            </div>
          </div>

          <van-button
            :loading="bntLoading"
            class="large"
            size="large"
            block
            type="info"
            @click.stop="getHse(item)">{{ $t("certification.button") }}</van-button>
        </div>
      </van-list>
      <noData v-else/>
    </div>

    <van-image-preview v-model="showPreImage" :images="images"/>
  </div>
</template>
<script>
import { list, HSELicense } from '@/api/certification'
import noData from '@/components/noData'
export default {
  components: {
    noData
  },
  data() {
    return {
      bntLoading: false,
      listQuery: {
        page: 1,
        limit: 5
      },
      list: [],
      listLoading: false,
      finished: false,
      showPreImage: false,
      images: []
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    onClickLeft() {
      this.$router.back(-1)
    },
    onLoad() {
      this.listQuery.page++
      this.getList()
    },
    getList() {
      list(this.listQuery).then(response => {
        this.list = this.list.concat(response.data.list)
        this.list.forEach(item => {
          item.licenseList = JSON.parse(item.licenseJson)
        })
        this.listLoading = false
        if (response.data.isLastPage) {
          this.finished = true
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    getHse(item) {
      this.images = []
      HSELicense({ id: item.id }).then(response => {
        if (response.data) {
          this.images.push(response.data)
          this.showPreImage = true
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.list-item {
  padding: 29px 10px 10px 10px;
  box-shadow: 0px 0px 7px 0px rgba(119, 119, 119, 0.5);
  border-radius: 23px;
}
.image {
  display: flex;
  flex-direction: row;
  .image-list {
    width: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 10px;
    float: left;
    .text {
      font-size: 16px;
      font-weight: 400;
      color: rgba(68, 68, 68, 1);
    }
    .image-class {
      padding: 10px;
    }
  }
}
</style>
<style lang="scss">
.certificationPage {
  .van-cell {
    .title {
      font-size: 16px;
      color: rgba(68, 68, 68, 1);
    }
    .value {
      font-size: 16px;
      font-weight: 600;
      color: rgba(0, 0, 0, 1);
    }
  }
}
</style>
