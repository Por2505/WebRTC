var webSocketServer = require('ws').Server;
var wss = new webSocketServer({ 
    port:9090
});

var users = { };
var otherUser;
wss.on('connection', function(conn) {
    console.log("User connected");

    conn.on('message', function(message){
        var data;
        try{
            data = JSON.parse(message);
        } catch(e){
            console.log("Invalid JSON");
            data = {};
        }

        switch(data.type){
            case "login":
                if(users[data.name]){
                    sendToOtherUser(conn, {
                        type: "login",
                        success: false
                    })
                }else{
                    users[data.name] =conn;
                    conn.name = data.name;
                    sendToOtherUser(conn,{
                        type:"login",
                        success: true
                    })
                }
                break;
            case "offer":
                var connect = users[data.name];
                if(connect != null){
                    conn.otherUser = data.name;
                    sendToOtherUser(conn,{
                        type: "offer",
                        offer: data.offer,
                        name: connect.name
                    } )
                }
                break;
        }

    })
    conn.on('close', function(message){
        console.log("connection closed");
    })
    conn.send("Hello World!");


})

function sendToOtherUser(connection,message){
    connection.send(JSON.stringify(message));
}