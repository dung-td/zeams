import { useRef, useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Routes, Route, useNavigate } from "react-router-dom"
import { MEDIA_CONSTRAINTS } from "../constants"

import {
  selectUserId,
  selectUsername,
  setUsername,
} from "../redux/slices/AuthenticationSlice"
import {
  selectAudio,
  selectVideo,
  updateAudio,
  updateVideo,
} from "../redux/slices/ConnectionSlice"
import { generateRoomId } from "../utils"

function CreatRoom() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const localStreamRef = useRef()
  const [roomId, setRoomId] = useState("")
  const isMicOn = useSelector(selectAudio)
  const isCamOn = useSelector(selectVideo)
  const userId = useSelector(selectUserId)
  const displayName = useSelector(selectUsername || "")
  const [errorText, setErrorText] = useState(" ")

  const ERROR_TEXT = {
    BLANK: "Blank display username",
  }

  const handleJoiningMeet = () => {
    if (localStreamRef.current != undefined) {
      // localStreamRef.current.getTracks().map((track) => {
      //   track.stop()
      // })
      localStreamRef.current = undefined
      console.log("Clean up local media stream in ready screen!")
    }
    navigate(`/${roomId}/create`)
  }

  useEffect(() => {
    setRoomId(generateRoomId())
  }, [])

  useEffect(() => {
    const gettingVideoStream = () => {
      try {
        console.log("Get user media")
        navigator.mediaDevices
          .getUserMedia(MEDIA_CONSTRAINTS)
          .then((stream) => {
            localStreamRef.current.srcObject = stream
          })
      } catch (err) {
        // Handle Error
      }
    }

    if (isCamOn) {
      gettingVideoStream()
    }
  }, [isCamOn])

  const setDisplayName = (username) => {
    dispatch(
      setUsername({
        username: username,
      })
    )
  }

  const checkRequirements = () => {
    if (displayName !== "" && displayName !== null) {
      console.log(displayName)
      handleJoiningMeet()
    } else {
      setErrorText(ERROR_TEXT.BLANK)
    }
  }

  return (
    <div className="min-h-screen max-h-screen flex flex-col justify-center items-center">
      <div className="p-4 pb-2 w-2/12">
        <p className="text-white text-xl text-center">
          Meeting code: <span>{roomId}</span>
        </p>

        <input
          value={displayName}
          onChange={(e) => {
            setErrorText("")
            setDisplayName(e.target.value)
          }}
          type="text"
          id="first_name"
          className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-full"
          placeholder="Enter display name to everyone"
          required
        />

        <div className="mt-1">
          <p className="text-[#BF3325] italic font-semibold text-center">
            {errorText}
          </p>
        </div>
      </div>

      <div className="relative w-4/12">
        <div className="absolute z-30 bottom-2 left-2 flex flex-row">
          {displayName !== "" ? (
            <p className=" text-white bg-[#242B2E] px-6 py-2 rounded-md">
              {displayName}
            </p>
          ) : null}
          {/* <div className="flex items-center justify-center bg-[#242736] p-2 rounded-xl text-white">
            <span className="material-icons">
              {isMicOn ? "mic" : "mic_off"}
            </span>
          </div> */}
        </div>
        {isCamOn ? (
          <video
            className="rounded-xl relative"
            ref={localStreamRef}
            autoPlay
            muted
          ></video>
        ) : (
          <div className="w-full h-full rounded-xl flex justify-center items-center bg-[#242736]">
            <div className="text-white bg-[#242736]/70 p-20 rounded-md">
              <span className="material-icons text-5xl">perm_identity</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-row mt-2 items-center gap-1 text-white">
        <div className="flex items-center justify-center bg-[#242736] p-2 rounded-xl">
          <span
            className="material-icons hover:cursor-pointer"
            onClick={() => {
              dispatch(
                updateAudio({
                  audio: !isMicOn,
                })
              )
              // setIsMicOn(!isMicOn)
            }}
          >
            {isMicOn ? "mic" : "mic_off"}
          </span>
        </div>

        <div className="flex items-center justify-center bg-[#242736] p-2 rounded-xl">
          <span
            className="material-icons hover:cursor-pointer h-full"
            onClick={() => {
              dispatch(
                updateVideo({
                  video: !isCamOn,
                })
              )
            }}
          >
            {isCamOn ? "videocam" : "videocam_off"}
          </span>
        </div>
      </div>

      <div
        className="bg-[#BF3325] my-4 flex justify-center items-center px-4 py-1 rounded-md mx-8 hover:bg-red-700 hover:cursor-pointer"
        onClick={() => {
          checkRequirements()
        }}
      >
        <p className="text-white ">Start meeting now</p>
      </div>
    </div>
  )
}

export default CreatRoom
