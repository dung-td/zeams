import React from "react"

export const Chat = () => {
  const renderChat = () => {
    var elements = []

    for (let index = 0; index < 5; index++) {
      elements.push(
        <div>
          <div className="flex flex-row items-center justify-between ">
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
      )
    }

    return elements
  }

  return (
    <div className="flex flex-col bg-white p-4 rounded-md h-full justify-between w-full ">
      <div className="w-full">
        <p className="font-bold text-xl">Chat</p>
      </div>

      <div className="overflow-y-auto my-2">
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

      <div className="relative">
        <input
          type="text"
          className="bg-gray-50 border pr-10 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="Enter message to send to everyone"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-auto">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  )
}
