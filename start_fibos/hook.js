let defines = [db => {
    return db.define('eosio_token_transfers', {
        from: {
            required: true,
            type: "text",
            size: 12
        },
        to: {
            required: true,
            type: "text",
            size: 12
        },
        quantity: {
            required: true,
            type: "text",
            size: 256
        },
        memo: {
            type: "text",
            size: 256
        }
    }, {
        hooks: {},
        methods: {},
        validations: {},
        functions: {},
        ACL: function(session) {
            return {
                '*': {
                    find: true,
                    read: true
                }
            };
        }
    });
}];

let hooks = {
    "kqs11k2vcplh/helloworld": (db, messages) => {
        let eosio_token_transfers = db.models.eosio_token_transfers;
        console.error(messages)
        try {
            db.trans(() => {
                messages.forEach((m) => {
                    eosio_token_transfers.createSync(m.data);
                });
            });
        } catch (e) {
            console.error("eosio.token/transfer Error:", e);
        }
    },
    "eosio.token":(db, messages)=>{
        console.error(messages)
    }
}

module.exports = {
    defines: defines,
    hooks: hooks
}