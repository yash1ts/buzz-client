import { ethers } from "ethers";
import abi from "./abi.json";

const MUMBAI_RPC_URL =
  "https://polygon-mumbai.g.alchemy.com/v2/N-3v7WGB2XXpdyKzI6j5u6iqhin-5fIH";
const MUMBAI_WSS_URL =
  "wss://polygon-mumbai.g.alchemy.com/v2/N-3v7WGB2XXpdyKzI6j5u6iqhin-5fIH";

const CONTRACT_ADDRESS = "0xba10b1f82f6A8Abd413DF388C872B7Aa2CAb818E";

const ANSWER = 0;
const OFFER = 1;

export const sendIceRequest = async (to, iceType, data) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, { provider });
    const signer = await provider.getSigner();

    const tx = await contract.connect(signer).sendIce(to, iceType, data);
    console.log("IceRequest sent", tx.hash);
}

export const connectWithMetamaskAccount = async () => {
    if (!window.ethereum) {
        window.alert("Please install MetaMask");
        return;
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);

    const signer = await provider.getSigner();
    console.log(`Connected to metamask account: ${signer.address}`);

    return signer.address;
}

const listenForAnswerFrom = async (address, returnAnswerFunction) => {
    const signer = await connectWithMetamaskAccount();
    const provider = new ethers.BrowserProvider(window.ethereum);

   const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, { provider });
   const filter = contract.filters.IceRequest(address, signer);
   console.log(`Listening for answer from ${address}`);
        contract.once(filter, async (from, to, iceId, event) => {
        console.log("IceRequest", from, to, iceId);
        console.log("Event", event);
        console.log(from.args, from.log, from.log.args, from.log.topics);
        const iceData = await contract.getIceAtIndex(from.logs.args[2])
         const [, iceType, data] = iceData;
         if (iceType === ANSWER) {
              // handle answer
              console.log(`Found answer from ${from}`, data);
              returnAnswerFunction({type: "answer", sdp: data});
         } else {
              // handle offer
                console.log(`Found offer from ${from}`, data);
         }
   });
}

// join: user 2 -> accept offer -> create answer -> send answer
// start: create offer -> wait for answer -> accept answer

// start: create offer, send offer, listen for answer, accept answer
export const initiateOfferTransaction = async (to, offerData, returnAnswerFunction) => {
    console.log(`Sending offer to ${to}`);
    await sendIceRequest(to, OFFER, offerData);
    console.log(`Offer sent to ${to}`);
    listenForAnswerFrom(to, returnAnswerFunction);
}

// join: listen for offer, accept offer, create answer, send answer
export const listenForOffer = async (setOfferFunction) => {
    // accept offer
    // create answer
    // send answer

    const signer = await connectWithMetamaskAccount();
    const provider = new ethers.BrowserProvider(window.ethereum);

   const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, { provider });
   const filter = contract.filters.IceRequest(null, signer);
   console.log(`Listening for offer for ${signer}`);
   contract.once(filter, async (from, to, iceId, event) => {
         console.log("IceRequest", from, to, iceId);
         console.log("Event", event);
         console.log(from.args, from.log, from.log.args, from.log.topics);
         const iceData = await contract.getIceAtIndex(from.logs.args[2])
         console.log("IceRequest data", iceData);
         const [, iceType, data] = iceData;
         if (iceType === OFFER) {
            console.log(`Found offer from ${from}`, data);
            console.log(`Creating answer from offer`);
            setOfferFunction(from, {type: "offer", sdp: data});
         } else {
            console.log(`Found answer from ${from}`, data);
         }
   });
}

export const initiateAnswerTransaction = async (to, answerData) => {
  console.log(`Answer created from offer`, answerData);
  console.log(`Sending answer to ${to}`);
  await sendIceRequest(to, ANSWER, answerData);
  console.log(`Answer sent to ${to}`);
}
