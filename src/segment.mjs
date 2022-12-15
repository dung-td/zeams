import { SelfieSegmentation } from "@mediapipe/selfie_segmentation"

let height, width
let canvasCtx = undefined
let backgroundImg = undefined
let effectOption = ""

const selfieSegmentation = new SelfieSegmentation({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`
  },
})

selfieSegmentation.setOptions({
  modelSelection: 1,
})

selfieSegmentation.onResults((results) => {
  // console.log("Drawing on size: " + height + "/" + width)
  // console.log(results.image)
  // console.log(results.segmentationMask)
  canvasCtx.save()
  canvasCtx.beginPath()

  canvasCtx.clearRect(0, 0, width, height)

  canvasCtx.filter = "none"
  canvasCtx.globalCompositeOperation = "source-over"
  canvasCtx.drawImage(results.segmentationMask, 0, 0, width, height)

  canvasCtx.globalCompositeOperation = "source-in"
  canvasCtx.drawImage(results.image, 0, 0, width, height)

  switch (effectOption) {
    case "background":
      const background = document.getElementById(backgroundImg)
      canvasCtx.filter = "none"
      canvasCtx.globalCompositeOperation = "destination-over"
      canvasCtx.drawImage(background, 0, 0, width, height)
      break
    case "blur":
      canvasCtx.filter = "blur(10px)"
      canvasCtx.globalCompositeOperation = "destination-over"
      canvasCtx.drawImage(results.image, 0, 0, width, height)
      break
    default:
      canvasCtx.globalCompositeOperation = "destination-over"
      canvasCtx.drawImage(results.image, 0, 0, width, height)
      break
  }
  canvasCtx.restore()
})

async function segment(videoElement, canvasElement) {
  // console.log("Run segment")
  // console.log("Size: " + height + "-" + width)

  if (canvasCtx === undefined) {
    canvasCtx = canvasElement.getContext("2d")
  } else {
    await selfieSegmentation.send({ image: videoElement })
  }
}

const handlePlaying = async (videoElement, canvasElement) => {
  let lastTime = new Date()

  async function getFrames() {
    const now = videoElement.currentTime
    if (now > lastTime) {
      const fps = (1 / (now - lastTime)).toFixed()
      await segment(videoElement, canvasElement)
    }
    lastTime = now
    requestAnimationFrame(getFrames)
  }

  await getFrames()
}

export async function start(videoElement, canvasElement, option) {
  effectOption = option
  videoElement.addEventListener(
    "playing",
    handlePlaying(videoElement, canvasElement)
  )
  height = canvasElement.offsetHeight
  width = canvasElement.offsetWidth
  videoElement.play()
}

export function changeSize(hei, wid) {
  height = hei
  width = wid
}

export function setBackground(backgroundImageId) {
  backgroundImg = backgroundImageId
}
