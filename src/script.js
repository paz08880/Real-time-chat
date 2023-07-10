const socket = io("http://localhost:3000/", { transports: ['websocket', 'polling', 'flashsocket'] });
const formMessage = document.getElementById("form-message");
let containerMessage = document.getElementById("app-container");
let inputMessage = document.getElementById("message");
let span = document.getElementById("isTyping");
let onlineUsers = document.getElementById("onlineUsers");

const inputName = prompt("Enter your name");
AddMessage("You joined");
socket.emit("new-user", inputName);

setInterval(() => {
    checkUsers();
}, 1000);

formMessage.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = inputMessage.value;
    if (message === "") return;
    AddMessage(`You: ${message}`);
    socket.emit("send-message", message);
    socket.emit("typing", false);
    inputMessage.value = "";
});

// Check if user is typing
inputMessage.addEventListener('input', () => {
    if (inputMessage.value !== "") {
        socket.emit("typing", true);
    } else {
        socket.emit("typing", false);
    }
});

socket.on("get-online-users", (users) => {
    let firstNames = Object.values(users).map(name => name.split(' ')[0]);
    onlineUsers.innerText = `${firstNames.length} online users`;
});

socket.on("user-connected", (name) => {
    AddMessage(`${name} connected`);
});

socket.on("user-typing", (message) => {
    if (message === false) {
        span.innerText = "";
    } else {
        span.innerText = message;
    }
});

socket.on("user-left", (name) => {
    AddMessage(`${name} disconnected`);
});

socket.on("send-target-chat", (data) => {
    AddMessage(`${data.name}: ${data.message}`);
});

function AddMessage(message) {
    const el = document.createElement("div");
    el.setAttribute("id", "gotMessage");
    el.innerText = message;
    containerMessage.append(el);
}

function checkUsers() {
    socket.emit("send-online-users");
}


function clearAllChat() {
    let allMessages = document.querySelectorAll("#gotMessage");
    allMessages.forEach(message => {
      message.remove();
    });
  }
  