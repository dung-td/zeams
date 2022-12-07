import { useRef, useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Routes, Route, useParams, useNavigate } from "react-router-dom"

import {
  selectUserId,
  selectUsername,
  setUsername,
} from "../redux/slices/AuthenticationSlice"

const mediaConstraints = {
  audio: true,
  video: {
    frameRate: 60,
    facingMode: "user", // 'user'
  },
}

function JoinRoom() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const localStreamRef = useRef()
  const { roomId } = useParams()
  const { roomRef } = useParams()
  const userId = useSelector(selectUserId)
  const displayName = useSelector(selectUsername)

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
        navigator.mediaDevices.getUserMedia(mediaConstraints).then((stream) => {
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

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="p-4">
        <p className="text-white text-xl">
          <span>{roomId}</span>
        </p>
      </div>
      <div>
        <video ref={localStreamRef} autoPlay></video>
      </div>

      <input
        value={displayName}
        onChange={(e) => {
          setDisplayName(e.target.value)
        }}
        type="text"
        id="first_name"
        className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full"
        placeholder="Enter display name to everyone"
        required
      />

      <div
        className="bg-[#BF3325] my-4 flex justify-center items-center px-4 py-1 rounded-md mx-8 hover:bg-red-700 hover:cursor-pointer"
        onClick={() => {
          handleJoiningMeet()
        }}
      >
        <p className="text-white ">Join now</p>
      </div>
    </div>
  )
}

export default JoinRoom
