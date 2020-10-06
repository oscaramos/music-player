import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import Loader from './Loader'
import { getTopSongs } from './api'

import { ReactComponent as PlayIcon } from './assets/play-solid.svg'
import { ReactComponent as ForwardIcon } from './assets/forward-solid.svg'
import { ReactComponent as BackwardIcon } from './assets/backward-solid.svg'
import { ReactComponent as PauseIcon } from './assets/pause-solid.svg'
import { ReactComponent as RandomIcon } from './assets/random-solid.svg'
import { ReactComponent as RepeatIcon } from './assets/repeat-solid.svg'

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
  box-shadow: rgba(0, 0, 0, 0.25) 0 14px 28px, rgba(0, 0, 0, 0.22) 0 10px 10px;
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
  box-shadow: rgba(0, 0, 0, 0.25) 0 14px 28px, rgba(0, 0, 0, 0.22) 0 10px 10px;
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
  gap: 30px;
`

// Display seconds on format MM:SS
const display = seconds => {
  const format = val => `0${Math.floor(val)}`.slice(-2)
  const minutes = (seconds % 3600) / 60

  return [minutes, seconds % 60].map(format).join(':')
}

const Audio = React.forwardRef(function ({ songUrl, onEnded, onCanPlay }, audioRef) {
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
    onCanPlay()
  }

  const manualSetTime = (e) => {
    // Calculate the new time for the song
    const clickX = e.nativeEvent.offsetX
    const width = e.target.clientWidth
    const newTime = (clickX / width) * duration
    setTime(newTime)
    // Set the song time to new time
    audioRef.current.currentTime = newTime
  }

  useEffect(() => {
    const newProgress = (time / duration) * 100
    setProgress(newProgress)
  }, [time, duration])

  return (
    <ProgressContainer onClick={manualSetTime}>
      <Progress style={{ width: `${progress}%`, pointerEvents: 'none' }} />
      <DurationWrapper style={{ pointerEvents: 'none' }}>
        <span>{displayTime}</span>
        <span>{displayDuration}</span>
      </DurationWrapper>
      <audio
        src={songUrl}
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onCanPlay={handleCanPlay}
        onEnded={onEnded}
      />
    </ProgressContainer>
  )
})

function Player({ status, songs, onShuffleSongs }) {
  const audioRef = useRef()
  const [playerState, setPlayerState] = useState('paused')
  const [currentSong, setCurrentSong] = useState(0)
  const [repeatSongOnEnd, setRepeatSongOnEnd] = useState(false)

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

  const toggleRepeatSong = () => {
    setRepeatSongOnEnd(!repeatSongOnEnd)
  }

  const handleEnded = () => {
    if (repeatSongOnEnd) {
      audioRef.current.load()
    } else {
      nextSong()
    }
  }

  const handleCanPlay = () => {
    if (playerState === 'playing') {
      playSong()
    } else {
      pauseSong()
    }
  }

  if (status === 'loading') {
    return <Loader />
  }

  return (
    <PlayerContainer>
      <Img url={song.imageUrl} />
      <H2 style={{ marginTop: 300, marginBottom: 5, fontSize: song.name.length > 20 ? '1.25em' : undefined }}>
        {song.name}
      </H2>
      <H3>
        {song.artist}
      </H3>
      <Audio
        songUrl={song.songUrl}
        onEnded={handleEnded}
        onCanPlay={handleCanPlay}
        ref={audioRef}
      />
      <ButtonsContainer>
        <IconButton onClick={onShuffleSongs}>
          <RandomIcon title='Shuffle' />
        </IconButton>
        <IconButton onClick={prevSong}>
          <BackwardIcon title='Previous' />
        </IconButton>
        {
          playerState === 'paused' ?
            <IconButton onClick={playSong}>
              <PlayIcon title='Play' />
            </IconButton>
            :
            <IconButton onClick={pauseSong}>
              <PauseIcon title='Pause' />
            </IconButton>
        }
        <IconButton onClick={nextSong}>
          <ForwardIcon title='Next' />
        </IconButton>
        <IconButton onClick={toggleRepeatSong}>
          <RepeatIcon title={repeatSongOnEnd? `Don't repeat`: 'Repeat'} style={{ color: repeatSongOnEnd? '#1DF369': undefined }}/>
        </IconButton>
      </ButtonsContainer>
    </PlayerContainer>
  )
}

// (randomly reorders) elements of the array
// from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
// It's the slowest method but I only need to shuffle a few items (<=10)
function shuffle(array) {
  return [...array].sort( () => .5 - Math.random() );
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

  const shuffleSongs = () => {
    const shuffledSongs = shuffle(songs)
    setSongs(shuffledSongs)
  }

  return (
    <Container>
      <Player status={status} songs={songs} onShuffleSongs={shuffleSongs} />
    </Container>
  )
}

export default App
