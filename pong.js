var webrtc = require('wrtc');

var RTCPeerConnection     = webrtc.RTCPeerConnection;
var RTCSessionDescription = webrtc.RTCSessionDescription;
var RTCIceCandidate       = webrtc.RTCIceCandidate;

var pc1 = new RTCPeerConnection({"iceServers":[]});

pc1.onicecandidate = function(candidate) {
  if(!candidate.candidate) return;
  console.log(JSON.stringify(candidate.candidate));
}

function handle_error(error)
{
  throw error;
}

var checks = 0;
var expected = 10;
var dc1;

function create_data_channels() {
  dc1 = pc1.createDataChannel('test');
  dc1.onopen = function() {
    console.log("pc1: data channel open");
  };
  dc1.onmessage = function(event) {
    var data = event.data;
    console.log("dc1: received '"+data+"'");
    console.log("dc1: sending 'pong'");
    dc1.send("pong");
  };
  pc1.ondatachannel = function(ecent) {
    console.log("dc1: ondatachannel");
  };

  create_offer();
}

function create_offer() {
  console.log('pc1: create offer');
  pc1.createOffer(set_pc1_local_description, handle_error);
}

function set_pc1_local_description(desc) {
  console.log('pc1: set local description');
  pc1.setLocalDescription(
    new RTCSessionDescription(desc),
    printdescription.bind(undefined, desc),
    handle_error
  );
}

var sdp = "";

function printdescription(desc) {
  console.log('pc1: local description is set');
  console.log(JSON.stringify(desc));
  var reader = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
  });
  var msg = "sdp:";
  console.log(msg);
  reader.on('line', function (line) {
    if(line =="ping") {
        dc1.send('ping');
    } else if(line != ""){
        if(sdp == "") {
          sdp = line;
          set_pc1_remote_description(JSON.parse(line));
          msg = "ice:";
        } else {
          pc1.addIceCandidate(JSON.parse(line));
        }
    }
    console.log(msg);
  });
  reader.on('close', function () {
    //do something
  });
}


function set_pc1_remote_description(desc) {
  console.log('pc1: set remote description');
  pc1.setRemoteDescription(
    new RTCSessionDescription(desc),
    wait,
    handle_error
  );
}

function wait() {
  console.log('waiting');
}

function run() {
  create_data_channels();
}

function done() {
  console.log('cleanup');
  pc1.close();
  console.log('done');
}

run();
