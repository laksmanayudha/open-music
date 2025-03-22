const process = require('process');

const config = {
  app: {
    host: process.env.HOST,
    port: process.env.PORT,
  },
  database: {
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT,
  },
  s3: {
    bucketName: process.env.AWS_BUCKET_NAME,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  },
  rabbitMq: {
    server: process.env.RABBITMQ_SERVER,
    queues: {
      exportPlaylist: 'export:playlist',
    },
  },
  redis: {
    host: process.env.REDIS_SERVER,
    caches: {
      userPlaylists: (userId) => `user_playlists:${userId}`,
      playlistSongs: (playlistId) => `playlist_songs:${playlistId}`,
      albumLikes: (albumId) => `album_likes:${albumId}`,
    },
  },
  jwt: {
    accessTokenKey: process.env.ACCESS_TOKEN_KEY,
    refreshTokenKey: process.env.REFRESH_TOKEN_KEY,
    accessTokenAge: process.env.ACCESS_TOKEN_AGE,
  },
};

module.exports = config;
