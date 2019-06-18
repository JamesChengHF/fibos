const config = {
    client: {
        chainId: '68cee14f598d88d340b50940b6ddfba28c444b46cd5f33201ace82c78896793a',
        httpEndpoint: 'http://api.testnet.fo',
        keyProvider: process.env.PRIVATE_KEY || '5JpWX9quWbLPUXt23JPixzCMQU4sWrFoHeLDg7gRSnGrLrGsPPB'
    },
    contract: {
        name: 'kqs11k2vcplh',
        sender: 'kqs11k2vcplh'
    },
    testContract:{
        name: 'testtodo',
        sender: 'testtodo'
    },
    account: {
        publicKey: process.env.PUBLIC_KEY || 'FO5hGhhcM8U9dWSa86C46NZiGAEgeVRBVAKBehsw968GvkXuoFVJ',
        privateKey: process.env.PRIVATE_KEY || 'FO5hGhhcM8U9dWSa86C46NZiGAEgeVRBVAKBehsw968GvkXuoFVJ'
    }
}

module.exports = config