import { server } from "./app.js";
import { WebSocketServer } from "ws";
import { sessionParser } from "./middlewares/session.js";
import { saveMessageForSender, saveMessageForRecipient } from "./utils/saveMessage.js";
import { setMessageStatusForRecipient, setMessageStatusForSender } from "./utils/setMessageStatus.js";
import { setMessageAvatar } from "./utils/setMessageAvatar.js";
import { User } from "./models/userModel.js";
import { ChatData } from "./models/chatsModel.js";
import { CryptoRequest } from "./models/cryptoRequests.js";

const wsMap = new Map();

console.log('wss server');

const wss = new WebSocketServer({ noServer: true });

server.on('upgrade', (req, socket, head) => {
    const socketError = (e) => {
        console.error('A socket error occurred');
        console.error(e);
    }
    socket.on('error', socketError)

    sessionParser(req, {}, () => {
        if (!req.session._address) {
            socket.write('HTTP1.1 401 Unauthorized\r\n\r\n');
            socket.destroy();
            return;
        }
        socket.removeListener('error', socketError);
        wss.handleUpgrade(req, socket, head, (ws) => {
            wss.emit('connection', ws, req);
        })
    })
})

wss.on('connection', async (ws, req) => {
    try {
        wsMap.set(req.session._address, ws);
        console.log('New websocket connection');
        await User.findOneAndUpdate({ address: req.session._address }, { online: true });
        const userChatData = await ChatData.findOne({ owner: req.session._address });
        if(!userChatData) {
            await new ChatData({
                owner: req.session._address,
                chats: []
            }).save();
            return;
        }
        userChatData.chats.forEach(c => {
            wsMap.get(c.address)?.send(JSON.stringify({ onlineStatus: { online: true, address: req.session._address } }));
        })
    } catch (e) {
        console.log('Failed to update user online status to true');
        console.error(e);
    }

    ws.on('error', (e) => {
        console.log('A websocket error occurred');
        console.error(e);
    })

    ws.on('close', async (e) => {
        try {
            console.log('A Websocket connection closed');
            await User.findOneAndUpdate({ address: req.session._address }, { online: false, lastLogin: Date.now() });
            const userChatData = await ChatData.findOne({ owner: req.session._address });
            userChatData.chats.forEach(c => {
                wsMap.get(c.address)?.send(JSON.stringify({ onlineStatus: { online: false, address: req.session._address, lastLogin: Date.now() } }));
            })
            wsMap.delete(req.session._address);
        } catch (e) {
            console.log('Failed to update user online status to false');
            console.error(e);
        }
    })

    ws.on('message', async (data) => {
        const message = JSON.parse(data);

        if(message.cryptoRequest) {
            const { info } = message;
            const cryptoRequest = await new CryptoRequest({
                donor: info.donor,
                recipient: req.session._address,
                contractAddress: info.contractAddress,
                amount: info.amount,
                name: info.name,
                symbol: info.symbol,
                network: info.network,
                chainId: info.chainId,
                decimal: info.decimal,
                date: Date.now()
            }).save();
            
            ws.send(JSON.stringify({
                cryptoRequestSender: true
            }))

            wsMap.get(info.donor)?.send(JSON.stringify({
                cryptoRequest: true,
                info: cryptoRequest
            }))
            return;
        }

        if(message.updateAvatar) {
            try {
                const results = await setMessageAvatar(req.session._address, message.url)
                results.forEach(c => {
                    wsMap.get(c.owner)?.send(JSON.stringify({
                        updateAvatar: true,
                        url: message.url,
                        address: req.session._address
                    }))
                })
            } catch(e) {
                console.error(e);
            }
            return;
        }

        if (message.updateStatus) {
            try {
                await Promise.all([
                    setMessageStatusForRecipient(message.recipient, req.session._address),
                    setMessageStatusForSender(message.recipient, req.session._address)
                ])
                ws.send(JSON.stringify({
                    updateStatus: true,
                    address: message.recipient,
                    statusSetter: true
                }))
                // Notify the original sender of the message
                // req.session._address is the setter of the status
                const recipient = wsMap.get(message.recipient);
                recipient && recipient.send(JSON.stringify({
                    updateStatus: true,
                    address: req.session._address,
                    statusSetter: false
                }))
            } catch (e) {
                console.error(e);
            }
            return;
        }
        const sender = wsMap.get(message.from);
        const recipient = wsMap.get(message.to);
        if (message.text.length > 500) {
            // Doesn't save message to db. Message will be discarded on the client onRefresh
            sender && sender.send(JSON.stringify({
                response: {
                    messageId: message.messageId,
                    status: 'failed',
                    errorMessage: 'Message is over 500 characters long'
                }
            }))
        } else {
            if (!message.text && !message.file) {
                sender && sender.send(JSON.stringify({
                    response: {
                        messageId: message.messageId,
                        status: 'failed',
                        errorMessage: 'No message or media sent'
                    }
                }))
                return;
            }
            // Save message to db for both sender and receiver
            try {
                await Promise.all([saveMessageForSender(message, sender, recipient), saveMessageForRecipient(message, sender, recipient)]);
                sender && sender.send(JSON.stringify({
                    response: {
                        messageId: message.messageId,
                        status: 'delivered'
                    }
                }))
                // Send message to recipient
                recipient && recipient.send(JSON.stringify({
                    received: true,
                    message: {
                        from: message.from,
                        to: message.to,
                        text: message.text,
                        time: message.time,
                        file: message.file,
                        status: 'delivered',
                        mediaType: message.mediaType,
                        messageId: message.messageId
                    }
                }))
            } catch (e) {
                console.error(e);
                sender && sender.send(JSON.stringify({
                    response: {
                        messageId: message.messageId,
                        status: 'failed',
                        errorMessage: 'Failed to send Message'  // Actually failed to save in db
                    }
                }))
                console.log('Sent message to sender');
            }
        }
    })
})