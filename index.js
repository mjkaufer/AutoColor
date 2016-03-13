var prompt = require('prompt')
var login = require("facebook-chat-api");
var toHex = require('colornames')

console.log("Enter your Facebook credentials - your password will not be visible as you type it in")
prompt.start();

prompt.get([{
		name: 'email',
		required: true
	}, {
		name: 'password',
		hidden: true,
		conform: function (value) {
			return true;
		}
	}], function (err, result) {
		authenticate(result)
});

function authenticate(credentials){//where credentials is the user's credentials as an object, fields `email` and `password
	login(credentials, function(err, api) {
		gapi = api
		if(err) return console.error(err);

		console.log("Logged in as " + credentials.email)

		api.setOptions({
			logLevel: "silent",
			selfListen: true
		})

		var colorArr = toHex.all()
		console.log(Object.keys(api))

		api.listen(function cb(err, message) {
			if(err)
				return console.log(err)
			
			console.log("new message")
			var messageBody = message.body.trim().toLowerCase()

			for(var i = 0; i < colorArr.length; i++){
				var colorName = colorArr[i].name.toLowerCase()

				if(messageBody.indexOf(colorName) > -1){
					console.log(i,"Changing chat color with",message.participantNames,"to",colorName,colorArr[i].value)

					api.changeThreadColor(colorArr[i].value, message.threadID, function(e){
						if(e) console.log(e)
					})

					i = colorArr.length
					return true
				}
			}

			return true
		});

	})
}