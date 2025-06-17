import mongoose from "mongoose";

const cryptoRequestSchema = mongoose.Schema({
    donor: String,
    recipient: String,
    contractAddress: String,
    amount: Number,
    name: String,
    symbol: String,
    network: String,
    chainId: Number,
    decimal: Number,
    date: Date
})

export const CryptoRequest = mongoose.model('CryptoRequest', cryptoRequestSchema);