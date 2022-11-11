import { useRef, useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { Routes, Route, useNavigate } from "react-router-dom"
import { getFirestore, collection, getDocs } from "firebase/firestore/lite"

import VISUAL from '../img/visual.png'
import { db } from "../firebase"
import { generateRoomId } from "../utils"
import { selectUserId, setUserId } from "../redux/slices/AuthenticationSlice"

const ERROR_TEXT = {
  BLANK_CODE: "Blank room code",
  WRONG_CODE: "Make sure you have entered correct code",
}

function EnterCode() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [roomCode, setRoomCode] = useState("")
  const [errorText, setErrorText] = useState("")

  const checkRoomCodeExist = () => {
    if (roomCode !== "") {
      getDocs(collection(db, "rooms")).then((querySnapshot) => {
        let exist = false
        querySnapshot.forEach((documentSnapshot) => {
          // console.log(documentSnapshot)
          if (documentSnapshot.data()?.roomId === roomCode) {
            exist = true
            // window.location.href = `/${roomCode}/join/${documentSnapshot.id}`
            navigate(`/${roomCode}/join/${documentSnapshot.id}`)
            return
          }
        })
        if (!exist) {
          setErrorText(ERROR_TEXT.WRONG_CODE)
        }
      })
    } else {
      setErrorText(ERROR_TEXT.BLANK_CODE)
    }
  }

  useEffect(() => {
    dispatch(
      setUserId({
        userId: generateRoomId(),
      })
    )
  }, [])

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div>
        <h1 className="text-black text-4xl text-center font-bold">ZEAMS</h1>

        <img src={VISUAL} className="object-contain h-96 w-96 mb-2"/>
      </div>

      <div>
        <input
          value={roomCode}
          onChange={(e) => {
            setErrorText("")
            setRoomCode(e.target.value)
          }}
          type="text"
          id="first_name"
          className="bg-gray-50 w-48 placeholder-gray-500 border text-center border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block p-2.5"
          placeholder="Enter code to join room"
          required
          autoCapitalize="characters"
        />
      </div>

      <div className="mt-3">
        <p className="text-[#BF3325] italic font-semibold">{errorText}</p>
      </div>

      <div
        className="bg-[#000] w-48 my-4 flex justify-center items-center px-4 py-2 rounded-md mx-8 hover:bg-blue-500 hover:cursor-pointer"
        onClick={() => {
          checkRoomCodeExist()
        }}
      >
        <p className="text-white ">Join now</p>
      </div>

      <p className="text-black">
        Or{" "}
        <span
          className="hover:underline hover:cursor-pointer"
          onClick={() => {
            // window.location.href = "/create"
            navigate(`/create`)
          }}
        >
          create new room
        </span>
      </p>
    </div>
  )
}

export default EnterCode
