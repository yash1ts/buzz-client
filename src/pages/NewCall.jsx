import { useRef, useState } from "react"
import SimplePeer from 'simple-peer/simplepeer.min.js'
import { initiateOfferTransaction } from "../contracts/utils"

function NewCall() {
    const answer = useRef(null)
    const [offer, setOffer] = useState('')
    const [address, setAddress] = useState('')
    const peer0 = useRef(null)

    const startCall = () => {
        navigator.mediaDevices.getUserMedia({
            video: false,
            audio: true,
        }).then(sendRequest).catch((err) => { console.log(err) })
    }

    const sendRequest = (stream) => {
        peer0.current = new SimplePeer({
            initiator: true,
            trickle: false,
            stream: stream,
        })
        peer0.current.on('stream', stream => {
            // got remote video stream, now let's show it in a video tag
            var video = document.querySelector('video')

            if ('srcObject' in video) {
                video.srcObject = stream
            } else {
                video.src = window.URL.createObjectURL(stream) // for older browsers
            }

            video.play()
        })
        peer0.current.on('signal', data => {
            setOffer(JSON.stringify(data))
            console.log('peer0 signal', data)
            // send offer to address
            address && initiateOfferTransaction(
                address,
                data.sdp,
                peer0.current.signal
            ).then(setAddress);
        })
        peer0.current.on('connect', () => {
            console.log('peer0 connected')
        })
        peer0.current.on('error', err => {
            console.log('peer0 error', err)
        }
        )
        peer0.current.on('close', () => {
            console.log('peer0 closed')
        })
    }

    const connect = () => {
        if (answer.current == null) {
            console.log('answer is null')
            return
        }
        peer0.current.signal(answer.current)
    }
    return (
        <div className="flex flex-col gap-10">
            <video></video>
            <input type="text" placeholder="Send offer to"
                className="block w-full rounded-md py-1.5 px-1 ring-1 ring-inset ring-gray-300 text-center"
                onChange={e => setAddress(e.target.value)}
            />
            <button onClick={startCall} disabled={!address}>
                Wait for answer
            </button>
            {/* <input type="text" placeholder="answer"
                className="block w-full rounded-md py-1.5 pl-7 pr-20 ring-1 ring-inset ring-gray-300 text-center"
                onChange={e => { answer.current = e.target.value }}
            />
            <button onClick={connect}>
                Connect
            </button> */}
        </div>
    );
}

export default NewCall;
