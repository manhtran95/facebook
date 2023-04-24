export function getFacebookDatetimeStr(d) {
    const months = {
        0: 'January',
        1: 'February',
        2: 'March',
        3: 'April',
        4: 'May',
        5: 'June',
        6: 'July',
        7: 'August',
        8: 'September',
        9: 'October',
        10: 'November',
        11: 'December',
    }

    const timeString12hr = d.toLocaleTimeString('en-US',
        { hour12: true, hour: 'numeric', minute: 'numeric' }
    );

    console.log(d)

    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} ${timeString12hr}`
};