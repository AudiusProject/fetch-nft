import { FetchNFTClient } from '@audius/fetch-nft'

// Initialize fetch client
const fetchClient = new FetchNFTClient()

// Fetching all collectibles for the given wallets
fetchClient.getCollectibles({
  ethWallets: ['0x5A8443f456f490dceeAD0922B0Cc89AFd598cec9'],
  solWallets: ['GrWNH9qfwrvoCEoTm65hmnSh4z3CD96SfhtfQY6ZKUfY']
}).then(res => console.log(JSON.stringify(res, null, 2)))
