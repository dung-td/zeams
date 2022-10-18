import { useRef } from "react"
import "./App.css"

function App() {
  const video = useRef()
  var constraints = {
    audio: true,
    video: {
      mandatory: {
        width: { min: 320 },
        height: { min: 180 },
      },
    },
  }

  navigator.getUserMedia(constraints, gotStream, logError)

  function gotStream(stream) {
    video.current = stream
    video.current.play()
  }

  function logError(error) {
    console.log(error)
  }

  return (
    <div className="App">
      <p>Hello</p>

      <video ref={video} autoPlay></video>
    </div>
  )
}

export default App
