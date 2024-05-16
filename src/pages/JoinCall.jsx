import { useRef, useState } from "react";
import SimplePeer from "simple-peer/simplepeer.min.js";

function JoinCall() {

    const peer1 = useRef(null)
    const offer = useRef(null)
    const [answer, setAnswer] = useState('')

    const joinCall = () => {
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then(connect).catch(() => { })
    }

    const connect = (stream) => {
        peer1.current = new SimplePeer({
            initiator: false,
            trickle: false,
            stream: stream
        })
        peer1.current.on('signal', data => {
            setAnswer(JSON.stringify(data))
            console.log('peer1 signal', data)
        })
        peer1.current.on('connect', () => {
            console.log('peer1 connected')
        })
        peer1.current.on('stream', stream => {
            // got remote video stream, now let's show it in a video tag
            var video = document.querySelector('video')

            if ('srcObject' in video) {
                video.srcObject = stream
            } else {
                video.src = window.URL.createObjectURL(stream) // for older browsers
            }

            video.play()
        })
        peer1.current.on('error', err => {
            console.log('peer1 error', err)
        }
        )
        peer1.current.on('close', () => {
            console.log('peer0 closed')
        })
        peer1.current.signal(offer.current)
    }

    return (
        <div className="flex flex-col gap-10">
            <video ></video>
            <input type="text" placeholder="offer"
                className="block w-full rounded-md py-1.5 pl-7 pr-20 ring-1 ring-inset ring-gray-300 text-center"
                onChange={e => offer.current = e.target.value}
            />
            <button onClick={joinCall}>
                Connect
            </button>
        </div>
    );
}

export default JoinCall;
