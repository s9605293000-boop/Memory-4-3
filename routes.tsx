
import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import Lobby from './screens/Lobby'
import SingleLevelSelect from './screens/SingleLevelSelect'
import SingleGame from './screens/SingleGame'
import DuelLobby from './screens/DuelLobby'
import DuelTable from './screens/DuelTable'

export const router = createBrowserRouter([
  { path: '/', element: <Lobby /> },
  { path: '/single', element: <SingleLevelSelect /> },
  { path: '/single/play/:size', element: <SingleGame /> },
  { path: '/duel', element: <DuelLobby /> },
  { path: '/duel/table/:roomId', element: <DuelTable /> },
])
