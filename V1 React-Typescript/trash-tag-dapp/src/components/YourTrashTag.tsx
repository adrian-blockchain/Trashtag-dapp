import Web3 from "web3";
import TrashTag from "../build/contracts/TrashTag.json"
import React, {useEffect, useState} from "react";
import TrashTagRendering from "./TrashTagRendering";

declare const window: any;
export const YourTrashTag = ()=> {


    const [amountNFT, setAmountNFT] = useState<number>()
    let [loading, setLoading] = useState<boolean>(true);
    const [account, setAccount] = useState<string>('')
    const [contract, setContract] = useState<any>()


    const ViewNFT = ()=> {
        try {
            const view = async ()=>{
                const AmountNFT: number = await contract.methods.getAmountNFT(account).call({from: account})
                setAmountNFT(AmountNFT)
                console.log(AmountNFT)

                let i: number;
                let uris: string[] = []
                console.log("Avant boucle")


                for (i = 1; i <= AmountNFT; i++) {
                    let cid = contract.methods.getURI(i).call(
                        {from: account})
                    // @ts-ignore
                    uris.push(cid)
                }
                console.log("Après boucle")


            }
            view()


        } catch (e) {
            console.log(e)
        }
        return null;

    }




    const componentWillAmount = async () => {

        if (loading == true){
            await loadWeb3();
            await loadBlockchaindata()
            setLoading(false)

        }
    }


    const loadWeb3 = async () => {
        if (window.ethereum) {

            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        } else if (window.web3) {
            console.log("Web 3")
            window.web3 = new Web3(window.web3.currentProvider)
        } else {
            window.alert('No blockchain wallet detected, download metamask')
        }
    }
    const loadBlockchaindata = async () => {
        const web3 = window.web3;
        let stop:boolean = false;

        //Load account
        const accounts = await web3.eth.getAccounts()
        setAccount(accounts[0]);
        console.log(account)
        const networkId = await web3.eth.net.getId()

        // @ts-ignore
        const networkData: any = TrashTag.networks[networkId]

        console.log(networkData)
        if (networkData) {

            const abi = TrashTag.abi;
            const Contract = await new web3.eth.Contract(abi, networkData.address)
            setContract(Contract)
            console.log(Contract)
        } else {
            window.alert('Contract is not deployed on a detected network')
        }
    }
    componentWillAmount();



            return <div>
                {contract == undefined ?  <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
                    :
                    <div>
                    <h2>Amount of trashtag NFT:{amountNFT}</h2>

                    <ViewNFT/>


                    </div>


                }</div>



}


export default YourTrashTag;