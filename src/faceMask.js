import { FaceMesh } from "@mediapipe/face_mesh"
import {
  FACEMESH_TESSELATION,
  FACEMESH_RIGHT_EYE,
  FACEMESH_RIGHT_EYEBROW,
  FACEMESH_RIGHT_IRIS,
  FACEMESH_LEFT_EYE,
  FACEMESH_LEFT_EYEBROW,
  FACEMESH_LEFT_IRIS,
  FACEMESH_FACE_OVAL,
  FACEMESH_LIPS,
} from "@mediapipe/face_mesh"
import { drawConnectors } from "@mediapipe/drawing_utils"

let height, width
let canvasCtx = undefined

const faceMesh = new FaceMesh({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
  },
})

faceMesh.setOptions({
  selfieMode: true,
  enableFaceGeometry: false,
  maxNumFaces: 1,
  refineLandmarks: false,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
})

faceMesh.onResults((results) => {
  console.log("Start drawing mask=============")
  console.log(results.image)
  console.log(canvasCtx)
  canvasCtx.save()
  canvasCtx.beginPath()

  canvasCtx.clearRect(0, 0, width, height)

  canvasCtx.drawImage(results.image, 0, 0, width, height)
  if (results.multiFaceLandmarks) {
    for (const landmarks of results.multiFaceLandmarks) {
      drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION, {
        color: "#C0C0C070",
        lineWidth: 1,
      })
      drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYE, {
        color: "#FF3030",
      })
      drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYEBROW, {
        color: "#FF3030",
      })
      drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_IRIS, {
        color: "#FF3030",
      })
      drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYE, {
        color: "#30FF30",
      })
      drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYEBROW, {
        color: "#30FF30",
      })
      drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_IRIS, {
        color: "#30FF30",
      })
      drawConnectors(canvasCtx, landmarks, FACEMESH_FACE_OVAL, {
        color: "#E0E0E0",
      })
      drawConnectors(canvasCtx, landmarks, FACEMESH_LIPS, { color: "#E0E0E0" })
    }
  }
  canvasCtx.restore()
})

async function segment(videoElement, canvasElement) {
  if (canvasCtx === undefined) {
    canvasCtx = canvasElement.getContext("2d")
    // setTimeout(async () => {
    //   await faceMesh.send({ image: videoElement })
    // }, 5000)
  } else {
    await faceMesh.send({ image: videoElement })
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

export async function startMask(videoElement, canvasElement) {
  videoElement.addEventListener(
    "playing",
    handlePlaying(videoElement, canvasElement)
  )
  height = canvasElement.offsetHeight
  width = canvasElement.offsetWidth
  videoElement.play()
}

export function changeSizeMask(hei, wid) {
  height = hei
  width = wid
}

export function turnOffSegment(videoElement, canvasElement) {
  // videoElement.removeEventListener(
  //   "playing",
  //   handlePlaying(videoElement, canvasElement)
  // )
}
