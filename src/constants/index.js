import { selectAudio, selectVideo } from "../redux/slices/ConnectionSlice"

const SERVER_URL = `https://zeams-app.herokuapp.com/` //'http://10.10.10.190:3001'
// const SERVER_URL = `http://localhost:3001/` //'http://10.10.10.190:3001'
// const SERVER_URL = "http://192.168.107.28:3001"

export { SERVER_URL }

export const SERVERS = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },

    // {
    //   urls: "stun:relay.metered.ca:80",
    // },
    // {
    //   urls: "turn:relay.metered.ca:80",
    //   username: "b8f171cabc2c8f9531a81161",
    //   credential: "urxIV1zF2kAAMOSQ",
    // },
    // {
    //   urls: "turn:relay.metered.ca:443",
    //   username: "b8f171cabc2c8f9531a81161",
    //   credential: "urxIV1zF2kAAMOSQ",
    // },
    // {
    //   urls: "turn:relay.metered.ca:443?transport=tcp",
    //   username: "b8f171cabc2c8f9531a81161",
    //   credential: "urxIV1zF2kAAMOSQ",
    // },
  ],

  iceCandidatePoolSize: 10,
}

export const MEDIA_CONSTRAINTS = {
  audio: selectAudio ? true : false,
  video: selectVideo
    ? {
        frameRate: 60,
        facingMode: "user", // 'user'
        width: { min: 1280, max: 1280 },
        height: { min: 720, max: 720 },
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
