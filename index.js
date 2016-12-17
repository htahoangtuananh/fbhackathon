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
            sendMessage(event.sender.id, {text: event.message.text});
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

function getGender() {
	request({
        url: 'https://graph.facebook.com/v2.6/{user-id}',
        qs: {access_token:token},
        method: 'GET',
        json: {
            gender:gender,
        }		
		
},function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
return json;
}

function social(recipientId, text) {
    
	if(text.toLowerCase().indexOf('Hello')!=-1||text.toLowerCase().indexOf('Hi')!=-1||text.toLowerCase().indexOf('Good Evening')!=-1||text.toLowerCase().indexOf('Good Morning')!=-1||text.toLowerCase().indexOf('Good Afternoon')!=-1)
	{
			var gender=getGender();
			message=gender;
	}
    if (values.length === 3 && values[0] === 'kitten') {
        if (Number(values[1]) > 0 && Number(values[2]) > 0) {
            
            var imageUrl = "https://placekitten.com/" + Number(values[1]) + "/" + Number(values[2]);
            
            message = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [{
                            "title": "Kitten",
                            "subtitle": "Cute kitten picture",
                            "image_url": imageUrl ,
                            "buttons": [{
                                "type": "web_url",
                                "url": imageUrl,
                                "title": "Show kitten"
                                }, {
                                "type": "postback",
                                "title": "I like this",
                                "payload": "User " + recipientId + " likes kitten " + imageUrl,
                            }]
                        }]
                    }
                }
            };
    
            sendMessage(recipientId, message);
            
            return true;
        }
    }
    
    return false;
    
};




