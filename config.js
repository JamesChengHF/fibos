const config = {
    client: {
        chainId: '68cee14f598d88d340b50940b6ddfba28c444b46cd5f33201ace82c78896793a',
        httpEndpoint: 'http://api.testnet.fo',
        keyProvider: process.env.PRIVATE_KEY || '5KX8ct45Aj5v9162sjwCkAG8nshnWFVPSeD82wGDUC7Bg2pcobv'
    },
    contract: {
        name: '1yd4tehepcbv',
        sender: '1yd4tehepcbv'
    },
    testContract:{
        name: 'testtodo',
        sender: 'testtodo'
    },
    account: {
        publicKey: process.env.PUBLIC_KEY || 'FO6bTgPYABcgVJuVRhFJj4EwBsYrgdccXhMN117vR31Np3ZeZQnw',
        privateKey: process.env.PRIVATE_KEY || 'FO6bTgPYABcgVJuVRhFJj4EwBsYrgdccXhMN117vR31Np3ZeZQnw'
    }
}

module.exports = config