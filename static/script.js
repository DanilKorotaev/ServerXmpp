var server = 'nulnow.com'
var BOSH_SERVICE = ' https://nulnow.com:7443/http-bind/ '
var connection = null

var url = BOSH_SERVICE;
connection = new Strophe.Connection(url)

function start() {
    connection.connect("client@nulnow.com", "123456", onConnect)
}
var t0 = null

$(document).ready(function() {
    $('#connect').bind('click', function() {
        var button = $('#connect').get(0)
        if (button.value == 'connect') {
          button.value = 'disconnect'
          start()
        } else {
          button.value = 'connect'
          stop()
        }
    })
    connection = new Strophe.Connection(url)
    t0 = performance.now()
    start()
})

function stop() {
    connection.disconnect();
}

function onConnect(status) {
    if (status == Strophe.Status.CONNECTING) {
        setStatus("connecting")
        console.log('Strophe is connecting.')
    } else if (status == Strophe.Status.CONNFAIL) {
        setStatus('connect failed')
        console.log('Strophe failed to connect.')
    } else if (status == Strophe.Status.DISCONNECTING) {
        setStatus('disconnecting')
        console.log('Strophe is disconnecting.')
    } else if (status == Strophe.Status.DISCONNECTED) {
        setStatus('disconnected')
        console.log('Strophe is disconnected.')
    } else if (status == Strophe.Status.CONNECTED) {
        setStatus('connected')
        console.log('Strophe is connected.')
        connection.addHandler(onMessage, null, 'message', null, null, null)
    }
}

function onMessage(msg) {
    var to = msg.getAttribute('to')
    var from = msg.getAttribute('from')
    var type = msg.getAttribute('type')
    var elems = msg.getElementsByTagName('body')
    if (type == "chat" && elems.length > 0) {
        var text = Strophe.getText(elems[0])
        const date = new Date
        var time = date.toLocaleTimeString()
        addMessage(`${text} ${time}`)
    }
    return true;
}

function addMessage(text) {
    if (text == null || text === "") return
    $('#messages').prepend($('<li>').text(text))
}

var oldStatus = "disconnected"

function setStatus(text) {
    $('#status').text(text)
    var t1 = performance.now()
    addMessage(`${oldStatus} -> ${text}: ${(t1 - t0).toFixed(0)} ms`)
    oldStatus = text
    t0 = t1
}