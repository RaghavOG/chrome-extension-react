/* eslint-disable react/no-unescaped-entities */
"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Youtube,
  MessageSquare,
  Cloud,
  Sun,
  CloudRain,
  CloudSnow,
  CloudFog,
  Bookmark,
  Clock,
  Search,
  Coffee,
  Droplets,
  StickyNote,
  Quote,
} from "lucide-react"
import ParticleComp from "@/components/ParticleComp"
import Modal from "@/components/Modal"
import TodoApp from "@/components/TodoApp"

export default function HomeDashboard() {
  // Core state from original component
  const [date, setDate] = useState(new Date())
  const [waterCount, setWaterCount] = useState(0)
  const [stopwatchTime, setStopwatchTime] = useState(0)
  const [stopwatchMicroseconds, setStopwatchMicroseconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [tabCount, setTabCount] = useState(0)
  const [showTodo, setShowTodo] = useState(false)

  // New state for added features
  const [weather, setWeather] = useState({ temp: "--", condition: "Loading...", icon: Cloud })
  const [showWeather, setShowWeather] = useState(false)
  const [quickNote, setQuickNote] = useState("")
  const [showNotes, setShowNotes] = useState(false)
  const [focusTimer, setFocusTimer] = useState(25 * 60) // 25 minutes in seconds
  const [isFocusActive, setIsFocusActive] = useState(false)
  const [showFocusTimer, setShowFocusTimer] = useState(false)
  const [bookmarks, setBookmarks] = useState([
    { name: "YouTube", url: "https://www.youtube.com", icon: <Youtube size={16} /> },
    { name: "ChatGPT", url: "https://chat.openai.com", icon: <MessageSquare size={16} /> },
  ])
  const [showBookmarks, setShowBookmarks] = useState(false)
  const [quote, setQuote] = useState({
    text: "The best way to predict the future is to create it.",
    author: "Abraham Lincoln",
  })
  const [showQuote, setShowQuote] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)

  // Original useEffects
  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const storedWaterCount = localStorage.getItem("waterCount")
    const storedStopwatchTime = localStorage.getItem("stopwatchTime")
    const storedTabCount = localStorage.getItem("tabCount")
    const storedDate = localStorage.getItem("lastResetDate")
    const storedQuickNote = localStorage.getItem("quickNote")

    if (storedQuickNote) {
      setQuickNote(storedQuickNote)
    }

    const currentDate = new Date()
    const shouldReset =
      !storedDate ||
      currentDate.getDate() !== new Date(storedDate).getDate() ||
      (currentDate.getHours() >= 5 &&
        currentDate.getMinutes() >= 30 &&
        (new Date(storedDate).getHours() < 5 ||
          (new Date(storedDate).getHours() === 5 && new Date(storedDate).getMinutes() < 30)))

    if (shouldReset) {
      setWaterCount(0)
      setTabCount(1)
      localStorage.setItem("waterCount", "0")
      localStorage.setItem("tabCount", "1")
      localStorage.setItem("lastResetDate", currentDate.toISOString())
    } else {
      setWaterCount(Number.parseInt(storedWaterCount) || 0)
      setTabCount((Number.parseInt(storedTabCount) || 0) + 1)
      localStorage.setItem("tabCount", ((Number.parseInt(storedTabCount) || 0) + 1).toString())
    }

    if (storedStopwatchTime) {
      setStopwatchTime(Number.parseInt(storedStopwatchTime))
    }

    // Simulate weather data (in a real extension, you'd use a weather API)
    simulateWeather()

    // Load random quote
    loadRandomQuote()
  }, [])

  // Load bookmarks from storage
  useEffect(() => {
    const storedBookmarks = localStorage.getItem("bookmarks")
    if (storedBookmarks) {
      try {
        // We can't store React elements in localStorage, so we need to recreate them
        const parsedBookmarks = JSON.parse(storedBookmarks)
        const bookmarksWithIcons = parsedBookmarks.map((bookmark) => {
          let icon = <Bookmark size={16} />
          if (bookmark.name.toLowerCase().includes("youtube")) {
            icon = <Youtube size={16} />
          } else if (bookmark.name.toLowerCase().includes("chat")) {
            icon = <MessageSquare size={16} />
          }
          return { ...bookmark, icon }
        })
        setBookmarks(bookmarksWithIcons)
      } catch (e) {
        console.error("Error parsing bookmarks", e)
      }
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
            setStopwatchTime((prevTime) => {
              const newTime = prevTime + 1
              localStorage.setItem("stopwatchTime", newTime.toString())
              return newTime
            })
          }
          localStorage.setItem("stopwatchMicroseconds", newMicroseconds.toString())
          return newMicroseconds
        })
      }, 100)
    }
    return () => clearInterval(interval)
  }, [isRunning, stopwatchTime])

  // Focus timer effect
  useEffect(() => {
    let interval
    if (isFocusActive && focusTimer > 0) {
      interval = setInterval(() => {
        setFocusTimer((prev) => prev - 1)
      }, 1000)
    } else if (focusTimer === 0) {
      setIsFocusActive(false)
      // Play notification sound or show notification
      if (Notification.permission === "granted") {
        new Notification("Focus Time Complete!", {
          body: "Take a short break before starting another session.",
          icon: "/favicon.ico",
        })
      }
    }
    return () => clearInterval(interval)
  }, [isFocusActive, focusTimer])

  // Save quick note to localStorage
  useEffect(() => {
    localStorage.setItem("quickNote", quickNote)
  }, [quickNote])

  // Format functions from original component
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatTime = (date) => {
    const options = {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }

    const time = date.toLocaleTimeString("en-US", options)
    const [timePart, ampm] = time.split(" ")

    return (
      <span className="flex items-center justify-center">
        <span className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl xl:text-[12rem] font-bold tracking-wider">
          {timePart}
        </span>
        <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-6xl font-bold ml-2">{ampm}</span>
      </span>
    )
  }

  const formatStopwatchTime = (time, microseconds) => {
    const hours = Math.floor(time / 3600)
    const minutes = Math.floor((time % 3600) / 60)
    const seconds = time % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}:${microseconds}`
  }

  // Format focus timer
  const formatFocusTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Original handlers
  const incrementWaterCount = () => {
    const newCount = waterCount + 1
    setWaterCount(newCount)
    localStorage.setItem("waterCount", newCount.toString())
    localStorage.setItem("lastResetDate", new Date().toISOString())
  }

  const handleStopwatchStart = () => setIsRunning(true)
  const handleStopwatchStop = () => setIsRunning(false)
  const handleStopwatchReset = () => {
    setStopwatchTime(0)
    setStopwatchMicroseconds(0)
    setIsRunning(false)
    localStorage.setItem("stopwatchTime", "0")
    localStorage.setItem("stopwatchMicroseconds", "0")
  }

  const openYouTube = () => window.open("https://www.youtube.com", "_parent")
  const openChatGPT = () => window.open("https://chat.openai.com", "_parent")

  // New handlers for added features
  const simulateWeather = () => {
    // In a real extension, you would use a weather API
    const conditions = [
      { temp: "72°F", condition: "Sunny", icon: Sun },
      { temp: "68°F", condition: "Partly Cloudy", icon: Cloud },
      { temp: "58°F", condition: "Rainy", icon: CloudRain },
      { temp: "32°F", condition: "Snowy", icon: CloudSnow },
      { temp: "65°F", condition: "Foggy", icon: CloudFog },
    ]
    const randomWeather = conditions[Math.floor(Math.random() * conditions.length)]
    setWeather(randomWeather)
  }

  const toggleFocusTimer = () => {
    if (isFocusActive) {
      setIsFocusActive(false)
    } else {
      setIsFocusActive(true)
      // Request notification permission if not granted
      if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission()
      }
    }
  }

  const resetFocusTimer = () => {
    setFocusTimer(25 * 60)
    setIsFocusActive(false)
  }

  const addBookmark = () => {
    // In a real extension, you would have a form to add bookmarks
    const newBookmark = {
      name: "New Bookmark",
      url: "https://example.com",
      icon: <Bookmark size={16} />,
    }
    const updatedBookmarks = [...bookmarks, newBookmark]
    setBookmarks(updatedBookmarks)

    // Store bookmarks without the icon property
    const bookmarksForStorage = updatedBookmarks.map(({ name, url }) => ({ name, url }))
    localStorage.setItem("bookmarks", JSON.stringify(bookmarksForStorage))
  }

  const openBookmark = (url) => {
    window.open(url, "_parent")
  }

  const loadRandomQuote = () => {
    const quotes = [
      { text: "The best way to predict the future is to create it.", author: "Abraham Lincoln" },
      {
        text: "The only limit to our realization of tomorrow is our doubts of today.",
        author: "Franklin D. Roosevelt",
      },
      { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
      { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
      { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    ]
    setQuote(quotes[Math.floor(Math.random() * quotes.length)])
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, "_parent")
    }
  }

  // Toggle feature visibility
  const toggleFeature = (feature) => {
    // Close all other features first
    setShowWeather(false)
    setShowNotes(false)
    setShowFocusTimer(false)
    setShowBookmarks(false)
    setShowQuote(false)
    setShowSearch(false)
    setShowTodo(false)

    // Then toggle the requested feature
    switch (feature) {
      case "weather":
        setShowWeather(!showWeather)
        break
      case "notes":
        setShowNotes(!showNotes)
        break
      case "focus":
        setShowFocusTimer(!showFocusTimer)
        break
      case "bookmarks":
        setShowBookmarks(!showBookmarks)
        break
      case "quote":
        setShowQuote(!showQuote)
        break
      case "search":
        setShowSearch(!showSearch)
        break
      case "todo":
        setShowTodo(!showTodo)
        break
      default:
        break
    }
  }

  return (
    <>
      <ParticleComp className="absolute inset-0 z-0" />
      <div className="flex flex-col justify-between min-h-screen text-white p-4 overflow-hidden relative z-10">
        {/* Top bar with tab count and utility buttons */}
        <div className="flex justify-between items-center w-full relative z-20 mb-4">
          <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full">
            <Clock className="h-4 w-4 text-cyan-400" />
            <span className="text-sm font-medium">Tabs: {tabCount}</span>
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-black/30 backdrop-blur-md hover:bg-white/10"
              onClick={() => toggleFeature("weather")}
            >
              <weather.icon className="h-4 w-4 text-cyan-400" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-black/30 backdrop-blur-md hover:bg-white/10"
              onClick={() => toggleFeature("notes")}
            >
              <StickyNote className="h-4 w-4 text-pink-400" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-black/30 backdrop-blur-md hover:bg-white/10"
              onClick={() => toggleFeature("focus")}
            >
              <Coffee className="h-4 w-4 text-amber-400" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-black/30 backdrop-blur-md hover:bg-white/10"
              onClick={() => toggleFeature("bookmarks")}
            >
              <Bookmark className="h-4 w-4 text-purple-400" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-black/30 backdrop-blur-md hover:bg-white/10"
              onClick={() => toggleFeature("quote")}
            >
              <Quote className="h-4 w-4 text-green-400" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-black/30 backdrop-blur-md hover:bg-white/10"
              onClick={() => toggleFeature("search")}
            >
              <Search className="h-4 w-4 text-blue-400" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-black/30 backdrop-blur-md hover:bg-white/10"
              onClick={() => toggleFeature("todo")}
            >
              <span className="font-bold text-indigo-400">✓</span>
            </Button>
          </div>
        </div>

        {/* Main content with time */}
        <div className="flex flex-col items-center justify-center flex-grow text-center relative z-20">
          <div className="mb-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light bg-gradient-to-r from-cyan-400 to-pink-500 text-transparent bg-clip-text">
            {formatDate(date)}
          </div>
          {formatTime(date)}

          <Separator className="my-6 bg-white/20" />

          {/* Quick access buttons */}
          <div className="flex flex-wrap justify-center gap-3 mt-4 z-20 max-w-md mx-auto">
            <Button
              onClick={openYouTube}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 border-none shadow-lg"
            >
              <Youtube className="mr-2 h-4 w-4" /> YouTube
            </Button>
            <Button
              onClick={openChatGPT}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 border-none shadow-lg"
            >
              <MessageSquare className="mr-2 h-4 w-4" /> ChatGPT
            </Button>
          </div>
        </div>

        {/* Bottom bar with water counter and stopwatch */}
        <div className="flex justify-between items-end relative z-20 mt-4">
          {/* Water counter */}
          <div className="flex items-center justify-center gap-4">
            <Card className="bg-black/30 backdrop-blur-md border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-white/10">
                    <Droplets className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-sm text-white/70">Water Intake</div>
                    <div className="text-2xl font-bold">{waterCount} glasses</div>
                  </div>
                </div>
                <Button
                  onClick={incrementWaterCount}
                  className="mt-3 w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 border-none"
                >
                  Add Water
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Stopwatch */}
          <Card className="bg-black/30 backdrop-blur-md border-white/10">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-sm text-white/70 mb-1">Stopwatch</div>
                <div className="text-2xl font-mono font-bold mb-3">
                  {formatStopwatchTime(stopwatchTime, stopwatchMicroseconds)}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleStopwatchStart}
                    disabled={isRunning}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 border-none"
                    size="sm"
                  >
                    Start
                  </Button>
                  <Button
                    onClick={handleStopwatchStop}
                    disabled={!isRunning}
                    className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 border-none"
                    size="sm"
                  >
                    Stop
                  </Button>
                  <Button
                    onClick={handleStopwatchReset}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                    size="sm"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature modals */}
        {showWeather && (
          <Modal isOpen={showWeather} onClose={() => setShowWeather(false)}>
            <div className="p-4 text-center">
              <h2 className="text-2xl font-bold mb-4">Weather</h2>
              <div className="flex flex-col items-center justify-center gap-4">
                <weather.icon className="h-16 w-16 text-cyan-400" />
                <div className="text-4xl font-bold">{weather.temp}</div>
                <div className="text-xl">{weather.condition}</div>
                <p className="text-sm text-white/70 mt-2">
                  This is a simulated weather display. In a real extension, this would use your location to show actual
                  weather data.
                </p>
              </div>
            </div>
          </Modal>
        )}

        {showNotes && (
          <Modal isOpen={showNotes} onClose={() => setShowNotes(false)}>
            <div className="p-4">
              <h2 className="text-2xl font-bold mb-4">Quick Notes</h2>
              <textarea
                className="w-full h-40 p-3 rounded-md bg-gray-700 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Type your notes here..."
                value={quickNote}
                onChange={(e) => setQuickNote(e.target.value)}
              ></textarea>
              <p className="text-sm text-white/70 mt-2">
                Notes are automatically saved to your browser&apos;s local storage.
              </p>
            </div>
          </Modal>
        )}

        {showFocusTimer && (
          <Modal isOpen={showFocusTimer} onClose={() => setShowFocusTimer(false)}>
            <div className="p-4 text-center">
              <h2 className="text-2xl font-bold mb-4">Focus Timer</h2>
              <div className="text-6xl font-mono font-bold mb-6">{formatFocusTime(focusTimer)}</div>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={toggleFocusTimer}
                  className={
                    isFocusActive
                      ? "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 border-none"
                      : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 border-none"
                  }
                >
                  {isFocusActive ? "Pause" : "Start"}
                </Button>
                <Button
                  onClick={resetFocusTimer}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Reset
                </Button>
              </div>
              <p className="text-sm text-white/70 mt-4">
                Focus for 25 minutes, then take a 5-minute break. This is based on the Pomodoro Technique.
              </p>
            </div>
          </Modal>
        )}

        {showBookmarks && (
          <Modal isOpen={showBookmarks} onClose={() => setShowBookmarks(false)}>
            <div className="p-4">
              <h2 className="text-2xl font-bold mb-4">Bookmarks</h2>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {bookmarks.map((bookmark, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="flex items-center justify-start gap-2 border-white/20 text-white hover:bg-white/10"
                    onClick={() => openBookmark(bookmark.url)}
                  >
                    {bookmark.icon}
                    <span className="truncate">{bookmark.name}</span>
                  </Button>
                ))}
              </div>
              <Button
                onClick={addBookmark}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 border-none"
              >
                Add Bookmark
              </Button>
              <p className="text-sm text-white/70 mt-2">
                In a real extension, you would have a form to add custom bookmarks.
              </p>
            </div>
          </Modal>
        )}

        {showQuote && (
          <Modal isOpen={showQuote} onClose={() => setShowQuote(false)}>
            <div className="p-4 text-center">
              <h2 className="text-2xl font-bold mb-4">Quote of the Day</h2>
              <div className="bg-white/10 p-6 rounded-lg mb-4">
                <p className="text-xl italic mb-2">"{quote.text}"</p>
                <p className="text-right text-white/70">— {quote.author}</p>
              </div>
              <Button
                onClick={loadRandomQuote}
                className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 border-none"
              >
                New Quote
              </Button>
            </div>
          </Modal>
        )}

        {showSearch && (
          <Modal isOpen={showSearch} onClose={() => setShowSearch(false)}>
            <div className="p-4">
              <h2 className="text-2xl font-bold mb-4">Quick Search</h2>
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Search Google..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-grow bg-gray-700 text-white border-gray-600"
                />
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 border-none"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>
              <p className="text-sm text-white/70 mt-2">Press Enter to search Google directly.</p>
            </div>
          </Modal>
        )}

        {showTodo && (
          <Modal isOpen={showTodo} onClose={() => setShowTodo(false)}>
            <TodoApp />
          </Modal>
        )}
      </div>
    </>
  )
}
