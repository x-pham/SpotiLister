import './App.css';
import keys from './keys.json';
import $ from 'jquery';
import { Buffer } from 'buffer';
import playlistTrackPlaceholder from "./PlaylistTrackPlaceholder.jpg"


function App() {
  var token;
  var client_id = keys.client_id;
  var client_secret = keys.client_secret;

  var buf = Buffer.from(client_id + ':' + client_secret).toString('base64');
  var imageLinkArray = [];
  var playlist;
  var page = 0;

  function getToken() {
    // Get the authentication token from Spotify
    $.ajax({
      url: 'https://accounts.spotify.com/api/token',
      type: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + buf
      },
      data: 'grant_type=client_credentials',
      success: function (result) {
        token = result;
        console.log('success');
      },
      error: function (result) {
        console.log(JSON.stringify(result));
      }
    });
  }

  async function displayPlaylist() {
    imageLinkArray = [];
    page = 0;
    $.ajax({
      url: 'https://accounts.spotify.com/api/token',
      type: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + buf
      },
      data: 'grant_type=client_credentials',
      success: function (result) {
        token = result;
        //Get playlist tracks
        $.ajax({
          url: 'https://api.spotify.com/v1/playlists/4gjxVoYtklG3O0sPS393xW?si=03ff892c40d94e25/tracks',
          type: 'GET',
          headers: { 'Authorization': 'Bearer ' + token.access_token },
          success: function (result) {
            playlist = result;
            var str = "";
            for (let i = 0; i < result.tracks.items.length; i++) {

              // Download images
              var imageLink = result.tracks.items[i].track.album.images[0].url;
              imageLinkArray.push(imageLink);
              str += result.tracks.items[i].track.name;
              str += ' By: '
              for (let j = 0; j < result.tracks.items[i].track.artists.length; j++) {
                str += result.tracks.items[i].track.artists[j].name;
                if (j !== result.tracks.items[i].track.artists.length - 1) {
                  str += ', '
                }
              }
              str += '\n';
            }

            //console.log(playlist);
            //Populate playlist tracks
            populateTracks();
          },
          error: function (result) {
            console.log(JSON.stringify(result));
          }
        });
      },
      error: function (result) {
        console.log(JSON.stringify(result));
      }
    });
  }

  function nextPage() {
    if (page < (Math.ceil(imageLinkArray.length / 6) - 1)) {
      page++;
      populateTracks();
    }
  }

  function prevPage() {
    if (page > (0)) {
      page--;
      populateTracks();
    }
  }

  function populateTracks() {
    let playlistDisplay = document.getElementById("playlistDisplay");
    playlistDisplay.replaceChildren();
    for (let i = page * 6; (i < (page * 6) + 6); i++) {
      if (i >= imageLinkArray.length) {
        let newNumber = document.createElement('div');
        newNumber.innerHTML = "00";
        newNumber.className = "placeholderTrackNumber";
        let newImage = document.createElement('img');
        newImage.src = playlistTrackPlaceholder;
        newImage.className = "trackImage";
        let newTextDiv = document.createElement('div');
        newTextDiv.innerHTML = "<b>.</b>";
        newTextDiv.className = "placeholderTrackText";
        let newDiv = document.createElement('div');
        newDiv.className = "trackDiv";
        newDiv.id = "track" + i;
        newDiv.appendChild(newNumber);
        newDiv.appendChild(newImage);
        newDiv.appendChild(newTextDiv);
        playlistDisplay.appendChild(newDiv);
        continue;
      }
      //Populate track number
      let newNumber = document.createElement('div');
      if (i < 9) {
        newNumber.innerHTML = "0" + (i + 1);
      }
      else {
        newNumber.innerHTML = i + 1;
      }
      newNumber.className = "trackNumber";
      //Populate track image
      let newImage = document.createElement('img');
      newImage.src = imageLinkArray[i];
      newImage.className = "trackImage";
      let newTextDiv = document.createElement('div');
      //Populate track name
      let trackName = playlist.tracks.items[i].track.name;
      if (trackName.includes("feat.")) {
        trackName = trackName.substring(0, trackName.indexOf('feat.') - 2);
      }
      if (trackName.includes("with")) {
        trackName = trackName.substring(0, trackName.indexOf('with') - 2);
      }
      newTextDiv.innerHTML = "<b>" + trackName + "</b>" + "<br/>";
      //Populate track artist(s)
      let artistText = "";
      for (let j = 0; j < playlist.tracks.items[i].track.artists.length; j++) {
        if (artistText.length > 40) {
          artistText += "... <br/>";
          break;
        }
        if (j !== playlist.tracks.items[i].track.artists.length - 1) {
          artistText += playlist.tracks.items[i].track.artists[j].name + ", <br/>";
        }
        else {
          artistText += playlist.tracks.items[i].track.artists[j].name + "<br/>";
        }
      }
      newTextDiv.innerHTML += artistText;
      //Populate album name
      newTextDiv.innerHTML += "<i>" + playlist.tracks.items[i].track.album.name + "</i>";
      newTextDiv.className = "trackText";
      let newDiv = document.createElement('div');
      newDiv.className = "trackDiv";
      newDiv.id = "track" + i;
      newDiv.appendChild(newNumber);
      newDiv.appendChild(newImage);
      newDiv.appendChild(newTextDiv);
      playlistDisplay.appendChild(newDiv);
    }
  }

  function setDate() {
    var dateDisplay = document.getElementById('dateDisplay');
    var date = document.getElementById('dateField').value;

    dateDisplay.innerHTML = date;
  }

  return (
    <div className="body">
      <div className="imageDisplay">
        <div id="dateDisplay" className="dateDisplay">October 21, 2022</div>
        <div id="playlistDisplay" className="playlistDisplay">
        </div>
      </div>
      <div className="buttonDisplay">
        <button onClick={displayPlaylist}>Display Playlist</button>
        <button onClick={prevPage} className="prevButton">Prev</button>
        <button onClick={nextPage} className="nextButton">Next</button>
        <input type="text" id="dateField"></input>
        <button onClick={setDate} >Set Date</button>
      </div>
      
    </div>
  );
}

export default App;
