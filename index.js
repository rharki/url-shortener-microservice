require('babel-register');

const app = require('./src/app').app,
      PORT = process.env.PORT || 3000;
 

app.listen(PORT, function() {
  console.log('URL Shortner Microservice - Server is listening on port ' + PORT);
});
