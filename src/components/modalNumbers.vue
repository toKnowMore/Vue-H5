<template>
  <div class="modalPage">
    <van-popup
      v-model="show"
      :style="styles"
      :position="position"
      :close-on-click-overlay="false"
      @click-overlay="overlayClick">
      <div class="exam-numbers">
        <div
          v-for="(item, index) in list"
          :key="item.id"
          :class="{
            current: currentIndex == index,
            did: item.select !== '' || item.checkList.length > 0,
            error: !item.isRight,
            right: item.isRight
          }"
          class="numbers-item"
          @click="itemClick(item, index)">
          {{ index + 1 }}
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: 'ModalNumbers',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    styles: {
      type: Object,
      default: () => ({})
    },
    list: {
      type: Array,
      default: () => []
    },
    position: {
      type: String,
      default: ''
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    itemClick(item, index) {
      this.$emit('click', item, index)
    },
    overlayClick() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped lang="scss">
.exam-numbers {
  max-height: 500px;
  overflow-y: auto;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 10px;
  .numbers-item {
    width: 30px;
    height: 30px;
    font-size: 16px;
    font-weight: 500;
    color: #9a9a9a;
    border: 1px solid rgba(204, 204, 204, 1);
    background: white;
    border-radius: 50%;
    text-align: center;
    line-height: 30px;
    margin: 5px;
    &.current {
      background: rgba(78, 140, 238, 1);
      color: #fff;
    }
    &.did {
      background: rgba(37, 127, 255, 0.4);
      color: rgba(37, 127, 255, 1);
    }
    &.error {
      background: rgba(246, 68, 72, 0.4);
      color: rgba(246, 68, 72, 1);
    }
    &.right {
      background: rgba(37, 127, 255, 0.4);
      color: rgba(37, 127, 255, 1);
    }
  }
}
</style>
<style lang="scss">
.modalPage {
  .van-overlay {
    top: 70px;
  }
}
</style>
