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
    <div className="min-h-screen relative bg-[#1c1f2e]">
      <div className="w-3/4 h-full p-8 justify-center relative">
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
      <div className="flex absolute right-5 top-8 bg-white w-1/4 p-4 rounded-md">
        <div className="w-full">
          <p className="font-bold text-xl">Participant</p>
          <div className=" mt-4">
            <input
              type="text"
              id="first_name"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
              <span class="material-icons ">mic_off</span>
              <span class="material-icons ">videocam_off</span>
            </div>
          </div>
          <div className="flex flex-row mt-4 items-center justify-between">
            <div className="flex flex-row mt-4 items-center">
              <div className="bg-amber-500 w-8 h-8 rounded-full mr-4"></div>
              <p> Tống Đức Dũng</p>
            </div>
            <div className="flex flex-row mt-4 items-center gap-1">
              <span class="material-icons ">mic_off</span>
              <span class="material-icons ">videocam_off</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row m-4 gap-4 absolute bottom-0 justify-center w-3/4">
        <div className="bg-[#242736] justify-center flex items-center p-2 rounded-xl hover:cursor-pointer">
          <span class="material-icons text-white">mic</span>
          <span class="material-icons text-white">expand_less</span>
        </div>
        <div className="bg-[#242736] justify-center flex items-center p-2 rounded-xl hover:cursor-pointer ">
          <span class="material-icons text-white mr-2">videocam</span>
          <span class="material-icons text-white">expand_less</span>
        </div>
        <div className="bg-[#0e78f8] justify-center flex items-center p-2 rounded-xl hover:cursor-pointer ">
          <span class="material-icons text-white mr-2">people</span>
          <span class="material-icons text-white">expand_less</span>
        </div>
        <div className="bg-[#BF3325] flex justify-center items-center px-4 py-1 rounded-md mx-8 hover:bg-red-700 hover:cursor-pointer">
          <p className="text-white">End Meeting</p>
        </div>
        <div className="bg-[#242736] justify-center flex items-center p-2 rounded-xl hover:cursor-pointer ">
          <span class="material-icons text-white mr-2">screen_share</span>
          <span class="material-icons text-white">expand_less</span>
        </div>
        <div className="bg-[#242736] justify-center flex items-center p-2 rounded-xl hover:cursor-pointer ">
          <span class="material-icons text-white mr-2">
            radio_button_checked
          </span>
          <span class="material-icons text-white">expand_less</span>
        </div>
        <div className="bg-[#242736] justify-center flex items-center p-2 rounded-xl hover:cursor-pointer ">
          <span class="material-icons text-white mr-2">question_answer</span>
          <span class="material-icons text-white">expand_less</span>
        </div>
      </div>
    </div>
  )
}

export default App
