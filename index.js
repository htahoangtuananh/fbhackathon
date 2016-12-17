var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 3000));

// Server frontpage
app.get('/', function (req, res) {
    res.send('This is TestBot Server for Messenger');
});

// Facebook Webhook
app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === 'nopassword') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});

app.post('/webhook', function (req, res) {
    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.message && event.message.text) {
			 if (!social(event.sender.id, event.message.text)) {
				sendMessage(event.sender.id, {text: event.message.text});
			 }
        }
		if (event.message.attachments) {
		//Checking if there are any image attachments 
			if(event.message.attachments[0].type === "image"){
			 var imageURL = event.message.attachments[0].payload.url;
			 sendMessage(event.sender.id, {text:"Analysing picture. Please be patient this may take up to few minutes."});
			 var interval = setTimeout(function() {
			 sendMessage(event.sender.id, {text:"This is transitory yellowing decease!"});
			 }, 12000);
			}
	   }
	}
    res.sendStatus(200);
});

const token = "EAAFdC39PRSABAAZAin5Cg0HcD2OgJbxHYq6nbpJCwcOn6ZCHqIxNV3LY9qFvTZBKfvH3zf1qwdOfFa8OkS3Bj8ZAyW2z0o46oXytexYgZCFPBeEXbC4VVix01NiW5dAf0iq3DUq3MSnhrnUcqxOdeDIpJUicR5Rn1zZBewJvR5KgZDZD";

function sendMessage(recipientId, message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};

function parseToStringType(text) {
	var stringType = ["SOCIAL", "DIAGNOSE", "SOLUTION", "GOSSIP"];
	switch(true) {
    case text.toLowerCase().indexOf("hi")!=-1||text.toLowerCase().indexOf("hello")!=-1||text.toLowerCase().indexOf("good Morning")!=-1||text.toLowerCase().indexOf("good Afternoon")!=-1||text.toLowerCase().indexOf("good Evening")!=-1:
        return stringType[0]; 
        break;
    case text.toLowerCase().indexOf("help")!=-1||text.toLowerCase().indexOf("problem")!=-1||text.toLowerCase().indexOf("decease")!=-1||text.toLowerCase().indexOf("happen")!=-1:
        return stringType[1]; 
        break;
	case text.toLowerCase().indexOf("solution")!=-1||text.toLowerCase().indexOf("fix")!=-1:
        return stringType[2]; 
        break;
	default:
		return stringType[3]; 
		break;
} 
}

function social(recipientId, text) {
    var type = parseToStringType(text);
    if (type==="SOCIAL") {   
            message = {
               "text":"Hello , how may I be of any assistance?"
            };
            sendMessage(recipientId, message);
            return true;
        
    }if(type==="GOSSIP"){
		message = {
               "text":"HAVE A NICE DAY"
            };
            sendMessage(recipientId, message);
            return true;
		
	}if(type==="DIAGNOSE"){
		message = {
               "text":"Please upload a as clear as possible picture about your problem here in order for me to assist you !"
            };
            sendMessage(recipientId, message);
            return true;
		
	}
    
    return false;
    
    
};




