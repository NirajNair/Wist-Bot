let container = document.querySelector('#chat-container');
let subContainer = document.querySelector('.sub-container');
let textInput = document.querySelector('#msgField');

let greetings = "Hello I'm <b><i>Wist Bot</i></b>. I help in creating simple shopping list quickly.";
let howToMakeList = "Press the microphone icon and say <i>'make a shopping list'</i> or <i>'make a list for shopping'</i>. You can even add items to the list by saying something like <i>'add some more items'</i>.";
showBotMsg(greetings);
showBotMsg(howToMakeList);

function sendMsgToServer(userMsg){
    var url = `http://localhost:3000/`;
    var user = { msg : userMsg};

    superagent
        .post(url)
        .send(user)
        .end(function(err, res){
            if (err || !res.ok){
                console.log('not ok');
                console.log(err);
                console.log(res);
            } 
            else{
                console.log('ok');
                console.log(res.text);
                showBotMsg(res.text);
                return res.text;
            }
        });
}

function addCheckBox(msg) {
    checkBox = `<input  type="checkbox"><label id="itemLabel"> ${msg}</label>`;
    showBotMsg(checkBox);
}

function showUserMsg(msg){
    console.log("works");
    var output = ``;
    output = `<div class="user-speech-container">
                <div class="box3 sb13">
                    <p id="userText">${msg}</p>
                </div>
            </div>`;
    subContainer.innerHTML += output;
    container.appendChild(subContainer);
    subContainer.scrollTop =  subContainer.scrollHeight;
}

function showBotMsg(msg){
    console.log("bot works");
    var output = ``;
    output = `<div class="bot-speech-container ">
                
                <div class="box4 sb14"><p id="botText">${msg}</p></div>
            </div>`;
    subContainer.innerHTML += output;
    container.appendChild(subContainer);
    subContainer.scrollTop =  subContainer.scrollHeight;
}

let mic = document.querySelector(".mic")
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
const recognition2 = new SpeechRecognition();
recognition2.continuous = true;
const recognition3 = new SpeechRecognition();
recognition3.continuous = true;
itemList = []
let generatedList = [];
let i = 0;            
let j= 0;

try{
    
    mic.addEventListener("click", () => {
        recognition.start(); 
    });
    
    recognition.onstart = () => {
        console.log('Speech recognition service has started');
    }
    
    recognition2.onstart = () => {
        console.log('Speech recognition2 service has started'); 
    }

    recognition2.onend = () => {
        console.log('Speech recognition2 service has ended');
    }

    recognition3.onstart = () => {
        console.log('Speech recognition3 service has started'); 
    }

    recognition3.onend = () => {
        console.log('Speech recognition3 service has ended');
    }


    recognition.onend = () => {
        console.log('Speech recognition service has ended');
    }
    recognition.onerror = function(event) { 
        console.log('Speech recognition error detected: ' + event.error); 
        alert("Browser does not support speech Recognition. Try using Google Chrome");
    }

    recognition2.onresult = function(event) {
        let listTranscript = event.results[i][0].transcript;
        if(!listTranscript.includes("done") && !listTranscript.includes("thank you")
         && !listTranscript.includes("stop")){
            generatedList.push(listTranscript);
            addCheckBox(generatedList[i]);
            console.log(generatedList);
        }else{
            showBotMsg("The list has been made.");
            recognition2.abort();
        }
        i += 1;
        
    }

    recognition3.onresult = function(event) {  
        let k = generatedList.length;
        let addTranscript = event.results[j][0].transcript;
        if(!addTranscript.includes("done") && !addTranscript.includes("thank you")
        && !addTranscript.includes("stop")){
            generatedList.push(addTranscript);
            addCheckBox(generatedList[k]);
            // addCheckBox(generatedList[j+k]);
            console.log(generatedList[k]);
        }else{
            showBotMsg("The list has been made.");
            recognition2.abort();
        }
        j += 1;
    }
    
    recognition.onresult= function(event){  
        let transcript = event.results[0][0].transcript;
        console.log(event);
        if(transcript.includes("list") && !transcript.includes("done") &&
        !transcript.includes("stop") && !transcript.includes("thank you")){
            showUserMsg(transcript);
            generatedList = [];
            i = 0;
            recognition2.start();
            showBotMsg("Say 'done' or 'stop' when the list is completed")
            showBotMsg("Please enter your items")

        } else if(transcript.includes("add")){
            showUserMsg(transcript);
            recognition3.start();
            showBotMsg("Add items") 
            for (items in generatedList){
                addCheckBox(generatedList[items]);
            }    
        } 
        else {
            console.log(transcript);
            sendMsgToServer(transcript);
            showUserMsg(transcript);
        }    
    };
    
} catch {
    alert("Browser does not support speech Recognition. Try using Google Chrome");
}

function makeList(item, listArray) {
    listArray.push(item);
    return listArray;
}

