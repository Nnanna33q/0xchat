export default function formatDate(date) {
    if(date.getDate() === new Date().getDate() && date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear()) {
        return 'Today';
    } else if( (new Date().getDay() - date.getDay() === 1) && (new Date().getMonth() === date.getMonth()) && (new Date().getFullYear() === date.getFullYear()) ) {
        return 'Yesterday';
    } else {
        // Construct the date (world date format)
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }
}

export function formatTime(date) {
    let hour = date.getHours();
    let minutes = date.getMinutes();
    if(`${hour}`.length === 1) {
        hour = '0' + hour;
    }
    if(`${minutes}`.length === 1) {
        minutes = '0' + minutes
    }
    return `${hour}:${minutes}`;
}