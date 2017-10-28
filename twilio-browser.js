'use strict';

var Video = require('twilio-video');

var activeRoom = null;
var previewTracks;
var identity;
var roomName;
var isJoined = false;

// Attach the Tracks to the DOM.
function attachTracks(tracks, container) {
  tracks.forEach(function(track) {
    container.appendChild(track.attach());
  });
}

// Attach the Participant's Tracks to the DOM.
function attachParticipantTracks(participant, container) {
  var tracks = Array.from(participant.tracks.values());
  attachTracks(tracks, container);
}

// Detach the Tracks from the DOM.
function detachTracks(tracks) {
  tracks.forEach(function(track) {
    track.detach().forEach(function(detachedElement) {
      detachedElement.remove();
    });
  });
}

// Detach the Participant's Tracks from the DOM.
function detachParticipantTracks(participant) {
  var tracks = Array.from(participant.tracks.values());
  detachTracks(tracks);
}

function generateRoomName(ida, idb) {
  if(ida > idb)
    return ida+'.'+idb;
  else
    return idb+'.'+ida;
}

// When we are about to transition away from this page, disconnect
// from the room, if joined.
window.addEventListener('beforeunload', leaveRoomIfJoined);

// Obtain a token from the server in order to connect to the Room.
$.ajax({
   method: "GET",
   url: "/videotoken",
   data: {'identity': currentUser._id},
   success: function(data) {

  //$.getJSON('/videotoken', function(data) {
    identity = data.identity;
    //document.getElementById('room-controls').style.display = 'block';

    // Bind button to join Room.
    $("#button-join-leave").click(function(e){
      if(activeRoom == null) {
          if(STATE.currentUser == null || STATE.selectedContact == null) {
            console.log('ROOM: one of the users is not set');
            return;
          }
          roomName = generateRoomName(STATE.currentUser._id, STATE.selectedContact._id);
          console.log('joining room: ', roomName);

          var connectOptions = {
            name: roomName,
            logLevel: 'debug'
          };

          if (previewTracks) {
            connectOptions.tracks = previewTracks;
          }

          // Join the Room with the token from the server and the
          // LocalParticipant's Tracks.
          Video.connect(data.token, connectOptions).then(roomJoined, function(error) {
            //log('Could not connect to Twilio: ' + error.message);
            console.log('Could not connect to Twilio: ' + error.message);
          });

      } else {

          activeRoom.disconnect();
      }
    });
  }
    //});

});

// Successfully connected!
function roomJoined(room) {
  var btnJoinLeave = $('#button-join-leave');
  btnJoinLeave.text('Leave the class...');
  btnJoinLeave.removeClass('bg-green');
  btnJoinLeave.addClass('bg-red');

  window.room = activeRoom = room;

  console.log("Joined as '" + identity + "'");

  // Attach LocalParticipant's Tracks, if not already attached.
  var previewContainer = $('#local-media')[0];
  if (!previewContainer.querySelector('video')) {
      attachParticipantTracks(room.localParticipant, previewContainer);
  }

  // Attach the Tracks of the Room's Participants.
  room.participants.forEach(function(participant) {
    //log("Already in Room: '" + participant.identity + "'");
    console.log("Already in Room: '" + participant.identity + "'");
    var previewContainer = $('#remote-media');
    attachParticipantTracks(participant, previewContainer);
  });

  // When a Participant joins the Room, log the event.
  room.on('participantConnected', function(participant) {
    //log("Joining: '" + participant.identity + "'");
    console.log("Joining: '" + participant.identity + "'");
  });

  // When a Participant adds a Track, attach it to the DOM.
  room.on('trackAdded', function(track, participant) {
    //log(participant.identity + " added track: " + track.kind);
    console.log(participant.identity + " added track: " + track.kind);
    var previewContainer = document.getElementById('remote-media');
    attachTracks([track], previewContainer);
  });

  // When a Participant removes a Track, detach it from the DOM.
  room.on('trackRemoved', function(track, participant) {
    //log(participant.identity + " removed track: " + track.kind);
    console.log(participant.identity + " removed track: " + track.kind);
    detachTracks([track]);
  });

  // When a Participant leaves the Room, detach its Tracks.
  room.on('participantDisconnected', function(participant) {
    //log("Participant '" + participant.identity + "' left the room");
    console.log("Participant '" + participant.identity + "' left the room");
    detachParticipantTracks(participant);
  });

  // Once the LocalParticipant leaves the room, detach the Tracks
  // of all Participants, including that of the LocalParticipant.
  room.on('disconnected', function() {
    //log('Left');
    console.log('Left');
    if (previewTracks) {
      previewTracks.forEach(function(track) {
        track.stop();
      });
    }
    detachParticipantTracks(room.localParticipant);
    room.participants.forEach(detachParticipantTracks);
    activeRoom = null;
    btnJoinLeave.text('Join the class...')
    btnJoinLeave.removeClass('bg-red');
    btnJoinLeave.addClass('bg-green');
    //document.getElementById('button-join').style.display = 'inline';
    //document.getElementById('button-leave').style.display = 'none';
  });
}

// Preview LocalParticipant's Tracks.
//document.getElementById('button-preview').onclick = function() {
$("#button-preview").click(function(){
  var localTracksPromise = previewTracks
    ? Promise.resolve(previewTracks)
    : Video.createLocalTracks();

  localTracksPromise.then(function(tracks) {
    window.previewTracks = previewTracks = tracks;
    var previewContainer = $('#local-media')[0];
    if (!previewContainer.querySelector('video')) {
      attachTracks(tracks, previewContainer);
    }
  }, function(error) {
    console.error('Unable to access local media', error);
    log('Unable to access Camera and Microphone');
  });
});

// Activity log.
/*function log(message) {
  var logDiv = document.getElementById('log');
  logDiv.innerHTML += '<p>&gt;&nbsp;' + message + '</p>';
  logDiv.scrollTop = logDiv.scrollHeight;
}*/

// Leave Room.
function leaveRoomIfJoined() {
  if (activeRoom) {
    activeRoom.disconnect();
  }
}
