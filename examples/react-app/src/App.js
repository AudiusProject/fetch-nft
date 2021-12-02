import React, { useEffect, useState } from 'react';
import './App.css';

import { FetchNFTClient } from '@audius/fetch-nft'

// Initialize fetch client
const fetchClient = new FetchNFTClient()

const App = () => {
  const [collectibles, setCollectibles] = useState(null)
  useEffect(() => {
    // Fetching all collectibles for the given wallets
    fetchClient.getCollectibles({
      ethWallets: ['0x5A8443f456f490dceeAD0922B0Cc89AFd598cec9'],
      solWallets: ['GrWNH9qfwrvoCEoTm65hmnSh4z3CD96SfhtfQY6ZKUfY']
    }).then(res => setCollectibles(res))
  }, [])

  return (
    <div className="App">
      <div className="Header">Eth Collectibles</div>
      {
        collectibles?.ethCollectibles['0x5A8443f456f490dceeAD0922B0Cc89AFd598cec9']
          .map(collectible => (
            <div className="Collectibles">
              <div className="Name">{collectible.name}</div>
              <img className="Image" src={collectible.frameUrl || collectible.gifUrl} alt={collectible.name} />
            </div>
          ))
      }
      <div className="Header">Solana Collectibles</div>
      {
        collectibles?.solCollectibles['GrWNH9qfwrvoCEoTm65hmnSh4z3CD96SfhtfQY6ZKUfY']
          .map(collectible => (
            <div className="Collectibles">
              <div className="Name">{collectible.name}</div>
              <img className="Image" src={collectible.frameUrl || collectible.gifUrl} alt={collectible.name} />
            </div>
          ))
      }
    </div>
  );
}

export default App;
