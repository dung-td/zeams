import {useRef, useEffect, useLayoutEffect, useState} from 'react'
import { SketchPicker } from 'react-color'
import { useDispatch, useSelector } from 'react-redux'
import { addPoint } from '../redux/slices/DrawSlice'

const Whiteboard = ({visible, roomId, setVisible, otherPeers, connection}) => {
  let contextRef = useRef()
  // let contextBufferedRef = useRef()
  let lastPoint = useRef()
  let currentForce = useRef(1)
  let colorRef = useRef()
  let canvasRef = useRef(null)
  let pointDraw = useRef(0)
  const [isEraser, setIsEraser] = useState(false)
  const eraser = useRef(false)
  const dispatch = useDispatch()
  const store = useSelector(state => state.draw)
  // let canvasBuffered = useRef(null)
  
  const [showPickerColor, setShowPickerColor] = useState(false)
  const [color, setColor] = useState('#000000')
  
  const arrPoint = useRef([])
  const randomColor = () => {
    return color;
  }
  
  const force = (e) => {
    currentForce.current = e.webkitForce || 1;
  }

  const draw = (data) => {
    contextRef.current.beginPath();
    contextRef.current.moveTo(data.lastPoint.x, data.lastPoint.y);
    contextRef.current.lineTo(data.x, data.y);
    contextRef.current.strokeStyle = data.color;
    contextRef.current.lineWidth = (!data.eraser) ? 2 : 10;
    // contextRef.current.strokeWidth = 100;
    contextRef.current.lineCap = 'round';
    contextRef.current.stroke();
    // contextRef.current.drawImage(canvasBuffered.current, 0, 0)
  }


  // useEffect(() => {
  //   if (contextRef.current !== undefined && contextRef.current !== null) {
  //     // contextRef.current.clearRect(0, 0,  canvasRef.current.width,  canvasRef.current.height);
  //   }

  //   // arrPoint.current.forEach(item => {
  //   //   draw(item)
  //   // })
    
  //   if (data !== undefined && data !== null) {
  //     for (let i = pointDraw; i < data.length; i++) {
  //       draw(data[i])
  //     }
  //     pointDraw.current = data.length
  //   }

  // }, [data])

  // let clearRef2 = useRef()
  // const handleDraw = () => {
  //   // console.log(arrPoint)
  //   clearTimeout(clearRef2.current)
  //   clearRef2.current = setTimeout(() => {
  //     setOtherPeerDrawData(arrPoint.current)
  //     arrPoint.current = []
  //   }, 300)
  // }

  const move = (e) => {
    const x = e.clientX - 30 * window.innerWidth / 200
    const y = e.clientY - 35 * window.innerHeight / 200
    // const x = e.clientX
    // const y = e.clientY
    
    if (e.buttons) {
      if (x < 0 || y < 0) {
        lastPoint.current = undefined
        return
      }
      if (!lastPoint.current) {
        lastPoint.current = { x: x, y: y };
        return;
      }
      console.log( { x: x, y: y })
      
      let dataRaw = {
        lastPoint: lastPoint.current,
        x: x,
        y: y,
        eraser: eraser.current,
        // force: force,
        color: (eraser.current) ? 'white' : color
      }
      // }

      draw(dataRaw)

      connection.emit("message", JSON.stringify({
        type: 'drawing',
        roomId,
        data: dataRaw
      }))

      // let arr = arrPoint.current
      // arr.push(dataRaw)
      // arrPoint.current = [...arr]

      dispatch(addPoint({
        data: dataRaw
      }))

      // arrPoint.current = [...arr]
      // handleDraw()
      otherPeers?.map(item => {
        item.dataChannel.send(JSON.stringify(
          dataRaw
        ))
      })
      lastPoint.current = { x: x, y: y };
    } else {
      lastPoint.current = {}
    }
  }

  useLayoutEffect(() => {
    if (canvasRef.current === null || canvasRef.current === undefined)
      return

    const changeSizeWindow = () => {
      if (canvasRef.current === null || canvasRef.current === undefined)
        return
      canvasRef.current.width = 70 * window.innerWidth / 100
      canvasRef.current.height = 65 * window.innerHeight / 100
      contextRef.current =  canvasRef.current.getContext('2d')
      contextRef.current.clearRect(0, 0,  canvasRef.current.width,  canvasRef.current.height);
      
      // arrPoint.current?.map(item => {
      //   draw(item)
      // })
      store?.arrPoint?.map(item => {
        draw(item)
      })
      // if (data !== undefined && data !== null) {
      //   data.map(item => {
      //     draw(item)
      //   })
      // }
    }

    canvasRef.current.width = 70 * window.innerWidth / 100
    canvasRef.current.height = 65 * window.innerHeight / 100
    contextRef.current =  canvasRef.current.getContext('2d')
    contextRef.current.clearRect(0, 0,  canvasRef.current.width,  canvasRef.current.height);

    colorRef.current = randomColor()

    store?.arrPoint?.map(item => {
      draw(item)
    })
    // arrPoint.current?.map(item => {
    //   draw(item)
    // })

    window.onresize = changeSizeWindow

    // 
    setInterval(() => {
      if (otherPeers.length > 0) {
        otherPeers?.map(item => {
          const handleDataChannel = (dataChannel) => {
            // const dataChannel = item.dataChannel
            dataChannel.onmessage = (event) => {
              dispatch(addPoint({
                data: JSON.parse(event.data)
              }))
              draw(JSON.parse(event.data))
            };
          }
          if (item.dataChannel !== null) {
            handleDataChannel(item.dataChannel)
            item.peerConnection.ondatachannel = handleDataChannel
          }
        })
      }
      }, [300])
  })
  
  let countChange = useRef(0)
  useEffect(() => {
    if (countChange.current < 2) {
      console.log("!!!", store.arrPoint)
      store?.arrPoint?.map(item => {
        draw(item)
      })
    }
    if (store?.arrPoint?.length > 0) 
      countChange.current = 2
  }, [store])

  return (
    <>
    {
      (
        <div style={{
          visibility: (visible) ? 'visible' : 'hidden',
          position: 'fixed',
          zIndex: '999',
          width: '100vw',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <div
            className="rounded"
            style={{
              backgroundColor: 'white',
              width: '70%',
              height: '70%'
            }}
          >
            <div 
              style={{
                width: '100%',
                backgroundColor: '#e5e7eb'
              }}
              className='rounded flex justify-between p-1'
            >
              <div className='flex'>
                <span 
                  className="material-icons text-black mr-1 cursor-pointer"
                  onClick={() => setShowPickerColor(!showPickerColor)}
                >app_registration</span>
                <span 
                  className={`material-icons pr-1 cursor-pointer`}
                  style={{
                    color: (isEraser) ? 'red' : 'black'
                  }}
                  onClick={() => {
                    setIsEraser(!isEraser)
                    eraser.current = !eraser.current
                  }}
                >delete_sweep</span>
              </div>
              <div>
                <span 
                  className="material-icons text-red-500 pr-1 cursor-pointer"
                  onClick={() => setVisible()}
                >close</span>
              </div>
            </div>
            {
              showPickerColor && (
                <div
                  style={{
                    zIndex: '999',
                    position: 'absolute'
                  }}
                >
                  <SketchPicker 
                    color={ color }
                    onChangeComplete={ (color) => setColor(color.hex) }
                  />
                </div>
              )
            }
            <div>
              <canvas 
                ref={canvasRef}
                onMouseMove={e => {
                  // console.log({ x: e.clientX, y: e.clientY })
                  move(e)
                }}
              ></canvas>

            </div>
          </div>
        </div>
      )
    }
    </>
  )
}

export default Whiteboard