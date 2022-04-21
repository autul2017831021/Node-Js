function getApiReqResTime(dateObj){
    let date = ("0" + dateObj.getDate()).slice(-2)
    let month = ("0" + (dateObj.getMonth() + 1)).slice(-2)
    let year = dateObj.getFullYear()
    let hours = dateObj.getHours()
    let minutes = dateObj.getMinutes()
    let seconds = dateObj.getSeconds()

    return (year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds)
}

module.exports = {
    getApiReqResTime
}