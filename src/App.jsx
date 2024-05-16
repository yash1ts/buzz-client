import React from 'react'
import { useEffect, useRef, useState } from 'react'
import './App.css'
import SimplePeer from 'simple-peer/simplepeer.min.js'

function App() {
  const userId = useRef(Math.random().toString(36).substring(7))
  const offer = useRef(null)
  const answer = useRef(null)
  const peer0 = useRef(null)

  const sendRequest = () => {
    peer0.current = new SimplePeer({ initiator: true, trickle: false })
    peer0.current.on('signal', data => {
      console.log('peer0 signal', data)
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
    <>
      <h1>Buzz</h1>
      <div className="card">
        //set answer to input on change
        <button onClick={sendRequest}>
          Start call
        </button>
        <input type="text" onChange={e => { answer.current = e.target.value }} />
        <button onClick={connect}>
          Join call
        </button>
      </div>
    </>
  )
}

export default App
