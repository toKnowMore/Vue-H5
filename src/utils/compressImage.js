
export async function compressImage(file) {
  // 小于4m的不压缩
  if (file.file.size > 3200000) {
    // 创建Canvas对象(画布)
    const canvas = document.createElement('canvas')
    // 获取对应的CanvasRenderingContext2D对象(画笔)
    const context = canvas.getContext('2d')

    return await loadImg(canvas, context, file)
  } else {
    return file.file
  }
}

const loadImg = (canvas, context, file) => {
  return new Promise((resolve) => {
    // 创建图片
    // 创建新的图片对象
    const img = new Image()

    // 指定图片的DataURL(图片的base64编码数据)
    img.src = file.content

    // 监听浏览器加载图片完成，然后进行进行绘制
    img.onload = () => {
      // 指定canvas画布大小，该大小为最后生成图片的大小
      canvas.width = 400
      canvas.height = 400
      /* drawImage画布绘制的方法。(0,0)表示以Canvas画布左上角为起点，400，300是将图片按给定的像素进行缩小。
        如果不指定缩小的像素图片将以图片原始大小进行绘制，图片像素如果大于画布将会从左上角开始按画布大小部分绘制图片，最后的图片就是张局部图。*/
      context.drawImage(img, 0, 0, 400, 400)
      // 将绘制完成的图片重新转化为base64编码，file.file.type为图片类型，0.92为默认压缩质量
      file.content = canvas.toDataURL(file.file.type, 1)
      // 最后将base64编码的图片保存到数组中，留待上传。
      resolve(dataURLtoFile(file))
    }
  })
}

// 将base64转换为文件
function dataURLtoFile(file) {
  var arr = file.content.split(',')
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], file.file.name, {
    type: file.file.type
  })
}

