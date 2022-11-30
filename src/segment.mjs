import { SelfieSegmentation } from "@mediapipe/selfie_segmentation"
import background from "./img/background.jpg"

let height, width
let canvasCtx = undefined
let backgroundImage = undefined
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
  console.log(effectOption)
  const background = document.getElementById("backgroundImage")
  canvasCtx.save()
  canvasCtx.beginPath()

  canvasCtx.clearRect(0, 0, width, height)

  canvasCtx.filter = "none"
  canvasCtx.globalCompositeOperation = "source-over"
  canvasCtx.drawImage(results.segmentationMask, 0, 0, width, height)

  canvasCtx.globalCompositeOperation = "source-in"
  canvasCtx.drawImage(results.image, 0, 0, width, height)

  // Blur
  switch (effectOption) {
    case "background":
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
  console.log("Done re-draw")

  // Handle after draw
})

async function segment(videoElement, canvasElement) {
  console.log("Run segment")
  console.log(
    "Size: " + videoElement.offsetHeight + "/" + videoElement.offsetWidth
  )

  // canvasElement.height = videoElement.offsetHeight
  // canvasElement.width = videoElement.offsetWidth

  if (canvasCtx == undefined) {
    canvasCtx = canvasElement.getContext("2d")
    height = canvasElement.offsetHeight
    width = canvasElement.offsetWidth
  } else {
    await selfieSegmentation.send({ image: videoElement })
  }
}

const handlePlaying = async (videoElement, canvasElement) => {
  // canvasElement.height = videoElement.offsetHeight
  // canvasElement.width = videoElement.offsetWidth

  let lastTime = new Date()

  async function getFrames() {
    console.log(lastTime)

    const now = videoElement.currentTime
    if (now > lastTime) {
      const fps = (1 / (now - lastTime)).toFixed()
      await segment(videoElement, canvasElement)
    }
    lastTime = now
    requestAnimationFrame(getFrames)

    // setTimeout(() => {
    // }, 5000)
  }

  await getFrames()
}

export async function start(videoElement, canvasElement, option) {
  console.log(option)
  effectOption = option
  videoElement.addEventListener(
    "playing",
    handlePlaying(videoElement, canvasElement)
  )

  videoElement.play()
}

export function changeSize(hei, wid) {
  height = hei
  width = wid
}
