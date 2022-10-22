import './App.css';
import keys from './keys.json';
import $ from 'jquery';
import { Buffer } from 'buffer';


function App() {
  var token;
  var client_id = keys.client_id;
  var client_secret = keys.client_secret;

  var buf = Buffer.from(client_id + ':' + client_secret).toString('base64');
  //var imageLinkArray = [];

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
      <div className="playlistDisplay">
        <button onClick={displayPlaylist}>Display Playlist</button>
      </div>
    </div>
  );
}

export default App;
