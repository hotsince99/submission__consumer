const { Pool } = require('pg');

class PlaylistService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylist(playlistId) {
    const playlistQuery = {
      text: `SELECT id, name
             FROM playlists
             WHERE playlists.id = $1`,
      values: [playlistId],
    };
    const playlistResult = await this._pool.query(playlistQuery);

    const songsQuery = {
      text: `SELECT s.id, s.title, s.performer
             FROM playlists
             LEFT JOIN playlist_songs ps on playlists.id = ps.playlist_id
             LEFT JOIN songs s on ps.song_id = s.id
             WHERE playlist_id = $1`,
      values: [playlistId],
    };
    const songsResult = await this._pool.query(songsQuery);

    const playlist = playlistResult.rows[0];
    playlist.songs = songsResult.rows;

    const playlistJson = {
      playlist,
    };

    return playlistJson;
  }
}

module.exports = PlaylistService;
