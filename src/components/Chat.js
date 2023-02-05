import React, { useEffect, useLayoutEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addMessage, selectMessages } from "../redux/slices/ChatSlice"

const MessageItem = ({ sender, time, message, isOwnMsg }) => {
  return (
    <div className="my-3">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center">
          {/* <div className="bg-amber-500 w-8 h-8 rounded-full mr-4"></div> */}
          <p className={`font-bold ${isOwnMsg ? 'text-blue-700' : ''}`}>{(isOwnMsg ? '(You) ' : '') + sender}</p>
          <div className="ml-4 flex flex-row items-center">
            <p>{time}</p>
          </div>
        </div>
      </div>
      <div>
        <p>{message}</p>
      </div>
    </div>
  )
}

export const Chat = ({ roomId, userName, otherPeers, connection }) => {
  const dispatch = useDispatch()
  const inputRef = useRef()
  const messages = useSelector(selectMessages)

  const onInputEnter = (e) => {
    // enter
    if (e?.keyCode == 13) {
      const msgObj = {
        sender: userName,
        msg: inputRef.current?.value,
        time: new Date().toLocaleTimeString()
      }

      dispatch(
        addMessage({
          newMessage: msgObj
        })
      )

      connection?.emit("message", JSON.stringify({
        type: 'chat-on-web',
        roomId: roomId,
        data: msgObj
      }))

      otherPeers?.forEach(peer => {
        peer?.dataChannel?.send(
          JSON.stringify(msgObj)
        )
      })

      inputRef.current.value = ''
    }
  }

  useLayoutEffect(() => {
    if (otherPeers.length > 0) {
      setInterval(() => {
        otherPeers?.map(item => {
          const handleDataChannel = (dataChannel) => {
            // const dataChannel = item.dataChannel
            dataChannel.onmessage = (event) => {
              const data = JSON.parse(event.data)

              if (data.time) {
                dispatch(
                  addMessage({
                    newMessage: data
                  })
                )
              }
            };
          }
          if (item.dataChannel !== null) {
            handleDataChannel(item.dataChannel)
            item.peerConnection.ondatachannel = handleDataChannel
          }
        })
      }, [100])
    }
  })

  useEffect(() => {
    const scrollToLatestMsg = () => {
      let objDiv = document.getElementById("scroll-content")
      objDiv.scrollTop = objDiv.scrollHeight
    }

    scrollToLatestMsg()
  }, [messages])

  return (
    <div className="flex flex-col bg-white p-4 rounded-md h-full justify-between w-full ">
      <div className="w-full">
        <p className="font-bold text-xl">Chat</p>
      </div>

      <div id="scroll-content" className="overflow-y-scroll h-full flex flex-col justify-items-end my-0">
        {
          messages.map((msg, index) => {
            return (
              <MessageItem
                time={msg?.time}
                message={msg?.msg}
                sender={msg?.sender}
                key={index.toString()}
                isOwnMsg={msg?.sender == userName}
              />
            )
          })
        }

      </div>

      <div className="relative">
        <input
          id="chat-input"
          type="text"
          tabIndex={0}
          ref={inputRef}
          onKeyDown={onInputEnter}
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
