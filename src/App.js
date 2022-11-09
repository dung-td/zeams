import { useRef, useState } from "react"
import "./App.css"

function App() {
  const remoteStreamRef = useRef()
  const localStreamRef = useRef()
  let localStream
  let pc

  var constraints = {
    audio: true,
    video: {
      mandatory: {
        width: { min: 320 },
        height: { min: 50 },
      },
      optional: [
        { width: { max: 300 } },
        { height: { max: 100 } },
        { frameRate: 30 },
        { facingMode: "user" },
      ],
    },
  }

  const signaling = new BroadcastChannel("webrtc")

  signaling.onmessage = (e) => {
    if (!localStream) {
      console.log("not ready yet")
      return
    }
    switch (e.data.type) {
      case "offer":
        handleOffer(e.data)
        break
      case "answer":
        handleAnswer(e.data)
        break
      case "candidate":
        handleCandidate(e.data)
        break
      case "ready":
        // A second tab joined. This tab will initiate a call unless in a call already.
        if (pc) {
          console.log("already in call, ignoring")
          return
        }
        makeCall()
        break
      case "bye":
        if (pc) {
          hangup()
        }
        break
      default:
        console.log("unhandled", e)
        break
    }
  }

  function makeid() {
    var result = ""
    var characters = "abcdefghijklmnopqrstuvwxyz"
    var charactersLength = characters.length
    for (var i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
  }

  console.log(makeid())

  const start = async () => {
    console.log("Requesting local stream")
    localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    })

    if (localStreamRef.current) {
      localStreamRef.current.srcObject = localStream
    }

    console.log("Received local stream")

    signaling.postMessage({ type: "ready" })
  }

  async function hangup() {
    if (pc) {
      pc.close()
      pc = null
    }
    localStream.current.getTracks().forEach((track) => track.stop())
    localStream = null
  }

  function createPeerConnection() {
    pc = new RTCPeerConnection()
    console.log("Create peerconnection")
    pc.onicecandidate = (e) => {
      const message = {
        type: "candidate",
        candidate: null,
      }
      if (e.candidate) {
        message.candidate = e.candidate.candidate
        message.sdpMid = e.candidate.sdpMid
        message.sdpMLineIndex = e.candidate.sdpMLineIndex
      }
      signaling.postMessage(message)
    }
    pc.ontrack = (e) => (remoteStreamRef.current.srcObject = e.streams[0])
    localStream.getTracks().forEach((track) => pc.addTrack(track, localStream))
  }

  async function makeCall() {
    await createPeerConnection()

    const offer = await pc.createOffer()
    signaling.postMessage({ type: "offer", sdp: offer.sdp })
    await pc.setLocalDescription(offer)
  }

  async function handleOffer(offer) {
    if (pc) {
      console.error("existing peerconnection")
      return
    }
    await createPeerConnection()
    await pc.setRemoteDescription(offer)

  function gotStream(stream) {
    video.current = stream
  }

  async function handleAnswer(answer) {
    if (!pc) {
      console.error("no peerconnection")
      return
    }
    await pc.setRemoteDescription(answer)
  }

  async function handleCandidate(candidate) {
    if (!pc) {
      console.error("no peerconnection")
      return
    }
    if (!candidate.candidate) {
      await pc.addIceCandidate(null)
    } else {
      await pc.addIceCandidate(candidate)
    }
  }

  return (
    <div className="min-h-screen relative bg-[#1c1f2e]">
      <div className="w-2/4 h-3/4 p-8 justify-center relative">
        <div className="flex flex-row gap-4">
          <div
            className="text-white bg-red-400 px-4 w-fit rounded-md hover:cursor-pointer"
            onClick={() => start()}
          >
            Start
          </div>
          <div
            className="text-white bg-red-400 px-4 w-fit rounded-md hover:cursor-pointer"
            onClick={() => start()}
          >
            Call
          </div>
        </div>

        <div>
          <img
            className="rounded-xl"
            src={require("./img/image1.jpg")}
            alt="meeting"
          ></img>
          <div className="bg-[#242736]/75 absolute bottom-10 right-10 flex justify-center items-center p-2 rounded-xl hover:cursor-pointer">
            <span class="material-icons text-white">mic</span>
          </div>
        </div>
      </div>
      {/* Participant */}
      <div className="hidden flex absolute right-5 top-8 bg-white w-1/4 p-4 rounded-md">
        <div className="w-full">
          <p className="font-bold text-xl">Participant</p>
          <div className=" mt-4">
            <input
              type="text"
              id="first_name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search for people"
              required
            />
          </div>
          <div className="flex flex-row mt-4 items-center justify-between">
            <div className="flex flex-row mt-4 items-center">
              <div className="bg-amber-500 w-8 h-8 rounded-full mr-4"></div>
              <p> Tống Đức Dũng</p>
            </div>
            <div className="flex flex-row mt-4 items-center gap-1">
              <span class="material-icons hover:cursor-pointer">mic_off</span>
              <span class="material-icons hover:cursor-pointer">
                videocam_off
              </span>
            </div>
          </div>
          <div className="flex flex-row mt-4 items-center justify-between">
            <div className="flex flex-row mt-4 items-center">
              <div className="bg-amber-500 w-8 h-8 rounded-full mr-4"></div>
              <p> Tống Đức Dũng</p>
            </div>
            <div className="flex flex-row mt-4 items-center gap-1">
              <span class="material-icons hover:cursor-pointer">mic_off</span>
              <span class="material-icons hover:cursor-pointer">
                videocam_off
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat */}
      <div className="">
        <div className="flex absolute right-5 top-8 bg-white w-1/4 p-4 rounded-md h-5/6">
          <div className="w-full">
            <p className="font-bold text-xl">Chat</p>
            <div className="my-4">
              <input
                type="text"
                id="first_name"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search for people"
                required
              />
            </div>
            <div>
              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-row mt-4 items-center">
                  <div className="bg-amber-500 w-8 h-8 rounded-full mr-4"></div>
                  <p className="font-bold"> Tống Đức Dũng</p>
                  <div className="ml-4 flex flex-row items-center">
                    <p>9:00 PM</p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p> Xin chào mọi người!</p>
              </div>
            </div>
            <div>
              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-row mt-4 items-center">
                  <div className="bg-amber-500 w-8 h-8 rounded-full mr-4"></div>
                  <p className="font-bold"> MCD</p>
                  <div className="ml-4 flex flex-row items-center">
                    <p>9:00 PM</p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p> Hi chào bạn!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-row m-4 gap-4 absolute bottom-0 justify-center w-3/4">
        <div className="bg-[#242736] justify-center flex items-center p-2 rounded-xl hover:cursor-pointer">
          <span className="material-icons text-white">mic</span>
          <span className="material-icons text-white">expand_less</span>
        </div>
        <div className="bg-[#242736] justify-center flex items-center p-2 rounded-xl hover:cursor-pointer ">
          <span className="material-icons text-white mr-2">videocam</span>
          <span className="material-icons text-white">expand_less</span>
        </div>
        <div className="bg-[#0e78f8] justify-center flex items-center p-2 rounded-xl hover:cursor-pointer ">
          <span className="material-icons text-white mr-2">people</span>
          <span className="material-icons text-white">expand_less</span>
        </div>
        <div className="bg-[#BF3325] flex justify-center items-center px-4 py-1 rounded-md mx-8 hover:bg-red-700 hover:cursor-pointer">
          <p className="text-white">End Meeting</p>
        </div>
        <div className="bg-[#242736] justify-center flex items-center p-2 rounded-xl hover:cursor-pointer ">
          <span className="material-icons text-white mr-2">screen_share</span>
          <span className="material-icons text-white">expand_less</span>
        </div>
        <div className="bg-[#242736] justify-center flex items-center p-2 rounded-xl hover:cursor-pointer ">
          <span className="material-icons text-white mr-2">
            radio_button_checked
          </span>
          <span className="material-icons text-white">expand_less</span>
        </div>
        <div className="bg-[#242736] justify-center flex items-center p-2 rounded-xl hover:cursor-pointer ">
          <span className="material-icons text-white mr-2">
            question_answer
          </span>
          <span className="material-icons text-white">expand_less</span>
        </div>
      </div>
    </div>
  )
}

export default App
