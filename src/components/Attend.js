import React from "react"
import { useSelector } from "react-redux"
import { selectUsername } from "../redux/slices/AuthenticationSlice"

export const Attend = (props) => {
  let username = useSelector(selectUsername)
  console.log(props)
  return (
    <div className="flex flex-col bg-white p-4 rounded-md h-full w-full">
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
      </div>

      <div className="overflow-y-auto">
        <div className="flex flex-row mt-4 items-center justify-between">
          <div className="flex flex-row mt-4 items-center">
            <div className="bg-amber-500 w-8 h-8 rounded-full mr-4"></div>
            <p>{username}</p>
          </div>
          <div className="flex flex-row mt-4 items-center gap-1">
            <span className="material-icons hover:cursor-pointer">mic_off</span>
            <span className="material-icons hover:cursor-pointer">
              videocam_off
            </span>
          </div>
        </div>
        {props.otherPeers.map((peer, index) => {
          return (
            <div
              key={peer.id}
              className="flex flex-row mt-4 items-center justify-between"
            >
              <div className="flex flex-row mt-4 items-center">
                <div className="bg-amber-500 w-8 h-8 rounded-full mr-4"></div>
                <p>{peer.name}</p>
              </div>
              <div className="flex flex-row mt-4 items-center gap-1">
                <span className="material-icons hover:cursor-pointer">
                  mic_off
                </span>
                <span className="material-icons hover:cursor-pointer">
                  videocam_off
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
