'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import TodoApp from '@/components/TodoApp'
import { Youtube, MessageSquare } from 'lucide-react'
import ParticleComp from './ParticleComp'
import Modal from '@/components/Modal'

export default function HomeDashboard() {
  const [date, setDate] = useState(new Date())
  const [waterCount, setWaterCount] = useState(0)
  const [stopwatchTime, setStopwatchTime] = useState(0)
  const [stopwatchMicroseconds, setStopwatchMicroseconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [tabCount, setTabCount] = useState(0)
  const [showTodo, setShowTodo] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000)
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
      <span className="flex items-center justify-center">
        <span className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl xl:text-[12rem] font-bold tracking-wider">{timePart}</span>
        <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-6xl font-bold ml-2">{ampm}</span>
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

  const openYouTube = () => window.open("https://www.youtube.com", "_parent")
  const openChatGPT = () => window.open("https://chatgpt.com", "_parent")

  return (
    <>
      <ParticleComp className="absolute inset-0 z-0" />
      <div className="flex flex-col justify-between min-h-screen text-white p-4 overflow-hidden relative z-10">
        <div className="absolute top-4 left-4 text-white text-sm z-20">
          New Tabs: {tabCount}
        </div>

        <div className="flex flex-col items-center justify-center flex-grow text-center relative z-20">
          <div className="mb-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light">
            {formatDate(date)}
          </div>
          {formatTime(date)}
          <Separator className="my-4" />

          <div className="flex flex-col sm:flex-row gap-4 mt-4 z-20">
            <Button onClick={openYouTube} className="bg-red-600 hover:bg-red-700">
              <Youtube className="mr-2 h-4 w-4" /> YouTube
            </Button>
            <Button onClick={openChatGPT} className="bg-green-600 hover:bg-green-700">
              <MessageSquare className="mr-2 h-4 w-4" /> ChatGPT
            </Button>
          </div>

          <Button onClick={() => setShowTodo(!showTodo)} className="mt-4 bg-blue-600 hover:bg-blue-700 z-20">
            {showTodo ? 'Hide' : 'Show'} Todo
          </Button>
        </div>

        {showTodo && (
          <Modal isOpen={showTodo} onClose={() => setShowTodo(false)}>
            <TodoApp />
          </Modal>
        )}

        <div className="flex justify-between items-end relative z-20">
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="text-xl font-bold mb-2">
              Water Count: {waterCount}
              <div>
                <Button onClick={incrementWaterCount} className="mt-2 bg-blue-600 hover:bg-blue-700">Add Water</Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="text-2xl font-bold mb-2">
              {formatStopwatchTime(stopwatchTime, stopwatchMicroseconds)}
            </div>
            <div className="flex gap-2">
              <Button onClick={handleStopwatchStart} disabled={isRunning} variant="secondary">Start</Button>
              <Button onClick={handleStopwatchStop} disabled={!isRunning} variant="destructive">Stop</Button>
              <Button onClick={handleStopwatchReset} variant="outline">Reset</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
