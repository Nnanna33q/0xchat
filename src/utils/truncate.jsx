// Truncates Address
export function truncateAddress(text) {
    const splitAddress = text.split('');
    const lettersArray = splitAddress.filter((v, i) => {
        if(i <= 8 || i > 35) {
            return v
        }
    })

    return lettersArray.map((v, i) => i === 7 ? '...' : v).join('');
}

// Truncates long message
export function truncateMessage(message) {
    const splitMessage = message.split('');
    const truncatedMessage = splitMessage.filter((v, i) => i < 20).join('');
    return message.length > 20 ? truncatedMessage + '...' : message;
}