import { useParams } from "react-router-dom"
import { useRef, useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import parse from "html-react-parser"
import { PackedGrid } from "react-packed-grid"
import "@tensorflow/tfjs-core"
import "@tensorflow/tfjs-backend-webgl"
import * as bodySegmentation from "@tensorflow-models/body-segmentation"
import "@mediapipe/selfie_segmentation"
import "@tensorflow/tfjs-converter"

import { changeSize, segment, setBackground, start } from "../segment.mjs"
import { connection } from "../utils"
import {
  selectLocalStream,
  updateLocalStream,
  updateOtherPeers,
  addPeer,
  selectOtherPeers,
  removePeer,
} from "../redux/slices/ConnectionSlice"
import {
  selectUserId,
  selectUsername,
} from "../redux/slices/AuthenticationSlice"
import { Chat } from "../components/Chat.js"
import { Attend } from "../components/Attend.js"
import { Background } from "../components/setting/Background.js"
import {
  DISPLAY_MEDIA_CONSTRAINTS,
  MEDIA_CONSTRAINTS,
  SERVERS,
  SESSION_CONSTRAINTS,
} from "../constants/index.js"

const isVoiceOnly = false

function Meeting() {
  const navigate = useNavigate()

  const { roomId } = useParams()
  const { action } = useParams()
  const { roomRef } = useParams()
  const dispatch = useDispatch()

  const peers = useSelector(selectOtherPeers)
  const localStreamRef = useRef()
  const processedLocalStreamRef = useRef()
  const remoteStreamRef = useRef()
  const otherPeers = useRef([])
  let userId = useSelector(selectUserId)
  let userName = useSelector(selectUsername)
  const [others, setOthers] = useState([])
  const [muted, setMuted] = useState(false)
  const [docRef, setDocRef] = useState("")

  const [isMicOn, setIsMicOn] = useState(true)
  const [isCamOn, setIsCamOn] = useState(true)
  const [isUsingEffect, setIsUsingEffect] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [sidebar, setSidebar] = useState("")
  const [isLoading, setIsLoading] = useState(false)

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

      if (peer.id === msg.sender.id) {
        result = i
        break
      }
    }
    return result
  }

  const preLoadLocalStream = () => {
    navigator.mediaDevices.getUserMedia(MEDIA_CONSTRAINTS).then((stream) => {
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

      otherPeers.current.splice(which, 1)

      console.log("-------Clean up connection------")
      deepClonePeers()
    }

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
        sender: {
          id: userId,
          name: userName,
        },
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
              console.log(obj.data)
              if (person.id != userId) {
                arr.push({
                  id: person.id,
                  name: person.name,
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
                  id: obj.sender.id,
                  name: obj.sender.name,
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
                ?.createAnswer(SESSION_CONSTRAINTS)
                .then((answerDescription) => {
                  otherPeers.current[index].peerConnection?.setLocalDescription(
                    answerDescription
                  )

                  sendToServer({
                    type: "answer",
                    roomId: roomId,
                    sender: {
                      id: userId,
                      name: userName,
                    },
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
                id: obj.sender.id,
                name: obj.sender.name,
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
              obj.sender.id == otherPeers.current[check].id
            ) {
              if (check < 0) {
                otherPeers.current.push({
                  id: obj.sender.id,
                  name: obj.sender.name,
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
          removeRemoteStreamFromView(index)
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
      otherPeers.current[index].peerConnection = new RTCPeerConnection(SERVERS)

      navigator.mediaDevices.getUserMedia(MEDIA_CONSTRAINTS).then((stream) => {
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
              sender.replaceTrack(
                !processedLocalStreamRef
                  ? stream.getVideoTracks()[0]
                  : processedLocalStreamRef.current.srcObject.getVideoTracks()[0]
              )
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
              sender: {
                id: userId,
                name: userName,
              },
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
            ?.createOffer(SESSION_CONSTRAINTS)
            .then((offerDescription) => {
              otherPeers.current[index].peerConnection?.setLocalDescription(
                offerDescription
              )

              sendToServer({
                type: "offer",
                roomId: roomId,
                sender: {
                  id: userId,
                  name: userName,
                },
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
    videoContainer.classList.add("w-full")

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

  const removeRemoteStreamFromView = (index) => {
    dispatch(removePeer({ index: index }))

    setTimeout(() => {
      updateLayoutRef.current()
    }, 5)
  }

  const renderSidebar = (param) => {
    switch (param) {
      case "chat":
        return <Chat />
      case "attend":
        return <Attend otherPeers={otherPeers.current} local={userId} />
      // case "background":
      //   return (
      //     <Background
      //       applyEffect={applyEffect}
      //       changeSize={changeEffectSizeAndApply}
      //     />
      //   )
      default:
        return null
    }
  }

  const applyEffect = async (option, backgroundImage) => {
    const videoElement = document.getElementsByClassName("localStreamRef")[0]
    const canvasElement = document.getElementById("canvasTesting")

    if (option === "background") {
      setBackground(backgroundImage)
    }

    start(videoElement, canvasElement, option).catch((err) =>
      console.error(err)
    )
  }

  const changeEffectSizeAndApply = () => {
    const videoElement = document.getElementsByClassName("localStreamRef")[0]
    const canvasElement = document.getElementById("canvasTesting")

    changeSize(videoElement.offsetHeight, videoElement.offsetWidth)

    canvasElement.height = videoElement.offsetHeight
    canvasElement.width = videoElement.offsetWidth

    processedLocalStreamRef.current.srcObject = canvasElement.captureStream(30)

    const processedVideoElement = document.getElementById(
      "processedLocalStream"
    )

    const processedLocalStreamElement = document.getElementById(
      "processedLocalStream"
    )

    processedLocalStreamElement.classList.add("z-10")

    // Replace track after process for other peers
    otherPeers.current.forEach((peer) => {
      console.log("REPLACE TRACK")
      peer.peerConnection.getSenders().forEach((sender) => {
        sender.replaceTrack(
          processedLocalStreamRef.current.srcObject.getVideoTracks()[0]
        )
      })
    })
  }

  const startCaptureScreen = () => {
    navigator.mediaDevices
      .getDisplayMedia(DISPLAY_MEDIA_CONSTRAINTS)
      .then((stream) => {
        console.log("Start sharing screen")
        setIsSharing(true)
        localStreamRef.current.srcObject = stream

        // replace old tracks in other peers with latest tracks
        otherPeers.current.forEach((peer) => {
          console.log("REPLACE TRACK")
          peer.peerConnection.getSenders().forEach((sender) => {
            sender.replaceTrack(stream.getVideoTracks()[0])
          })
        })

        stream.oninactive = function () {
          console.log("Stop sharing screen")
          setIsSharing(false)
          navigator.mediaDevices
            .getUserMedia(MEDIA_CONSTRAINTS)
            .then((stream) => {
              localStreamRef.current.srcObject = stream

              // replace old tracks in other peers with latest tracks
              otherPeers.current.forEach((peer) => {
                console.log("REPLACE TRACK")
                peer.peerConnection.getSenders().forEach((sender) => {
                  sender.replaceTrack(stream.getVideoTracks()[0])
                })
              })
            })
        }
      })
  }

  // initialize socket-io connection
  useEffect(() => {
    preLoadLocalStream()

    connectServer()

    return () => {
      handleCleanUpConnection("all")
    }
  }, [])

  // Handle create peerConnection for other peers
  useEffect(() => {
    if (otherPeers.current.length > 0) {
      console.log("User joined, start creating peers!")
      otherPeers.current.forEach((peer, index) => {
        if (!peer.peerConnection) {
          createPeerConnection(index)
        }
      })
    }
  }, [otherPeers.current])

  return (
    <div className="relative min-h-screen max-h-screen w-full bg-[#1c1f2e]">
      <div
        id="parentLayout"
        className="relative w-full flex flex-row min-h-screen max-h-screen p-4 pb-16 justify-center"
      >
        {/* Sidebar */}
        <div
          className={`absolute w-3/12 min-h-screen max-h-screen right-4 top-4 bottom-0 ${
            sidebar === "background" ? "z-10" : "-z-10"
          } `}
        >
          <Background
            applyEffect={applyEffect}
            changeSize={changeEffectSizeAndApply}
          />
        </div>

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
          <div id="localStreamRefDiv" className="h-full p-2 ">
            <div className="relative h-full bg-gray-700 border border-gray-600 rounded-md flex flex-col justify-center items-center object-cover overflow-hidden">
              <video
                id="localStream"
                className="localStreamRef absolute"
                ref={localStreamRef}
                autoPlay
                muted
              />
              <video
                id="processedLocalStream"
                className="processedLocalStream absolute"
                ref={processedLocalStreamRef}
                autoPlay
                muted
              />
            </div>
          </div>

          {peers.map((peerHTML, index) => {
            return (
              <div key={index} className="h-full p-2">
                <div className="h-full bg-gray-700 border border-gray-600 rounded-md flex flex-col justify-center items-center object-cover overflow-hidden">
                  {parse(peerHTML)}
                </div>
              </div>
            )
          })}
        </PackedGrid>

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

          <div
            className="bg-[#BF3325] flex justify-center items-center px-8 py-1 rounded-md hover:bg-red-700 hover:cursor-pointer"
            onClick={() => {
              console.log("Leaving...")
              sendToServer({
                type: "hang-up",
                roomId: roomId,
                roomRef: roomRef,
                sender: {
                  id: userId,
                  name: userName,
                },
              })
              navigate(`/`)
              window.reload()
            }}
          >
            <p className="text-white">Leave Meeting</p>
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
          <div
            className={`${
              isSharing ? "bg-[#0e78f8]" : "bg-[#242736]"
            } bg-[#242736] justify-center flex items-center p-2 rounded-xl hover:cursor-pointer border border-gray-700 hover:border-gray-600`}
            onClick={() => {
              startCaptureScreen()
            }}
          >
            <span className="material-icons text-white">screen_share</span>
            {/* <span className="material-icons text-white">expand_less</span> */}
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
            } justify-center flex items-center p-2 rounded-full border border-gray-600 hover:cursor-pointer`}
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
            <span className="material-icons text-white">people</span>
            {/* <span className="material-icons text-white">expand_less</span> */}
          </div>
          <div
            className={`${
              sidebar === "chat" ? "bg-[#0e78f8]" : "bg-[#242736]"
            } justify-center flex items-center p-2 rounded-full border border-gray-600 hover:cursor-pointer`}
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
            {/* <span className="material-icons text-white">expand_less</span> */}
          </div>
        </div>
      </div>

      {/* Loading */}
      {isLoading ? (
        <div class="text-center absolute top-0 w-full h-full z-20 bg-slate-400/40">
          <div className="h-full flex flex-col items-center justify-center">
            <svg
              className="inline m-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="text-white">Loading...</span>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default Meeting
