const socket = io("http://localhost:3000/" ,{ transports: ['websocket', 'polling', 'flashsocket'] });
const formMessage = document.getElementById("form-message");
let containerMessage = document.getElementById("app-container");
let inputMessage = document.getElementById("message");
let span = document.getElementById("isTyping");

const inputName = prompt("enter your name");
AddMessage("you joined");
socket.emit("new-user", inputName);

formMessage.addEventListener("submit", (e) => {
    e.preventDefault();
    message = inputMessage.value;
    if(message == "") return;
    AddMessage(`You: ${message}`);
    socket.emit("send-message", message);
    socket.emit("typing", false);
    inputMessage.value = "";
})

//check if user typing
inputMessage.addEventListener('keydown', (e) => {
    console.log(e.target.value);
    if(inputMessage.value != "" && inputMessage.value.length >= 1){
        socket.emit("typing", true);
    }else{
        socket.emit("typing", false);
    }
})



socket.on("user-connected", name => {
    AddMessage(name + " connected");
})

socket.on("user-typing", message => {
    if(message == false){
        span.innerText = "";
    }else{
        span.innerText = message;
    }
})

socket.on("user-left", name => {
    AddMessage(name + "  disconnected");
})

socket.on("send-target-chat", data => {
    AddMessage(`${data.name}: ${data.message}`)
})


function AddMessage(Message){
    let el = document.createElement("div");
    el.setAttribute("id", "gotMessage");
    el.innerText = Message;
    containerMessage.append(el);
}