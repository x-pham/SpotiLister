import './App.css';
import keys from './keys.json';
import $ from 'jquery';
import { Buffer } from 'buffer';


function App() {
  var token;
  var client_id = keys.client_id;
  var client_secret = keys.client_secret;

  var buf = Buffer.from(client_id + ':' + client_secret).toString('base64');
  var imageLinkArray = [];
  var playlist;

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
        console.log(token);
        //Get playlist tracks
        $.ajax({
          url: 'https://api.spotify.com/v1/playlists/4gjxVoYtklG3O0sPS393xW?si=03ff892c40d94e25/tracks',
          type: 'GET',
          headers: { 'Authorization': 'Bearer ' + token.access_token },
          success: function (result) {
            console.log(result);
            playlist = result;
            var str = "";
            for (let i = 0; i < result.tracks.items.length; i++) {

              // Download images
              var imageLink = result.tracks.items[i].track.album.images[0].url;
              imageLinkArray.push(imageLink);
              //imageLink = imageLink.substring(1, imageLink.length - 2);
              /*
              downloadImage(imageLink, i + '.png')
              .then(console.log)
              .catch(console.error);
              */
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

            console.log(str);
            console.log(imageLinkArray);
            let playlistDisplay = document.getElementById("playlistDisplay");
            while (playlistDisplay.hasChildNodes()) {
              playlistDisplay.removeChild(playlistDisplay.firstChild);
            }
            for (const item of imageLinkArray) {
              let newImage = document.createElement('img');
              newImage.src = item;
              playlistDisplay.appendChild(newImage);
            }
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

  return (
    <div className="body">
      <div id="playlistDisplay" className="playlistDisplay">
        <button onClick={displayPlaylist}>Display Playlist</button>
      </div>
    </div>
  );
}

export default App;
