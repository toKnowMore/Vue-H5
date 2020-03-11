<template>
  <div class="sign-canvas">
    <van-overlay :show="show" @click="show = false">
      <div class="wrapper" @click.stop>
        <div ref="canvasHw" class="overlay-content">
          <div class="overlay-title">请签名</div>
          <canvas
            id="canvas"
            ref="canvas"
            canvas-id="signCanvas"
            @touchstart="touchStart"
            @touchmove="touchMove"
            @touchend="touchEnd"
            @mousedown="mouseDown"
            @mousemove="mouseMove"
            @mouseup="mouseUp"/>
          <div class="contents-buttons">
            <div class="contents-button" @click="cancleSign">取消</div>
            <div class="contents-button" @click="clearCanvas">清除</div>
            <div class="contents-button" @click="saveCanvas">确定</div>
          </div>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
export default {
  name: 'SignCanvas',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      stageInfo: {},
      client: {},
      points: [],
      canvasTxt: null,
      startX: 0,
      startY: 0,
      moveY: 0,
      moveX: 0,
      endY: 0,
      endX: 0,
      isDown: false
    }
  },
  mounted() {
    this.initCanvas()
  },
  methods: {
    initCanvas() {
      const canvas = this.$refs.canvas// 指定canvas
      canvas.width = window.screen.availWidth
      canvas.width = 400
      canvas.height = (canvas.width * 16) / 9
      this.canvasTxt = canvas.getContext('2d')// 设置2D渲染区域
      this.canvasTxt.lineWidth = 3 // 设置线的宽度
      this.canvasTxt.lineCap = 'round'
      this.canvasTxt.lineJoin = 'round'
      this.stageInfo = canvas.getBoundingClientRect()
    },
    // mobile
    touchStart(ev) {
      ev = ev || event
      ev.preventDefault()
      if (ev.touches.length === 1) {
        const obj = {
          x: ev.touches[0].clienX,
          y: ev.touches[0].clientY
        }
        this.startX = obj.x
        this.startY = obj.y
        this.canvasTxt.beginPath()
        this.canvasTxt.moveTo(this.startX, this.startY)
        this.canvasTxt.lineTo(obj.x, obj.y)
        this.canvasTxt.stroke()
        this.canvasTxt.closePath()
        this.points.push(obj)
      }
    },
    touchMove(ev) {
      ev = ev || event
      ev.preventDefault()
      if (ev.touches.length === 1) {
        const obj = {
          x: ev.touches[0].clientX - this.stageInfo.left,
          y: ev.touches[0].clientY - this.stageInfo.top
        }
        this.moveY = obj.y
        this.moveX = obj.x
        this.canvasTxt.beginPath()
        this.canvasTxt.moveTo(this.startX, this.startY)
        this.canvasTxt.lineTo(obj.x, obj.y)
        this.canvasTxt.stroke()
        this.canvasTxt.closePath()
        this.startY = obj.y
        this.startX = obj.x
        this.points.push(obj)
      }
    },
    touchEnd(ev) {
      ev = ev || event
      ev.preventDefault()
      if (ev.touches.length === 1) {
        const obj = {
          x: ev.touches[0].clientX - this.stageInfo.left,
          y: ev.touches[0].clientY - this.stageInfo.top
        }
        this.canvasTxt.beginPath()
        this.canvasTxt.moveTo(this.startX, this.startY)
        this.canvasTxt.lineTo(obj.x, obj.y)
        this.canvasTxt.stroke()
        this.canvasTxt.closePath()
        this.points.push(obj)
      }
    },
    // pc
    mouseDown(ev) {
      ev = ev || event
      ev.preventDefault()
      if (ev.touches.length === 1) {
        const obj = {
          x: ev.offsetX,
          y: ev.offsetY
        }
        this.startX = obj.x
        this.startY = obj.y
        this.canvasTxt.beginPath()
        this.canvasTxt.moveTo(this.startX, this.startY)
        this.canvasTxt.lineTo(obj.x, obj.y)
        this.canvasTxt.stroke()

        // this.canvasTxt.strokeRect(20,20,80,100);
        this.canvasTxt.closePath()
        this.points.push(obj)
        this.isDown = true
      }
    },
    mouseMove(ev) {
      ev = ev || event
      ev.preventDefault()
      if (this.isDown) {
        const obj = {
          x: ev.offsetX,
          y: ev.offsetY
        }
        this.moveY = obj.y
        this.moveX = obj.x
        this.canvasTxt.beginPath()
        this.canvasTxt.moveTo(this.startX, this.startY)
        this.canvasTxt.lineTo(obj.x, obj.y)
        this.canvasTxt.stroke()
        this.canvasTxt.closePath()
        this.startY = obj.y
        this.startX = obj.x
        this.points.push(obj)
      }
    },
    mouseUp(ev) {
      ev = ev || event
      ev.preventDefault()
      if (ev.touches.length === 1) {
        const obj = {
          x: ev.offsetX,
          y: ev.offsetY
        }
        this.canvasTxt.beginPath()
        this.canvasTxt.moveTo(this.startX, this.startY)
        this.canvasTxt.lineTo(obj.x, obj.y)
        this.canvasTxt.stroke()
        this.canvasTxt.closePath()
        this.points.push(obj)
        this.points.push({ x: -1, y: -1 })
        this.isDown = false
      }
    },
    cancleSign() {
      this.clearCanvas()
      this.$emit('cancle')
    },
    // 重写
    clearCanvas() {
      this.canvasTxt.clearRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height)
      this.points = []
      this.$emit('clear')
    },
    // 确定签名
    async saveCanvas() {
      const file = {}
      file.type = 'image/png'
      file.name = 'sign.png'
      file.content = this.$refs.canvas.toDataURL()
      const imgFile = await this.dataURLToBlob(file)
      this.$emit('save', imgFile)
    },
    dataURLToBlob(file) {
      var arr = file.content.split(',')
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], file.name, {
        type: file.type
      })
    }
  }
}
</script>

<style scoped lang="scss">
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 0 20px;
}

.overlay-content {
  border: 1px solid #ededed;
  background-color: white;
  border-radius: 20px;
  width: 100%;
  canvas {
    width: 100%;
    height: 200px;
  }
  .overlay-title {
    text-align: center;
    font-size: 16px;
    padding: 10px 0;
    font-weight: bold;
    border-bottom: 1px solid #ededed;
  }
  .contents-buttons {
    display: flex;
    justify-content: space-between;
    padding: 5px 0;
    border-top: 1px solid #ededed;
    .contents-button {
      padding: 10px 0;
      text-align: center;
      flex: 1;
      font-size: 15px;
      color: rgba(37, 127, 255, 1);
    }
  }
}
</style>
