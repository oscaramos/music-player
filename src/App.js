import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import Loader from './Loader'
import { getTopSongs } from './api'

import { ReactComponent as PlayIcon } from './assets/play-solid.svg'
import { ReactComponent as ForwardIcon } from './assets/forward-solid.svg'
import { ReactComponent as BackwardIcon } from './assets/backward-solid.svg'
import { ReactComponent as PauseIcon } from './assets/pause-solid.svg'

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
  transition: width 0.2s linear;
`

const DurationWrapper = styled.div`
  position: relative;
  top: -25px;
  display: flex;
  justify-content: space-between;
`

const ButtonsContainer = styled.div`
  display: flex; 
  flex-direction: row;
  margin-top: -10px;
`

// Display seconds on format MM:SS
const display = seconds => {
  const format = val => `0${Math.floor(val)}`.slice(-2)
  const minutes = (seconds % 3600) / 60

  return [minutes, seconds % 60].map(format).join(':')
}

const Audio = React.forwardRef( function ({ songUrl }, audioRef) {
  // All times are on seconds
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [progress, setProgress] = useState(0)

  const displayTime = display(time)
  const displayDuration = display(duration)

  const handleTimeUpdate = () => {
    setTime(audioRef.current.currentTime)
  }

  const handleCanPlay = () => {
    setDuration(audioRef.current.duration)
  }

  useEffect(() => {
    const newProgress = (time / duration) * 100
    setProgress(newProgress)
  }, [time, duration])

  return (
    <ProgressContainer>
      <Progress style={{ width: `${progress}%` }} />
      <DurationWrapper>
        <span>{displayTime}</span>
        <span>{displayDuration}</span>
      </DurationWrapper>
      <audio
        src={songUrl}
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onCanPlay={handleCanPlay}
      />
    </ProgressContainer>
  )
})

function Player({ status, songs }) {
  const audioRef = useRef()
  const [playerState, setPlayerState] = useState('paused')
  const [currentSong, setCurrentSong] = useState(0)

  const song = songs[currentSong]

  const playSong = () => {
    audioRef.current.play()
    setPlayerState('playing')
  }

  const pauseSong = () => {
    audioRef.current.pause()
    setPlayerState('paused')
  }

  const nextSong = () => {
    setCurrentSong((currentSong + 1) % songs.length)
  }

  const prevSong = () => {
    setCurrentSong((currentSong + songs.length - 1) % songs.length)
  }

  if (status === 'loading') {
    return <Loader />
  }

  return (
    <PlayerContainer>
      <Img url={song.imageUrl} />
      <H2 style={{ marginTop: 300, marginBottom: 5, fontSize: song.name.length > 20? '1.25em': undefined }}>
        {song.name}
      </H2>
      <H3>
        {song.artist}
      </H3>
      <Audio
        songUrl={song.songUrl}
        ref={audioRef}
      />
      <ButtonsContainer>
        <IconButton onClick={nextSong}>
          <BackwardIcon title='Previous' />
        </IconButton>
        {
          playerState === 'paused' ?
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
      </ButtonsContainer>
    </PlayerContainer>
  )
}

// (randomly reorders) elements of the array
const shuffle = array => {
  return array.sort(() => Math.random() - 0.5);
}

function App() {
  const [songs, setSongs] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    getTopSongs()
      .then(topSongs => {
        setSongs(shuffle(topSongs))
        setStatus('resolved')
      })
      .catch(() => {
        setStatus('rejected')
      })
  }, [])

  return (
    <Container>
      <Player status={status} songs={songs} />
    </Container>
  );
}

export default App;
