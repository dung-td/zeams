const MY_IP_ADDRESS = "10.10.10.190"
const SERVER_URL = `https://zeams-app.herokuapp.com/` //'http://10.10.10.190:3001'
// const SERVER_URL = "http://192.168.107.28:3001"

export { SERVER_URL }

export const SERVERS = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],

  iceCandidatePoolSize: 10,
}

export const MEDIA_CONSTRAINTS = {
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
  },
  video: {
    frameRate: 60,
    facingMode: "user", // 'user'
    width: { min: 600, ideal: 1920, max: 1920 },
    height: { min: 300, ideal: 1080, max: 1080 },
  },
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
