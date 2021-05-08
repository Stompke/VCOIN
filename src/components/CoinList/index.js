import React, { useState, useEffect } from 'react';
import styles from './index.module.scss';
import localforage from 'localforage';

import axios from 'axios';

const initialCoinData = [
    {
        name: 'Bitcoin',
        price: 34149.10,
        amount: .25907,
        asset_id: 'BTC',
    },
    {
        name: 'Cardano',
        price: 0.25105,
        amount: 424.16016288,
        asset_id: 'ADA',
    },
    {
        name: 'Ethereum',
        price: 1102.46,
        amount: 6.40423724,
        asset_id: 'ETH',
    },
    {
        name: 'ChainLink',
        price: 14.67,
        amount: 18.3536867,
        asset_id: 'LINK',
    },
    {
        name: 'PolkaDot',
        price: 9.7640,
        amount: 14.0859,
        asset_id: 'DOT',
    },
    {
        name: 'Stellar Lumens',
        price: .198,
        amount: 6698.2144298,
        asset_id: 'XLM',
    },
    {
        name: 'VeChain',
        price: 0.027651,
        amount: 13169.44688323,
        asset_id: 'VET',
    },

]

// const portfolio = {
//     BTC: .25907,
//     ADA: 424.16016288,
//     ETH: 6.40423724,
//     LINK: 18.3536867,
//     DOT: 14.0859,
//     XLM: 6698.2144298,
//     VET: 13169.44688323
// }
const portfolio = {
    ETH: 49,
    BTC: .6,
    XLM: 15000,
    DOT: 254,
    LINK: 37,
    XRP: 1500,
    ADA: 39000,
    VET: 73000,
    DASH: 11,
    UNI: 302,
    COMP: 8,
}

const importantCoins = ["BTC", "ADA", "ETH", "LINK", "DOT", "XLM", "VET", "XRP", "DASH", "UNI", "COMP"]


const CoinList = () => {
    const [ coins, setCoins ] = useState(initialCoinData)
    const [total, setTotal ] = useState(0.00)
    // const [ coinPrices, setCoinPrices ] = useState([])


    const updateCoinPrices = () => {
        console.log('UPDATED!')
        let totalAssets = 0


        localforage.getItem('latestCoinPrices')
        .then(res => {
            let updatedCoinData = []
            updatedCoinData = res.map(coinData => {
                return {
                    ...coinData,
                    price_usd: coinData.price_usd || 0,
                    amount: portfolio[coinData.asset_id]
                }
            })

            setCoins(updatedCoinData)


            updatedCoinData.forEach(coin => totalAssets += (coin.amount*coin.price_usd))
            setTotal(Math.ceil(totalAssets * 100) / 100)

        })
        .catch( err => {
            console.log(err)
        })
    }
    useEffect(() => {
        updateCoinPrices()
    },[])


    const getPrices = () => {
        setTotal(0)
        axios.get('https://rest.coinapi.io/v1/assets', {
            headers: {
            'X-CoinAPI-Key': process.env.REACT_APP_API_KEY
            }
            })
            .then(async res => {
                console.log('loaded prices: ', res)
                // setCoinPrices(res.data)

                let myCoinList = []
                res.data.map(item => importantCoins.includes(item.asset_id) && myCoinList.push(item))
                console.log(myCoinList)
                await localforage.setItem('latestCoinPrices', myCoinList)

                updateCoinPrices()
            })
            .catch( err => {
                console.log('dang it: ', err)
            })
    }

    return (
        <>
        <h1>Total Assets: {total}</h1>
        <button onClick={getPrices}>Get Live Data</button>
        {coins.map(coin => 
        <div key={coin.name} className={styles.coinContainer}>
            <div>{coin.name}</div>

                <div>Current Price: {coin.price_usd}</div>
                <div>Amount Held: {coin.amount}</div>
                <div>Total Worth (usdt): ${Math.ceil(coin.amount * coin.price_usd * 100) / 100}</div>

        </div>
        )}

        </>
    )
}

export default CoinList;