var webshot = require('webshot');

// Image Settings
var webshotOptions = {
  screenSize: {
    width: 1024 , height: 800
  },
  shotSize: {
      width: 1024, height: 'all'
  },
  renderDelay: 200,
  userAgent: 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.1'
};

// Concurrency Variables
var maxConcurrentThreads = 5;
var runningThreads = 0;
var queuedThreads = [];

function saveUserPageNoQueue(username, outputfile, callback){
    runningThreads ++;
    // Take screenshot of github page
    webshot("http://www.github.com/" + username, outputfile, webshotOptions, function(err){
        if (err) console.log("Error: ", err);
        runningThreads --;
        if (queuedThreads.length > 0){
            queuedThreads.shift()();
        }
        if (callback) callback();
    });
}

module.exports.saveUserPage = function(username, outputfile, callback){
    // If we've exceeded the max number of threads, delay the call
    if (queuedThreads.length > 0  || runningThreads >= maxConcurrentThreads){
        queuedThreads.push(function(){
            saveUserPageNoQueue(username, outputfile, callback);
        });
        return;
    }
    saveUserPageNoQueue(username, outputfile, callback);
};
