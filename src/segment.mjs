import { SelfieSegmentation } from "@mediapipe/selfie_segmentation"

let height, width

const selfieSegmentation = new SelfieSegmentation({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`
  },
})
selfieSegmentation.setOptions({
  modelSelection: 1,
})

export async function segment(videoElement, canvasElement) {
  width = videoElement.width
  height = videoElement.height

  canvasElement.height = height
  canvasElement.width = width
  const canvasCtx = canvasElement.getContext("2d")

  selfieSegmentation.onResults((results) => {
    canvasCtx.save()
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height)
    canvasCtx.drawImage(
      results.segmentationMask,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    )

    // Only overwrite existing pixels.
    canvasCtx.globalCompositeOperation = "source-in"
    canvasCtx.fillStyle = "#00FF00"
    canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height)

    // Only overwrite missing pixels.
    canvasCtx.globalCompositeOperation = "destination-atop"
    canvasCtx.drawImage(
      results.image,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    )

    canvasCtx.restore()
  })

  await selfieSegmentation.send({ image: videoElement })
}
