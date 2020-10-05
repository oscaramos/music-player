import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { ReactComponent as PlayIcon } from './assets/play-solid.svg'
import { ReactComponent as ForwardIcon } from './assets/forward-solid.svg'
import { ReactComponent as BackwardIcon } from './assets/backward-solid.svg'
import { ReactComponent as PauseIcon } from './assets/pause-solid.svg'
import { getTopSongs } from './api'

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`

const PlayerContainer = styled.div`
  width: 400px;
  height: 500px;
  background: #E7E7E7;
  display: flex;
  align-items: center;
  flex-direction: column;
  box-shadow: rgba(0, 0, 0, 0.25) 0 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px;
  border-radius: 20px;
  
  @media screen and (max-width: 600px) {
    width: 95vw;
  }
`

const IconButton = styled.div`
  color: #818181; 
  width: 40px;
  cursor: pointer;
  :hover {
    filter: brightness(80%);
  }
`

const Img = styled.div`
  background: ${props => `url(${props.url})`};
  background-size: cover;
  width: 300px;
  height: 300px;
  position: absolute;
  transform: translate(0px, -50px);
  box-shadow: rgba(0, 0, 0, 0.25) 0 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px;
  border-radius: 20px;
`

const H2 = styled.h2`
  font-family: 'Spartan', sans-serif;
  font-weight: bold;
`

const H3 = styled.h3`
  font-family: 'Spartan', sans-serif;
  font-weight: normal;
  margin: 0;
`

const ProgressContainer = styled.div`
  background: #fff;
  border-radius: 5px;
  cursor: pointer;
  margin: 40px 20px;
  height: 4px;
  width: 90%;
`

const Progress = styled.div`
  background: #242323;
  border-radius: 5px;
  height: 100%;
  /* Change this to show progress */
  width: 10%; 
  transition: width 0.1s linear;
`

const DurationWrapper = styled.div`
  position: relative;
  top: -25px;
  display: flex;
  justify-content: space-between;
`

function App() {
  const currentTime = "0:00"
  const duration = "2:06"

  const playerRef = useRef()
  const [status, setStatus] = useState('paused')
  const [songs, setSongs] = useState([
    {
      name: 'Electric Chill Machine',
      artist: 'Jacinto Design',
      songUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/35/Neckertal_20150527-6384.jpg'
    }
  ])
  const [currentSong, setCurrentSong] = useState(0)

  const playSong = () => {
    playerRef.current.play()
    setStatus('playing')
  }

  const pauseSong = () => {
    playerRef.current.pause()
    setStatus('paused')
  }

  const nextSong = () => {
    setCurrentSong((currentSong + 1) % songs.length)
  }

  const prevSong = () => {
    setCurrentSong((currentSong + songs.length - 1) % songs.length)
  }

  useEffect(() => {
    getTopSongs()
      .then(topSongs => {
        console.log(topSongs)
        setSongs(topSongs)
      })
  }, [])

  return (
    <Container>
      <PlayerContainer>
        <Img url={songs[currentSong].imageUrl} />
        <H2 style={{ marginTop: 300, marginBottom: 5 }}>
          {songs[currentSong].name}
        </H2>
        <H3>
          {songs[currentSong].artist}
        </H3>
        <audio
          src={songs[currentSong].songUrl}
          ref={playerRef}
        />
        <ProgressContainer>
          <Progress />
          <DurationWrapper>
            <span>{ currentTime }</span>
            <span>{ duration }</span>
          </DurationWrapper>
        </ProgressContainer>
        <div style={{ display: 'flex', flexDirection: 'row', marginTop: -10 }}>
          <IconButton onClick={nextSong}>
            <BackwardIcon title='Previous' />
          </IconButton>
          {
            status === 'paused'?
              <IconButton onClick={playSong} style={{ marginLeft: 30, marginRight: 30 }}>
                <PlayIcon title='Play' />
              </IconButton>
            :
              <IconButton onClick={pauseSong} style={{ marginLeft: 30, marginRight: 30 }}>
                <PauseIcon title='Pause' />
              </IconButton>
          }
          <IconButton onClick={prevSong}>
            <ForwardIcon title='Next' />
          </IconButton>
        </div>
      </PlayerContainer>
    </Container>
  );
}

export default App;
