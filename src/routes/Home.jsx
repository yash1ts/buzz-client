import React from 'react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import SimplePeer from 'simple-peer/simplepeer.min.js'

function Home() {

    return (
        <>
            <h1>Buzz</h1>
            <div className="flex flex-col gap-5 m-10">

                <Link to={'new'}>
                    <button>
                        Start a new Call
                    </button>
                </Link>

                <Link to={'join'}>
                    <button>
                        Join a Call
                    </button>
                </Link>
            </div>
        </>
    )
}

export default Home
