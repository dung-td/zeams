import { useRef, useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { Routes, Route, useNavigate } from "react-router-dom"

import { selectUserId } from "../redux/slices/AuthenticationSlice"
import { generateRoomId } from "../utils"

const mediaConstraints = {
  audio: true,
  video: {
    frameRate: 60,
    facingMode: "user", // 'user'
  },
}

function CreatRoom() {
  const navigate = useNavigate()
  const localStreamRef = useRef()
  const [roomId, setRoomId] = useState("")
  const userId = "tesing1" // useSelector(selectUserId)

  const handleJoiningMeet = () => {
    // window.location.href = `/${roomId}/create`
    
    navigate(`/${roomId}/create`)
    // if (localStreamRef.current != undefined) {
    //   localStreamRef.current.getTracks().map((track) => {
    //     track.stop()
    //   })
    //   localStreamRef(undefined)
    //   console.log("Clean up local media stream in ready screen!")
    // }
  }

  console.log(userId)

  useEffect(() => {
    const gettingVideoStream = () => {
      try {
        console.log("Get user media")
        navigator.mediaDevices.getUserMedia(mediaConstraints).then((stream) => {
          localStreamRef.current.srcObject = stream
        })
      } catch (err) {
        // Handle Error
      }
    }

    setRoomId(generateRoomId())
    gettingVideoStream()
  }, [])

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="p-4">
        <p className="text-black text-2xl">
          Meeting code: <span>{roomId}</span>
        </p>
      </div>
      <div>
        <video ref={localStreamRef} autoPlay></video>
      </div>

      <div
        className="bg-[#000] w-48 my-4 flex justify-center items-center px-4 py-2 rounded-md mx-8 hover:bg-blue-500 hover:cursor-pointer"
        onClick={() => {
          handleJoiningMeet()
        }}
      >
        <p className="text-white ">Start meeting now</p>
      </div>
    </div>
  )
}

export default CreatRoom
