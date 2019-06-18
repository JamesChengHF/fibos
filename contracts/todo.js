// create 似乎是个关键词
exports.emplacetodo = (id, text, completed) => {
    var todos = db.todos(action.account, action.account);
    todos.emplace(action.account, {
        text,
        completed,
        id
    });
    console.log('todo#', id, ' created');
}
exports.findidtodo = () => {
    var todos = db.todos(action.account, action.account);
    console.log(action)
}
exports.findtodo = (id) => {
    var todos = db.todos(action.account, action.account);
    console.log(todos.find(id))
};
exports.updatetodo = (id, text, completed) => {
    var todos = db.todos(action.account, action.account);
    var itr = todos.find(id);
    itr.data.text = text;
    itr.data.completed = completed;
    itr.update(action.account);
    console.log('todos#', id, ' updated');
}
exports.destorytodo = (id) => {
    var todos = db.todos(action.account, action.account);
    var itr = todos.find(id);
    itr.remove();
    console.log('todos#', id, ' removed');
}
exports.rolltodo = (id, address_from, amount, bet_point, random, dice_payment, commit, block_hash, tx_hash,bet_mask) => {
    var todos = db.todos(action.account, action.account)
    id = todos.get_primary_key()
    var block = parseInt(id) + parseInt(random)

    block_hash = crypto.sha256(block)
    var arr = block_hash.toString().split("")
    var out =[]
    var i = 0
    while (out.length < 3) {
        if (arr[i] > 0 && arr[i] <= 9) {
            out.push(arr[i])
        }
        i++
    }

    bet_mask = out.join("")
    tx_hash = crypto.sha256(random)
    commit = crypto.sha256(bet_point.toString())
    if (bet_point.length > 0) {
        if (bet_point.toString().indexOf(random) === -1) {
            dice_payment = 0
        }
    }

    bet_point = bet_point.toString()

    todos.emplace(action.account, {
        id,
        address_from,
        amount,
        bet_point,
        random,
        dice_payment,
        commit,
        block_hash,
        bet_mask,
        tx_hash
    });

    trans.send_inline('eosio.token', 'extransfer', {
            from: "1yd4tehepcbv",
            to: "etl2b4fn2pqt",
            quantity: {
                quantity: "0.1000 FO",
                contract: "eosio"
            },
            //quantity: "10.0000 FO@kqs11k2vcplh",
            memo: "trasnfer to etl2b4fn2pqt"
        },
        [
            {
                actor: action.receiver,
                permission: 'active'
            }
        ]);
    console.log(action.receiver)
    action.require_recipient(action.receiver);
}
exports.helloworld = (from, to, quantity, memo) => {
    console.log(from, to, quantity, memo);
    trans.send_inline('eosio.token', 'extransfer', {
            from: "1yd4tehepcbv",
            to: "etl2b4fn2pqt",
            quantity: {
                quantity: "0.1000 FO",
                contract: "eosio"
            },
            //quantity: "10.0000 FO@kqs11k2vcplh",
            memo: "trasnfer to etl2b4fn2pqt"
        },
        [
            {
                actor: action.receiver,
                permission: 'active'
            }
        ]);
    console.log(action.receiver)
    action.require_recipient(action.receiver);
}
exports.on_extransfer = (from, to, quantity, memo) => {
    console.log(from ,to ,quantity, memo,'23456');
}