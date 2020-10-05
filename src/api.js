import axios from 'axios'

const API_KEY = 'YTkxZTRhNzAtODdlNy00ZjMzLTg0MWItOTc0NmZmNjU4Yzk4'

const getImageUrl = async (song) => {
  // I feel not reliable the api and their docs
  // this causes me checking if data exists avoiding possible errors
  const albumLink = song.links?.albums?.href
  if (albumLink) {
    // Fetch to api to return albums
    const respAlbum = await axios.get(albumLink, {
      params: {
        apikey: API_KEY
      }
    })
    const album = respAlbum.data.albums[0]
    const imagesLink = album.links?.images?.href
    if(imagesLink) {
      // Fetch to api to return images
      const resp = await axios.get(imagesLink, {
        params: {
          apikey: API_KEY
        }
      })
      const imageUrl = resp.data.images[0].url
      return imageUrl
    }
  }
  // Load by default this image if there are not image
  return 'https://www.josco.com.au/wp-content/uploads/2016/05/Image-Unavailable.jpg'
}

// Get the top songs from Napster API
// Link to documentation: https://developer.napster.com/api/v2.2#tracks
export const getTopSongs = async () => {
  // Fetch to api for return songs
  const resp = await axios.get(`http://api.napster.com/v2.2/tracks/top`, {
    params: {
      range: 'year', // Valid values: day, week, month, year and life. Default is month
      limit: 10,
      apikey: API_KEY
    }
  })
  const songs = resp.data.tracks
  // Pick only important data
  const result = songs.map(async song =>
    ({
      name: song.name,
      artist: song.artistName,
      songUrl: song.previewURL,
      imageUrl: await getImageUrl(song),
    })
  )
  return await Promise.all(result)
}
