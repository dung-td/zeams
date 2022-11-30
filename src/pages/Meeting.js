import { useParams } from "react-router-dom"
import { useRef, useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import parse from "html-react-parser"
import { PackedGrid } from "react-packed-grid"
import "@tensorflow/tfjs-core"
import "@tensorflow/tfjs-backend-webgl"
import * as bodySegmentation from "@tensorflow-models/body-segmentation"
import "@mediapipe/selfie_segmentation"
import "@tensorflow/tfjs-converter"
import { segment, start } from "../segment.mjs"

import { connection } from "../utils"
import {
  selectLocalStream,
  updateLocalStream,
  updateOtherPeers,
  addPeer,
  selectOtherPeers,
} from "../redux/slices/ConnectionSlice"
import { selectUserId } from "../redux/slices/AuthenticationSlice"
import { Chat } from "../components/Chat.js"
import { Attend } from "../components/Attend.js"
import { Background } from "../components/setting/Background.js"

const isVoiceOnly = false
const servers = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],

  iceCandidatePoolSize: 10,
}
const mediaConstraints = {
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
  },
  video: {
    frameRate: 60,
    facingMode: "user", // 'user'
    width: { min: 600, ideal: 1920, max: 1920 },
    height: { min: 300, ideal: 1080, max: 1080 },
  },
}
const sessionConstraints = {
  offerToReceiveAudio: true,
  offerToReceiveVideo: true,
}

function Meeting() {
  const { roomId } = useParams()
  const { action } = useParams()
  const { roomRef } = useParams()
  const dispatch = useDispatch()

  const peers = useSelector(selectOtherPeers)
  const localStreamRef = useRef()
  const remoteStreamRef = useRef()
  const otherPeers = useRef([])
  let userId = useSelector(selectUserId)
  const [others, setOthers] = useState([])
  const [muted, setMuted] = useState(false)
  const [docRef, setDocRef] = useState("")

  const [isMicOn, setIsMicOn] = useState(true)
  const [isCamOn, setIsCamOn] = useState(true)
  const [isSharing, setIsSharing] = useState(false)
  const [sidebar, setSidebar] = useState("background")

  const [initialising, setInitialising] = useState(true)
  const [camAmount, setCamAmount] = useState()
  const localStream = useSelector(selectLocalStream)

  const updateLayoutRef = useRef()
  const [aspectRatio, setAspectRatio] = useState(1)

  const deepClonePeers = () => {
    // dispatch(
    //   updateOtherPeers({
    //     otherPeers: [...otherPeers.current],
    //   })
    // )
    // setOthers([...otherPeers.current])
  }

  const findOfferIndex = (msg) => {
    let result = -1
    for (let i = 0; i < otherPeers.current.length; i++) {
      const peer = otherPeers.current[i]

      if (peer.id === msg.sender) {
        result = i
        break
      }
    }
    return result
  }

  const preLoadLocalStream = () => {
    navigator.mediaDevices.getUserMedia(mediaConstraints).then((stream) => {
      // dispatch(updateLocalStream({ localStream: stream }))
      localStreamRef.current.srcObject = stream
    })
  }

  const handleCleanUpConnection = (which) => {
    if (which == "all") {
      if (otherPeers.current.length > 0) {
        otherPeers.current?.forEach((item) => {
          item.peerConnection?.removeEventListener("track", () => null)
          item.peerConnection?.removeEventListener("icecandidate", () => null)
          item.peerConnection?.removeEventListener(
            "negotiationneeded",
            () => null
          )
          item.peerConnection?.removeEventListener(
            "connectionstatechange",
            () => null
          )
          item.peerConnection?.removeEventListener(
            "iceconnectionstatechange",
            () => null
          )

          item.peerConnection?.getTransceivers()?.forEach((transceiver) => {
            transceiver.stop()
          })
          item.peerConnection?.close()
          item.peerConnection = null
        })
        // others?.forEach(item => {
        //   item.peerConnection?.removeEventListener('track', () => null)
        //   item.peerConnection?.removeEventListener('icecandidate', () => null)
        //   item.peerConnection?.removeEventListener('negotiationneeded', () => null)
        //   item.peerConnection?.removeEventListener('connectionstatechange', () => null)
        //   item.peerConnection?.removeEventListener('iceconnectionstatechange', () => null)

        //   item.peerConnection?.getTransceivers()?.forEach(transceiver => {
        //     transceiver.stop()
        //   })
        //   item.peerConnection?.close()
        //   item.peerConnection = null
        // })

        if (localStream) {
          localStream.getTracks().map((track) => {
            track.stop()
          })
        }

        connection.off()
        connection.removeAllListeners()
        connection.disconnect()
        connection.close()
        setOthers([])
        otherPeers.current = []
        dispatch(updateLocalStream({ localStream: undefined }))
        console.log("-------Clean up connection------")
      }
    } else {
      otherPeers.current[which]?.peerConnection?.removeEventListener(
        "track",
        () => null
      )
      otherPeers.current[which]?.peerConnection?.removeEventListener(
        "icecandidate",
        () => null
      )
      otherPeers.current[which]?.peerConnection?.removeEventListener(
        "negotiationneeded",
        () => null
      )
      otherPeers.current[which]?.peerConnection?.removeEventListener(
        "connectionstatechange",
        () => null
      )
      otherPeers.current[which]?.peerConnection?.removeEventListener(
        "iceconnectionstatechange",
        () => null
      )

      otherPeers.current[which]?.peerConnection
        ?.getTransceivers()
        ?.forEach((transceiver) => {
          transceiver.stop()
        })
      otherPeers.current[which]?.peerConnection?.close()
      otherPeers.current[which].peerConnection = undefined

      // others[which]?.peerConnection?.removeEventListener('track', () => null)
      // others[which]?.peerConnection?.removeEventListener('icecandidate', () => null)
      // others[which]?.peerConnection?.removeEventListener('negotiationneeded', () => null)
      // others[which]?.peerConnection?.removeEventListener('connectionstatechange', () => null)
      // others[which]?.peerConnection?.removeEventListener('iceconnectionstatechange', () => null)

      // others[which]?.peerConnection?.getTransceivers()?.forEach(transceiver => {
      //   transceiver.stop()
      // })
      // others[which]?.peerConnection?.close()
      // others[which].peerConnection = undefined

      if (localStream) {
        localStream.getTracks().map((track) => {
          track.stop()
        })
      }

      otherPeers.current.splice(which, 1)
      deepClonePeers()
    }

    // removeRemoteStreamFromView(otherPeers.current[which])

    deepClonePeers()
  }

  const sendToServer = (msg) => {
    connection.emit("message", JSON.stringify(msg))
  }

  const connectServer = () => {
    sendToServer({
      type: "join",
      roomId: roomId,
      roomRef: roomRef,
      data: {
        sender: userId,
      },
      create: action === "in" ? false : true,
    })

    connection.on("message", async (msg) => {
      const obj = JSON.parse(msg)
      console.log(msg)
      switch (obj?.type) {
        case "id":
          break
        case "join":
          if (obj.data.receiver != null && obj.data.receiver === userId) {
            setDocRef(obj.data.docRef)

            let arr = []
            obj.data.participants.forEach((person) => {
              if (person != userId) {
                arr.push({
                  id: person,
                  remoteStream: undefined,
                  peerConnection: undefined,
                })
              }
            })
            otherPeers.current = arr
            setInitialising(false)
          }
          break
        case "offer":
          try {
            if (obj.receiver == userId) {
              const check = findOfferIndex(obj)

              if (check < 0) {
                otherPeers.current.push({
                  id: obj.sender,
                  remoteStream: undefined,
                  peerConnection: undefined,
                })
              }
              const index = findOfferIndex(obj)

              if (!otherPeers.current[index].peerConnection) {
                createPeerConnection(index)
              }

              if (
                obj.data !=
                otherPeers.current[index].peerConnection?.localDescription
              ) {
                if (
                  otherPeers.current[index].peerConnection.signalingState !=
                  "stable"
                ) {
                  await Promise.all([
                    otherPeers.current[
                      index
                    ].peerConnection?.setLocalDescription({ type: "rollback" }),
                    otherPeers.current[
                      index
                    ].peerConnection?.setRemoteDescription(obj?.data),
                  ])
                } else {
                  otherPeers.current[
                    index
                  ].peerConnection?.setRemoteDescription(obj?.data)
                }
              }

              otherPeers.current[index].peerConnection
                ?.createAnswer(sessionConstraints)
                .then((answerDescription) => {
                  otherPeers.current[index].peerConnection?.setLocalDescription(
                    answerDescription
                  )

                  sendToServer({
                    type: "answer",
                    roomId: roomId,
                    sender: userId,
                    receiver: otherPeers.current[index]?.id,
                    data: answerDescription,
                  })
                })
            }
          } catch (e) {}
          break
        case "answer":
          if (obj.receiver == userId) {
            const check = findOfferIndex(obj)

            if (check < 0) {
              otherPeers.current.push({
                id: obj.sender,
                remoteStream: undefined,
                peerConnection: undefined,
              })
            }
            const index = findOfferIndex(obj)
            otherPeers.current[index].peerConnection?.setRemoteDescription(
              obj.data
            )
          }
          break
        case "ice-candidate":
          try {
            const check = findOfferIndex(obj)

            if (
              obj.receiver == userId &&
              obj.sender == otherPeers.current[check].id
            ) {
              if (check < 0) {
                otherPeers.current.push({
                  id: obj.sender,
                  remoteStream: undefined,
                  peerConnection: undefined,
                })
                // createPeerConnection(otherPeers.current.length - 1)
              }
              const index = findOfferIndex(obj)
              otherPeers.current[index].peerConnection.addIceCandidate(
                new RTCIceCandidate(obj.data)
              )
              deepClonePeers()
            }
          } catch (err) {}
          break
        case "hang-up":
          const index = findOfferIndex(obj)
          handleCleanUpConnection(index)
          break
        default:
          console.log("Unknown received message: " + obj.type)
      }
    })

    connection.on("connect-error", () => {
      console.log("IO connected error")
    })
  }

  const createPeerConnection = (index) => {
    if (!otherPeers.current[index].peerConnection) {
      otherPeers.current[index].peerConnection = new RTCPeerConnection(servers)

      navigator.mediaDevices.getUserMedia(mediaConstraints).then((stream) => {
        // dispatch(updateLocalStream({ localStream: stream }))
        localStreamRef.current.srcObject = stream
        stream?.getTracks().forEach((track) => {
          otherPeers.current[index].peerConnection.addTrack(track)
        })

        // replace old tracks in other peers with latest tracks
        otherPeers.current.forEach((peer, idx) => {
          if (idx != index && peer.peerConnection) {
            console.log("REPLACE TRACK")
            peer.peerConnection.getSenders().forEach((sender) => {
              sender.replaceTrack(stream.getVideoTracks()[0])
            })
          }
        })
      })

      otherPeers.current[index].peerConnection?.addEventListener(
        "icecandidate",
        (event) => {
          if (event.candidate) {
            sendToServer({
              type: "ice-candidate",
              roomId: roomId,
              sender: userId,
              receiver: otherPeers.current[index].id,
              data: event.candidate,
            })
          }
        }
      )

      otherPeers.current[index].peerConnection?.addEventListener(
        "track",
        (event) => {
          let remoteStream = new MediaStream()
          console.log("In Track")
          if (event.streams[0]) {
            console.log("streams[0]")
            // event.streams[0].getTracks().forEach((track) => {
            //   remoteStream.addTrack(track)
            // })
            remoteStream = event.streams[0]
          } else {
            console.log("event.track")
            remoteStream = new MediaStream([event.track])
          }

          let videoId = "remoteStream" + otherPeers.current[index].id

          console.log(videoId)

          if (otherPeers.current[index].remoteStream === undefined) {
            addRemoteStreamToView(videoId)
          }

          otherPeers.current[index].remoteStream = remoteStream
          updateRemoteStream(remoteStream, videoId)

          deepClonePeers()
        }
      )

      otherPeers.current[index].peerConnection?.addEventListener(
        "negotiationneeded",
        (event) => {
          console.log("---------------Negotiation needed--------------")
          if (
            otherPeers.current[index].peerConnection?.signalingState != "stable"
          ) {
            return
          }
          otherPeers.current[index].peerConnection
            ?.createOffer(sessionConstraints)
            .then((offerDescription) => {
              otherPeers.current[index].peerConnection?.setLocalDescription(
                offerDescription
              )

              sendToServer({
                type: "offer",
                roomId: roomId,
                sender: userId,
                receiver: otherPeers.current[index].id,
                data: offerDescription,
              })
            })
        }
      )

      otherPeers.current[index].peerConnection?.addEventListener(
        "connectionstatechange",
        (event) => {
          const state =
            otherPeers.current[index].peerConnection?.connectionState
          if (state == "connected") {
            deepClonePeers()
          }
          if (state == "failed") {
            otherPeers.current[index].peerConnection?.restartIce()
          }
          console.log("------Connection state: " + state + "\n")
        }
      )

      otherPeers.current[index].peerConnection?.addEventListener(
        "iceconnectionstatechange",
        (event) => {
          const state =
            otherPeers.current[index].peerConnection?.iceConnectionState
          if (state == "completed") {
            deepClonePeers()
          }
          if (state == "failed") {
            otherPeers.current[index].peerConnection?.restartIce()
          }
          console.log("-----------ICE Connection state: " + state + "\n")
        }
      )
    }
  }

  const addRemoteStreamToView = (videoId) => {
    const videoContainer = document.createElement("video")
    videoContainer.id = videoId

    dispatch(addPeer({ peer: videoContainer.outerHTML }))

    setTimeout(() => {
      updateLayoutRef.current()
    }, 500)
  }

  const updateRemoteStream = (remoteStream, videoId) => {
    setTimeout(() => {
      console.log("Append video to video tag")
      const video = document.querySelector("#" + videoId)
      video.autoplay = true
      video.srcObject = remoteStream
      video.play()
    }, 1000)
  }

  const removeRemoteStreamFromView = (peer) => {
    let videoId = "remoteStream" + peer.id

    const videoContainer = document.querySelector("#" + videoId)
    videoContainer.remove()

    if (updateLayoutRef) {
      updateLayoutRef.current()
    }
  }

  const renderSidebar = (param) => {
    switch (param) {
      case "chat":
        return <Chat />
      case "attend":
        return <Attend />
      case "background":
        return <Background applyEffect={applyEffect} />
      default:
        return null
    }
  }

  const applyEffect = async (option) => {
    const videoElement = document.getElementsByClassName("localStreamRef")[0]
    const canvasElement = document.getElementById("canvasTesting")

    start(videoElement, canvasElement, option).catch((err) =>
      console.error(err)
    )
  }

  // initialize socket-io connection
  useEffect(() => {
    preLoadLocalStream()

    connectServer()

    return () => {
      // if (isSharing) {
      //   stopScreenSharing()
      // }
      handleCleanUpConnection("all")
    }
  }, [])

  // Handle create peerConnection for other peers
  useEffect(() => {
    if (otherPeers.current.length > 0) {
      otherPeers.current.forEach((peer, index) => {
        if (!peer.peerConnection) {
          createPeerConnection(index)
        }
      })
    }
  }, [otherPeers.current])

  return (
    <div className="min-h-screen max-h-screen w-full relative bg-[#1c1f2e]">
      <div
        id="parentLayout"
        className="w-full flex flex-row min-h-screen max-h-screen p-4 pb-16 justify-center"
      >
        <PackedGrid
          id="layout"
          boxAspectRatio={aspectRatio}
          // className="fullscreen"
          updateLayoutRef={updateLayoutRef}
          // id="layer"
          className={`${
            sidebar === "" ? "w-9/12 " : "w-full "
          } flex flex-row  max-h-screen layer`}
        >
          <div className="h-full p-2">
            <div className="h-full bg-gray-700 border border-gray-600 rounded-md flex flex-col justify-center">
              <video
                id="localStream"
                className="localStreamRef"
                ref={localStreamRef}
                autoPlay
                muted
              />
            </div>
          </div>

          {peers.map((peerHTML) => {
            return (
              <div className="h-full flex flex-col justify-center object-cover overflow-hidden p-2">
                <div className="h-full bg-gray-700 border border-gray-600 rounded-md">
                  {parse(peerHTML)}
                </div>
              </div>
            )
          })}

          {/* <div className="h-full p-2">
            <div className="h-full bg-gray-700 border border-gray-600 rounded-md flex flex-col justify-center">
              <canvas id="canvasTesting" />
            </div>
          </div> */}
        </PackedGrid>

        {/* Sidebar */}
        <div
          className={
            sidebar !== "" ? "w-3/12 flex flex-row  max-h-screen" : "hidden"
          }
        >
          {renderSidebar(sidebar)}
        </div>
      </div>

      {/* Bottom button */}
      <div
        className={`w-full flex flex-row mb-4 gap-4 absolute bottom-0 justify-between items-center px-8`}
      >
        <div className="text-white font-xl font-bold ">{roomId}</div>

        <div className="flex flex-row gap-4">
          <div className="bg-[#242736] justify-center flex items-center p-2 rounded-xl hover:cursor-pointer border border-gray-700 hover:border-gray-600">
            <span
              className="material-icons text-white"
              onClick={() => {
                setIsMicOn(!isMicOn)
              }}
            >
              {isMicOn ? "mic" : "mic_off"}
            </span>
            {/* <span className="material-icons text-white">expand_less</span> */}
          </div>
          <div className="bg-[#242736] justify-center flex items-center p-2 rounded-xl hover:cursor-pointer border border-gray-700 hover:border-gray-600">
            <span
              className="material-icons text-white"
              onClick={() => {
                setIsCamOn(!isCamOn)
              }}
            >
              {isCamOn ? "videocam" : "videocam_off"}
            </span>
            {/* <span className="material-icons text-white">expand_less</span> */}
          </div>

          <div className="bg-[#BF3325] flex justify-center items-center px-8 py-1 rounded-md mx-4 hover:bg-red-700 hover:cursor-pointer">
            <p className="text-white">End Meeting</p>
          </div>

          <div
            className="bg-[#242736] justify-center flex items-center p-2 rounded-xl hover:cursor-pointer border border-gray-700 hover:border-gray-600"
            onClick={() => {
              if (sidebar == "background") {
                setSidebar("")
              } else {
                setSidebar("background")
              }

              setTimeout(() => {
                updateLayoutRef.current()
              }, 1)
            }}
          >
            <span className="material-icons text-white ">more_vert</span>
          </div>
          <div className="bg-[#242736] justify-center flex items-center p-2 rounded-xl hover:cursor-pointer border border-gray-700 hover:border-gray-600">
            <span className="material-icons text-white mr-2">screen_share</span>
            <span className="material-icons text-white">expand_less</span>
          </div>
          <div className="bg-[#242736] justify-center flex items-center p-2 rounded-xl hover:cursor-pointer border border-gray-700 hover:border-gray-600">
            <span className="material-icons text-white mr-2">
              radio_button_checked
            </span>
            <span className="material-icons text-white">expand_less</span>
          </div>
        </div>

        <div className="flex flex-row gap-2">
          <div
            className={`${
              sidebar === "attend" ? "bg-[#0e78f8]" : "bg-[#242736]"
            } justify-center flex items-center p-2 rounded-xl hover:cursor-pointer`}
            onClick={() => {
              if (sidebar == "attend") {
                setSidebar("")
              } else {
                setSidebar("attend")
              }

              setTimeout(() => {
                updateLayoutRef.current()
              }, 1)
            }}
          >
            <span className="material-icons text-white mr-2">people</span>
            <span className="material-icons text-white">expand_less</span>
          </div>
          <div
            className={`${
              sidebar === "chat" ? "bg-[#0e78f8]" : "bg-[#242736]"
            } justify-center flex items-center p-2 rounded-xl hover:cursor-pointer`}
            onClick={() => {
              if (sidebar == "chat") {
                setSidebar("")
              } else {
                setSidebar("chat")
              }

              setTimeout(() => {
                updateLayoutRef.current()
              }, 1)
            }}
          >
            <span className="material-icons text-white">question_answer</span>
            <span className="material-icons text-white">expand_less</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Meeting
