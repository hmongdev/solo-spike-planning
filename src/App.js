import React, { useState, useEffect } from 'react';
import Dropdown from './Dropdown';
import Listbox from './Listbox';
import Detail from './Detail';
//! import it here as a hook-looking thing
import { Credentials } from './Credentials';
import axios from 'axios';

const App = () => {
    //! it becomes a variable invoked => and keys/values can be accessed
    const spotify = Credentials();

    //* STATES
    const [token, setToken] = useState('');
    //? Lifting state up means useState is handling multiple states: selectedGenre AND listofGenres
    const [genres, setGenres] = useState({
        selectedGenre: '',
        listOfGenresFromAPI: [],
    });

    const [playlist, setPlaylist] = useState({
        selectedPlaylist: '',
        listOfPlaylistFromAPI: [],
    });

    const [tracks, setTracks] = useState({
        selectedTrack: '',
        listOfTracksFromAPI: [],
    });
    const [trackDetail, setTrackDetail] = useState(null);

    //useEffect
    useEffect(() => {
        //! 1. POST TOKEN
        //? this is the endpoint
        axios('https://accounts.spotify.com/api/token', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization:
                    'Basic ' +
                    btoa(spotify.ClientId + ':' + spotify.ClientSecret),
            },
            data: 'grant_type=client_credentials',
            method: 'POST',
        }).then((tokenResponse) => {
            setToken(tokenResponse.data.access_token);

            //! 2. GET GENRES => list of categories => populate genres dropdown
            //? this is the endpoint
            axios('https://api.spotify.com/v1/browse/categories?locale=sv_US', {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + tokenResponse.data.access_token,
                },
            }).then((genreResponse) => {
                setGenres({
                    selectedGenre: genres.selectedGenre,
                    listOfGenresFromAPI: genreResponse.data.categories.items,
                });
            });
        });
        //these are considered dependences: even tho they're declared outside of useEffect, they're being used inside of useEffect so they must be included in the dependencies
    }, [genres.selectedGenre, spotify.ClientId, spotify.ClientSecret]);

    const genreChanged = (val) => {
        setGenres({
            selectedGenre: val,
            listOfGenresFromAPI: genres.listOfGenresFromAPI,
        });

        //3. GET selectedPlaylist based on genre
        axios(
            `https://api.spotify.com/v1/browse/categories/${val}/playlists?limit=10`,
            {
                method: 'GET',
                headers: { Authorization: 'Bearer ' + token },
            }
        ).then((playlistResponse) => {
            setPlaylist({
                selectedPlaylist: playlist.selectedPlaylist,
                listOfPlaylistFromAPI: playlistResponse.data.playlists.items,
            });
        });

        console.log(val);
    };

    const playlistChanged = (val) => {
        console.log(val);
        setPlaylist({
            selectedPlaylist: val,
            listOfPlaylistFromAPI: playlist.listOfPlaylistFromAPI,
        });
    };

    //4. GET api call for tracks
    // when button is clicked, trigger an API call to get the tracks for the selected genre and playlist
    const buttonClicked = (e) => {
        e.preventDefault();
        axios(
            `https://api.spotify.com/v1/playlists/${playlist.selectedPlaylist}/tracks?limit=10`,
            {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + token,
                },
            }
        ).then((tracksResponse) => {
            setTracks({
                selectedTrack: tracks.selectedTrack,
                listOfTracksFromAPI: tracksResponse.data.items,
            });
        });
    };

    //when list box is clicked => show all the tracks
    const listboxClicked = (val) => {
        const currentTracks = [...tracks.listOfTracksFromAPI];
        const trackInfo = currentTracks.filter((t) => t.track.id === val);
        setTrackDetail(trackInfo[0].track);
    };

    return (
        <div className="container">
            <form onSubmit={buttonClicked}>
                <Dropdown
                    label="Genre:"
                    options={genres.listOfGenresFromAPI}
                    selectedValue={genres.selectedGenre}
                    changed={genreChanged}
                />
                <Dropdown
                    label="Playlist:"
                    options={playlist.listOfPlaylistFromAPI}
                    selectedValue={playlist.selectedPlaylist}
                    changed={playlistChanged}
                />
                <div className="col-sm-6 row form-group px-0">
                    <button type="submit" className="btn btn-success col-sm-12">
                        Search
                    </button>
                </div>
                <div className="row">
                    <Listbox
                        items={tracks.listOfTracksFromAPI}
                        clicked={listboxClicked}
                    />
                    {/* //* short circuit here */}
                    {trackDetail && <Detail {...trackDetail} />}
                </div>
            </form>
        </div>
    );
};

export default App;
