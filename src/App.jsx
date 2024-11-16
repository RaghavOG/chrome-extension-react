'use client'

import { useEffect, useState } from 'react'
import './App.css'
import ParticlesComponent from "./components/ParticleComp"
import { Button } from "@/components/ui/button"
import { Separator } from './components/ui/separator'
import Modal from './components/Modal'  // Import the Modal component
import TodoApp from './components/TodoApp' // Import the TodoApp component


function App() {
  const [date, setDate] = useState(new Date())
  const [waterCount, setWaterCount] = useState(0)
  const [stopwatchTime, setStopwatchTime] = useState(0)
  const [stopwatchMicroseconds, setStopwatchMicroseconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [tabCount, setTabCount] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openTodoApp = () => {
    setIsModalOpen(true); // Open the Todo modal
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const storedWaterCount = localStorage.getItem('waterCount')
    const storedStopwatchTime = localStorage.getItem('stopwatchTime')
    const storedTabCount = localStorage.getItem('tabCount')
    const storedDate = localStorage.getItem('lastResetDate')

    const currentDate = new Date()
    const shouldReset = currentDate.getDate() !== new Date(storedDate).getDate() || 
                        (currentDate.getHours() >= 5 && currentDate.getMinutes() >= 30 && 
                        (new Date(storedDate).getHours() < 5 || (new Date(storedDate).getHours() === 5 && new Date(storedDate).getMinutes() < 30)))

    if (shouldReset) {
      setWaterCount(0)
      setTabCount(1)
      localStorage.setItem('waterCount', '0')
      localStorage.setItem('tabCount', '1')
      localStorage.setItem('lastResetDate', currentDate.toISOString())
    } else {
      setWaterCount(parseInt(storedWaterCount) || 0)
      setTabCount((parseInt(storedTabCount) || 0) + 1)
      localStorage.setItem('tabCount', ((parseInt(storedTabCount) || 0) + 1).toString())
    }

    if (storedStopwatchTime) {
      setStopwatchTime(parseInt(storedStopwatchTime))
    }
  }, [])

  useEffect(() => {
    let interval
    if (isRunning) {
      interval = setInterval(() => {
        setStopwatchMicroseconds((prevMicroseconds) => {
          let newMicroseconds = prevMicroseconds + 1
          if (newMicroseconds >= 10) {
            newMicroseconds = 0
            setStopwatchTime((prevTime) => prevTime + 1)
            localStorage.setItem('stopwatchTime', (stopwatchTime + 1).toString())
          }
          localStorage.setItem('stopwatchMicroseconds', newMicroseconds.toString())
          return newMicroseconds
        })
      }, 100)
    } else if (!isRunning) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isRunning, stopwatchTime])

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatTime = (date) => {
    const options = {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    };
  
    const time = date.toLocaleTimeString('en-US', options);
    const [timePart, ampm] = time.split(' ');

    return (
      <span className="flex items-center">
        <span className="text-[12rem] font-bold tracking-wider">{timePart}</span>
        <span className="text-6xl font-bold ml-2">{ampm}</span>
      </span>
    );
  };

  const incrementWaterCount = () => {
    const newCount = waterCount + 1
    setWaterCount(newCount)
    localStorage.setItem('waterCount', newCount.toString())
    localStorage.setItem('lastResetDate', new Date().toISOString())
  }

  const formatStopwatchTime = (time, microseconds) => {
    const hours = Math.floor(time / 3600)
    const minutes = Math.floor((time % 3600) / 60)
    const seconds = time % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${microseconds}`
  }

  const handleStopwatchStart = () => setIsRunning(true)
  const handleStopwatchStop = () => setIsRunning(false)
  const handleStopwatchReset = () => {
    setStopwatchTime(0)
    setStopwatchMicroseconds(0)
    setIsRunning(false)
    localStorage.setItem('stopwatchTime', '0')
    localStorage.setItem('stopwatchMicroseconds', '0')
  }

  const openYouTube = () => {
    window.open("https://www.youtube.com", "_parent")
  }

  const openChatGPT = () => {
    window.open("https://chat.openai.com", "_parent")
  }

  return (
    <>
      <div className="relative z-50 flex flex-col justify-between min-h-screen bg-transparent text-white p-4 overflow-hidden">  
        <div className="absolute top-4 left-4 text-white text-sm z-50">
          New Tabs: {tabCount}
        </div>

        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="mb-2 text-5xl font-light">
            {formatDate(date)}
          </div>
          <div className="text-[200px] font-bold tracking-wider">
            {formatTime(date)}
          </div>
          <Separator className="mt-4" />
        </div>

        {/* New Buttons for YouTube and ChatGPT */}
        <div className="absolute top-3/4 left-1/2 transform -translate-x-1/2 flex gap-4">
          <Button onClick={openYouTube} className="bg-red-600">Open YouTube</Button>
          <Button onClick={openChatGPT} className="bg-blue-600">Open ChatGPT</Button>
          {/* <Button onClick={openTodoApp} className="bg-green-600">Open To-Do</Button> */}

        </div>

        <div className="absolute bottom-4 left-4 flex items-center justify-center gap-4 text-sm">
          <div className="text-xl font-bold mb-2">
            Water Count: {waterCount}
            <div>
              <Button onClick={incrementWaterCount} className="mt-2 bg-green-600">Add Water</Button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 right-4 flex flex-col items-center gap-4">
          <div className="text-2xl font-bold mb-2">
            {formatStopwatchTime(stopwatchTime, stopwatchMicroseconds)}
          </div>
          <div className="flex gap-2">
            <Button onClick={handleStopwatchStart} disabled={isRunning} variant="secondary">Start</Button>
            <Button onClick={handleStopwatchStop} disabled={!isRunning} variant="destructive">Stop</Button>
            <Button onClick={handleStopwatchReset} variant="ghost">Reset</Button>
            {/* <TodoApp /> */}
          </div>
        </div>
              {/* Modal to display TodoApp */}
        {/* <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <TodoApp />
        </Modal> */}
      </div>

      <ParticlesComponent className="absolute inset-0 w-full h-full z-0" />
    </>
  )
}

export default App
