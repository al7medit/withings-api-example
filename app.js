var express = require('express')
var app = express()
var request = require("request");
app.listen(443);

var access_token = "";

/**
 * Fill in these values first
 */
var clientID = "<clientID>";
var clientSecret = "<clientSecret>";
var callbackURI = "<callbackURI>";
var state = "<state>";
var scope = "<scope>";

app.get('/token', function (req1, res1) {
  var url = "https://account.withings.com/oauth2_user/authorize2?response_type=code&client_id="+clientID+"&state="+state+"&scope="+scope+"&redirect_uri="+callbackURI;
  var r = request.get(url, {followRedirect: true}, function (err2) {
    if (err2) throw err2;
    res1.redirect(r.uri.href);
  });
});

//Change the next line for your callback uri
app.get('/callback', function (req, res) {
  var code = req.query.code;

  request.post({
    url: 'https://account.withings.com/oauth2/token',
    form: { 
      grant_type: 'authorization_code',
      client_id: clientID,
      client_secret: clientSecret,
      code: code,
      redirect_uri: callbackURI
    },
    headers: { 
        'Content-Type' : 'application/x-www-form-urlencoded' 
    },
    method: 'POST'
    }, function (err3, res3) {
      if (err3) throw err3;
        var results = JSON.parse(res3.body);
        access_token = results.access_token;
        res.send('Access Token successfully retrieved!\n You can now make requests.');
    });
});

/**
 * Get Weight example
 */
app.get('/weight', function (req, res) {
  if (access_token != "") {
    var url = "https://wbsapi.withings.net/measure?action=getmeas&access_token="+access_token+"&meastype=1&category=1";
    
    request.get(url, function (err2, res2, body2) {
      if (err2) throw err2;
      
      res.send(body2);
    });
  } else {
    res.send("First make the request token request.");
  }
});
