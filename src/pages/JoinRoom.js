import { useRef, useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Routes, Route, useParams, useNavigate } from "react-router-dom"
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

function JoinRoom() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const localStreamRef = useRef()
  const { roomId } = useParams()
  const { roomRef } = useParams()
  const userId = useSelector(selectUserId)
  const displayName = useSelector(selectUsername)
  const isMicOn = useSelector(selectAudio)
  const isCamOn = useSelector(selectVideo)
  const [errorText, setErrorText] = useState("")

  const ERROR_TEXT = {
    BLANK: "Blank display username",
  }

  const handleJoiningMeet = () => {
    if (localStreamRef.current !== undefined) {
      localStreamRef.current = undefined
      console.log("Clean up local media stream in ready screen!")
    }

    navigate(`/${roomId}/in/${roomRef}`)
  }

  useEffect(() => {
    const gettingVideoStream = () => {
      try {
        navigator.mediaDevices
          .getUserMedia(MEDIA_CONSTRAINTS)
          .then((stream) => {
            localStreamRef.current.srcObject = stream
          })
      } catch (err) {
        console.log(err)
      }
    }
    gettingVideoStream()
  }, [])

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

  useEffect(() => {
    console.log("Get new stream")
    navigator.mediaDevices.getUserMedia(MEDIA_CONSTRAINTS).then((stream) => {
      if (stream !== null && localStreamRef.current) {
        localStreamRef.current.srcObject = stream
      }
    })
  }, [isCamOn])

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="p-4">
        <p className="text-white text-xl">
          ROOM: <span>{roomId}</span>
        </p>
      </div>

      <input
        value={displayName}
        onChange={(e) => {
          setErrorText("")
          setDisplayName(e.target.value)
        }}
        type="text"
        id="first_name"
        className=" w-2/12 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Enter display name to everyone"
        required
      />

      <div className="w-4/12 mt-4 relative">
        {displayName !== "" ? (
          <p className="absolute z-30 bottom-2 left-2 text-white bg-[#242B2E] px-6 py-2 rounded-md">
            {displayName}
          </p>
        ) : null}
        {isCamOn ? (
          <video
            className="rounded-md"
            ref={localStreamRef}
            autoPlay
            muted
          ></video>
        ) : (
          <div className="h-full w-full min-h-[300px] rounded-xl flex justify-center items-center bg-[#242736]">
            <div className="text-white bg-[#242736]/70 p-20 rounded-md">
              <span className="material-icons text-5xl">perm_identity</span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3">
        <p className="text-[#BF3325] italic font-semibold text-center">
          {errorText}
        </p>
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
        <p className="text-white ">Join now</p>
      </div>
    </div>
  )
}

export default JoinRoom
