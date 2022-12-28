import { useSelector } from "react-redux"
import { selectAudio, selectVideo } from "../redux/slices/ConnectionSlice"

const MY_IP_ADDRESS = "10.10.10.190"
const SERVER_URL = `https://zeams-app.herokuapp.com/` //'http://10.10.10.190:3001'
// const SERVER_URL = "http://192.168.107.28:3001"

export { SERVER_URL }

export const SERVERS = {
  iceServers: [
    {
      urls: "stun:relay.metered.ca:80",
    },
    {
      urls: "turn:relay.metered.ca:80",
      username: "b7c8e882b6a18fac9c355430",
      credential: "gxKFYWnICH7BX7cM",
    },
    {
      urls: "turn:relay.metered.ca:443",
      username: "b7c8e882b6a18fac9c355430",
      credential: "gxKFYWnICH7BX7cM",
    },
    {
      urls: "turn:relay.metered.ca:443?transport=tcp",
      username: "b7c8e882b6a18fac9c355430",
      credential: "gxKFYWnICH7BX7cM",
    },
  ],

  iceCandidatePoolSize: 10,
}

export const MEDIA_CONSTRAINTS = {
  audio: selectAudio ? true : false,
  video: selectVideo
    ? {
        frameRate: 60,
        facingMode: "user", // 'user'
        width: { min: 600, ideal: 1920, max: 1920 },
        height: { min: 300, ideal: 1080, max: 1080 },
      }
    : false,
}

export const SESSION_CONSTRAINTS = {
  offerToReceiveAudio: true,
  offerToReceiveVideo: true,
}

export const DISPLAY_MEDIA_CONSTRAINTS = {
  video: {
    cursor: "always",
  },
  audio: false,
}
