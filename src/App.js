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
    }
    populateTracks();
  }

  function prevPage() {
    if (page > (0)) {
      page--;
    }
    populateTracks();
  }

  function populateTracks() {
    let playlistDisplay = document.getElementById("playlistDisplay");
    playlistDisplay.replaceChildren();
    for (let i = page * 6; (i < (page * 6) + 6) && (i < imageLinkArray.length); i++) {
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
      newTextDiv.innerHTML = playlist.tracks.items[i].track.name + "<br/>";
      //Populate track artist(s)
      for (let j = 0; j < playlist.tracks.items[i].track.artists.length; j++) {
        if (j !== playlist.tracks.items[i].track.artists.length - 1) {
          newTextDiv.innerHTML += playlist.tracks.items[i].track.artists[j].name + ", <br/>";
        }
        else {
          newTextDiv.innerHTML += playlist.tracks.items[i].track.artists[j].name + "<br/>";
        }
      }
      //Populate album name
      newTextDiv.innerHTML += playlist.tracks.items[i].track.album.name;
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

  return (
    <div className="body">
      <div className="dateDisplay">October 21, 2022</div>
      <div id="playlistDisplay" className="playlistDisplay">
      </div>
      <div className="buttonDisplay">
        <button onClick={displayPlaylist}>Display Playlist</button>
        <button onClick={prevPage} className="prevButton">Prev</button>
        <button onClick={nextPage} className="nextButton">Next</button>
      </div>
    </div>
  );
}

export default App;
