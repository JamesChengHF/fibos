import React, {Component} from 'react'
import Header from './header'
import MainSection from './main-section'
// import EOS from 'eosjs'
import FIBOS from 'fibos.js'
import config from '../../config'

// const eosClient = EOS(config.clientConfig)
const fibosClient = FIBOS(config.client)

const initialState = [
    {
        text: 'React ES6 TodoMVC',
        completed: 0,
        id: 0
    }
]

if (module.hot) {
    module.hot.accept();
}

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            todos: [] || initialState,
            gameID: null,
            player: 0,
            gameTip: '请确认投注交易:',
            play: true
        }
        this.fetchTodo()
    }

    rollDice = (amount, bet_point, dice_payment, bid_pays) => {

        fibosClient.contract('eosio').then((contract)=>{
            contract.updateauth({
                account: config.contract.name,
                permission: 'active',
                parent: 'owner',
                auth: {
                    threshold: 1,
                    keys: [{
                        key:config.account.publicKey,
                        weight: 1
                    }],
                    accounts: [{
                        permission: {
                            // 将调用者账号的 eosio.code 授权添加到它的 active 权限下。
                            actor: config.contract.name,
                            permission: 'eosio.code'
                        },
                        weight: 1
                    }]
                }
            },{
                authorization: `${config.contract.name}@owner` // 私钥对应的账号
            })
        })


        fibosClient.contract(config.contract.name).then((contract) => {
            let storage = window.localStorage;
            var address_from = "etl2b4fn2pqt"
            let id = 1
            let length = this.state.todos.length
            if (length > 0) {
                let _id = length - 1
                id = this.state.todos[_id].id + 1
                if (length === 10) {
                    storage.setItem('id', this.state.todos[_id].id)
                }
            }
            var random_true = 0
            fetch(
                'https://www.random.org/integers/?num=1&min=1&max=6&col=1&base=8&format=plain'
            ).then(res => res.json()).then(random => {
                let commit = 0, block_hash = 0, tx_hash = 0, bet_mask = 0
                random_true = random
                let quantity = (dice_payment / 1000000).toFixed(4) + ' FO@' + config.contract.name
                let meno = '押：' + bet_point + ' ' + '赔率：' + bid_pays + '' + '投注：' + (amount / 1000000).toFixed(4) + '赢：' + (dice_payment / 1000000).toFixed(4)
                contract.helloworld(config.contract.name,address_from,quantity,meno,{authorization: [config.contract.sender]})
                contract.rolltodo(
                    {
                        bet_mask,
                        tx_hash,
                        block_hash,
                        address_from,
                        amount,
                        bet_point,
                        random,
                        dice_payment,
                        commit,
                        id
                    },
                    {authorization: [config.contract.sender]}
                ).then((result) => {
                    let quantity = (dice_payment / 1000000).toFixed(4) + ' FO@' + config.contract.name
                    let meno = '押：' + bet_point + ' ' + '赔率：' + bid_pays + '' + '投注：' + (amount / 1000000).toFixed(4) + '赢：' + (dice_payment / 1000000).toFixed(4)
/*                    contract.helloworld(
                        {
                            from:config.contract.name,
                            to:address_from,
                            quantity:quantity,
                            meno:meno.toString()
                        },
                        {authorization: [config.contract.sender]}
                    )*/
                    console.log(quantity)
                    console.log(meno)
                    if (bet_point.indexOf(random_true) !== -1) {

                                                fibosClient.contract('eosio.token').then(
                                                    (contract) => {
                                                        contract.transfer(
                                                            config.contract.name,
                                                            address_from,
                                                            quantity,
                                                            meno
                                                            ,
                                                            {
                                                                authorization: config.contract.sender // 私钥对应的账号
                                                            }
                                                        ).then((transaction) => {
                                                            setTimeout(() => {
                                                                this.setState({
                                                                    gameTip: '恭喜您',
                                                                    play: false
                                                                })
                                                            })
                                                            return transaction.transaction_id
                                                        })
                                                    }
                                                )
                    } else {
                        setTimeout(() => {
                            this.setState({
                                gameTip: '不要气馁，还有机会',
                                play: false
                            })
                        }, 2000);
                    }

                    /*                    axios
                                            .post('addItem', {
                                                id: 12,
                                                address_from: address_from,
                                                amount: amount,
                                                bet_point: bet_point,
                                                random: random_true,
                                                dice_payment: dice_payment,
                                                commit: 1,
                                                block_hash: 1,
                                                bet_mask: 1,
                                                tx_hash: 1
                                            })
                                            .then(res => {
                                                console.log(res)
                                            })
                                            .catch(err => {
                                                console.log(err)
                                            })*/
                })
                    .catch((err) => {
                        console.log(err)
                    })
            })
        })
    }

    changeGameTip = (tip) => {
        this.setState({
            gameTip: tip,
            play: true
        })
    }

    fetchTodo = () => {
        var storage = window.localStorage;
        var id = storage.getItem('id')
        if (!id) {
            id = 0
            storage.setItem('id', id)
        }
        /*        fetch('getAllItems')
                    .then(res => res.json())
                    .then(response => {
                        console.log(response)
        /!*                response.forEach(function (item,key) {
                            console.log(FIBOS.deserializeActionData(config.contract,item['act']['account'],item['act']['name'],Uint8Array ,item['act']['data']))
                        })*!/
                    })*/
        //84000000000000000c65746c326234666e32707174a08601000000000005332c342c35060000000000000088780400000000000130013000000000000000000130
        fibosClient.getTableRows(
            true,
            config.contract.sender,
            config.contract.name,
            'todos',
            20,
            id).then((data) => {
            console.log(data)
            let length = data.rows.length
            if (length > 0) {
                let _id = length - 1
                if (length === 10) {
                    storage.setItem('id', data.rows[_id].id)
                }
            }
            this.setState({todos: data.rows})
        }).catch((e) => {
                console.error(e)
            }
        )
    }

    /*    addTodo = (text) => {
            const todo_id = this.state.todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1
            fibosClient.contract(config.contract.name).then((contract) => {
                contract.emplacetodo(
                    {
                        id: todo_id,
                        text,
                        completed: 0
                    },
                    {authorization: [config.contract.sender]}
                ).then((res) => {
                        const todos = [
                            {
                                id: todo_id,
                                completed: 0,
                                text: text
                            },
                            ...this.state.todos
                        ]
                        this.setState({todos})
                    }
                )
                    .catch((err) => {
                        console.log(err)
                    })
            })
        }

        deleteTodo = (id) => {
            fibosClient.contract(config.contract.name).then((contract) => {
                contract.destorytodo(
                    {
                        id
                    },
                    {authorization: [config.contract.sender]}
                ).then((res) => {
                    const todos = this.state.todos.filter(todo => todo.id !== id)
                    this.setState({todos})
                })
                    .catch((err) => {
                        console.log(err)
                    })
            })
        }

        editTodo = (id, text) => {
            const todo_item = this.state.todos.find((el) => el.id === id)
            if (!todo_item) {
                return
            }
            fibosClient.contract(config.contract.name).then((contract) => {
                contract.updatetodo(
                    {
                        id: id,
                        text,
                        completed: todo_item.completed
                    },
                    {authorization: [config.contract.sender]}
                ).then((res) => {
                        const todos = this.state.todos.map(todo =>
                            todo.id === id ? {...todo, text} : todo
                        )
                        this.setState({todos})
                    }
                )
                    .catch((err) => {
                        console.log(err)
                    })
            })
        }*/

    /*    completeTodo = (id) => {
            const todo_item = this.state.todos.find((el) => el.id === id)
            if (!todo_item) {
                return
            }
            fibosClient.contract(config.contract.name).then((contract) => {
                contract.updatetodo(
                    {
                        id: id,
                        text: todo_item.text,
                        completed: todo_item.completed === 1 ? 0 : 1
                    },
                    {authorization: [config.contract.sender]}
                ).then((res) => {
                        const todos = this.state.todos.map(todo =>
                            todo.id === id ? {...todo, completed: !todo.completed} : todo
                        )
                        this.setState({todos})
                    }
                )
                    .catch((err) => {
                        console.log(err)
                    })
            })
        }

        clearCompleted = () => {
            const todos = this.state.todos.filter(todo => todo.completed === 0)
            this.setState({todos})
        }*/

    actions = {
        addTodo: this.addTodo,
        deleteTodo: this.deleteTodo,
        editTodo: this.editTodo,
        completeTodo: this.completeTodo,
        clearCompleted: this.clearCompleted
    }

    render() {
        return (
            <div>
                {/*<Header addTodo={this.actions.addTodo} />*/}
                <MainSection todos={this.state.todos} actions={this.actions} rollDice={this.rollDice}
                             gameTip={this.state.gameTip} changeGameTip={this.changeGameTip} play={this.state.play}/>
            </div>
        )
    }
}

export default App