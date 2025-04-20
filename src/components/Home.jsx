/* eslint-disable react/no-unescaped-entities */
"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ParticleComp from "@/components/ParticleComp"
import Modal from "@/components/Modal"
import TodoApp from "@/components/TodoApp"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
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
  Camera,
  Trash2,
} from "lucide-react"

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
  const [weather, setWeather] = useState({
    temp: "--",
    condition: "Loading...",
    icon: Cloud,
    loading: true,
    error: null,
  })
  const [showWeather, setShowWeather] = useState(false)
  const [quickNote, setQuickNote] = useState("")
  const [showNotes, setShowNotes] = useState(false)
  const [focusTimer, setFocusTimer] = useState(25 * 60) // 25 minutes in seconds
  const [isFocusActive, setIsFocusActive] = useState(false)
  const [showFocusTimer, setShowFocusTimer] = useState(false)
  const [bookmarks, setBookmarks] = useState([
    {
      name: "YouTube",
      url: "https://www.youtube.com",
      icon: <Youtube size={16} />,
    },
    {
      name: "ChatGPT",
      url: "https://chat.openai.com",
      icon: <MessageSquare size={16} />,
    },
  ])
  const [showBookmarks, setShowBookmarks] = useState(false)
  const [newBookmark, setNewBookmark] = useState({ name: "", url: "" })
  const [quote, setQuote] = useState({
    text: "The best way to predict the future is to create it.",
    author: "Abraham Lincoln",
  })
  const [showQuote, setShowQuote] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)

  // New features
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showPasswordGenerator, setShowPasswordGenerator] = useState(false)
  const [password, setPassword] = useState("")
  const [passwordLength, setPasswordLength] = useState(12)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [showNews, setShowNews] = useState(false)
  const [news, setNews] = useState([])
  const [showScreenshot, setShowScreenshot] = useState(false)

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

    // Get real weather data
    fetchWeatherData()

    // Load random quote
    loadRandomQuote()

    // Load news headlines
    fetchNewsHeadlines()
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
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}:${microseconds}`
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
  const fetchWeatherData = async () => {
    try {
      setWeather((prev) => ({ ...prev, loading: true, error: null }))

      // First get user's location
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        })
      })

      const { latitude, longitude } = position.coords

      const apiKey = "YOUR_API_KEY" // Replace with your actual API key
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`,
      )

      if (!response.ok) {
        throw new Error("Weather data not available")
      }

      const data = await response.json()

      // Map weather condition to icon
      let icon = Cloud
      const weatherId = data.weather[0].id

      if (weatherId >= 200 && weatherId < 300)
        icon = CloudRain // Thunderstorm
      else if (weatherId >= 300 && weatherId < 400)
        icon = CloudRain // Drizzle
      else if (weatherId >= 500 && weatherId < 600)
        icon = CloudRain // Rain
      else if (weatherId >= 600 && weatherId < 700)
        icon = CloudSnow // Snow
      else if (weatherId >= 700 && weatherId < 800)
        icon = CloudFog // Atmosphere (fog, mist, etc)
      else if (weatherId === 800)
        icon = Sun // Clear sky
      else if (weatherId > 800) icon = Cloud // Clouds

      setWeather({
        temp: `${Math.round(data.main.temp)}°F`,
        condition: data.weather[0].main,
        icon,
        loading: false,
        error: null,
      })
    } catch (error) {
      console.error("Error fetching weather:", error)

      // Fallback to simulated weather if API fails
      const conditions = [
        { temp: "72°F", condition: "Sunny", icon: Sun },
        { temp: "68°F", condition: "Partly Cloudy", icon: Cloud },
        { temp: "58°F", condition: "Rainy", icon: CloudRain },
        { temp: "32°F", condition: "Snowy", icon: CloudSnow },
        { temp: "65°F", condition: "Foggy", icon: CloudFog },
      ]
      const randomWeather = conditions[Math.floor(Math.random() * conditions.length)]

      setWeather({
        ...randomWeather,
        loading: false,
        error: "Using simulated weather. " + error.message,
      })
    }
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

  const handleBookmarkSubmit = (e) => {
    e.preventDefault()

    if (!newBookmark.name.trim() || !newBookmark.url.trim()) {
      return
    }

    // Add http:// if not present
    let url = newBookmark.url
    if (!/^https?:\/\//i.test(url)) {
      url = "https://" + url
    }

    // Determine icon based on URL
    let icon = <Bookmark size={16} />
    if (url.includes("youtube")) {
      icon = <Youtube size={16} />
    } else if (url.includes("chat.openai")) {
      icon = <MessageSquare size={16} />
    }

    const bookmark = {
      name: newBookmark.name,
      url: url,
      icon: icon,
    }

    const updatedBookmarks = [...bookmarks, bookmark]
    setBookmarks(updatedBookmarks)

    // Store bookmarks without the icon property
    const bookmarksForStorage = updatedBookmarks.map(({ name, url }) => ({
      name,
      url,
    }))
    localStorage.setItem("bookmarks", JSON.stringify(bookmarksForStorage))

    // Reset form
    setNewBookmark({ name: "", url: "" })
  }

  const deleteBookmark = (index) => {
    const updatedBookmarks = [...bookmarks]
    updatedBookmarks.splice(index, 1)
    setBookmarks(updatedBookmarks)

    // Update storage
    const bookmarksForStorage = updatedBookmarks.map(({ name, url }) => ({
      name,
      url,
    }))
    localStorage.setItem("bookmarks", JSON.stringify(bookmarksForStorage))
  }

  const openBookmark = (url) => {
    window.open(url, "_parent")
  }

  const loadRandomQuote = () => {
    const quotes = [
      {
        text: "The best way to predict the future is to create it.",
        author: "Abraham Lincoln",
      },
      {
        text: "The only limit to our realization of tomorrow is our doubts of today.",
        author: "Franklin D. Roosevelt",
      },
      {
        text: "It always seems impossible until it's done.",
        author: "Nelson Mandela",
      },
      {
        text: "Don't watch the clock; do what it does. Keep going.",
        author: "Sam Levenson",
      },
      {
        text: "The future belongs to those who believe in the beauty of their dreams.",
        author: "Eleanor Roosevelt",
      },
    ]
    setQuote(quotes[Math.floor(Math.random() * quotes.length)])
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, "_parent")
    }
  }

  // New feature handlers
  const generatePassword = () => {
    const charset = {
      lowercase: "abcdefghijklmnopqrstuvwxyz",
      uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      numbers: "0123456789",
      symbols: "!@#$%^&*()_+~`|}{[]:;?><,./-=",
    }

    let chars = charset.lowercase + charset.uppercase
    if (includeNumbers) chars += charset.numbers
    if (includeSymbols) chars += charset.symbols

    let password = ""
    for (let i = 0; i < passwordLength; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    setPassword(password)
  }

  const copyPassword = () => {
    navigator.clipboard.writeText(password)
    alert("Password copied to clipboard!")
  }

  const fetchNewsHeadlines = async () => {
    try {
      // In a real extension, you would use a news API
      // This is simulated news data
      const simulatedNews = [
        {
          title: "New Breakthrough in Renewable Energy Technology",
          source: "Tech Today",
        },
        {
          title: "Global Markets See Unexpected Rise Amid Economic Concerns",
          source: "Finance Weekly",
        },
        {
          title: "Scientists Discover Potential New Treatment for Common Disease",
          source: "Health Report",
        },
        {
          title: "Major Sports Team Wins Championship After Decades",
          source: "Sports News",
        },
        {
          title: "New Environmental Policy Announced by Government",
          source: "World News",
        },
      ]

      setNews(simulatedNews)
    } catch (error) {
      console.error("Error fetching news:", error)
      setNews([{ title: "Could not load news headlines", source: "Error" }])
    }
  }

  const captureScreenshot = () => {
    // In a browser extension, you would use the chrome.tabs API
    // This is just a placeholder function
    alert(
      "In a real Chrome extension, this would capture the current tab screenshot using chrome.tabs.captureVisibleTab()",
    )
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
    setShowColorPicker(false)
    setShowPasswordGenerator(false)
    setShowNews(false)
    setShowScreenshot(false)

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
      case "color":
        setShowColorPicker(!showColorPicker)
        break
      case "password":
        setShowPasswordGenerator(!showPasswordGenerator)
        if (!showPasswordGenerator && !password) {
          generatePassword()
        }
        break
      case "news":
        setShowNews(!showNews)
        break
      case "screenshot":
        setShowScreenshot(!showScreenshot)
        break
      default:
        break
    }
  }

  // Feature icons for the vertical menu
  const featureIcons = [
    {
      name: "Notes",
      icon: <StickyNote className="h-5 w-5" />,
      action: () => toggleFeature("notes"),
    },
    {
      name: "Focus Timer",
      icon: <Coffee className="h-5 w-5" />,
      action: () => toggleFeature("focus"),
    },
    {
      name: "Bookmarks",
      icon: <Bookmark className="h-5 w-5" />,
      action: () => toggleFeature("bookmarks"),
    },
    {
      name: "Todo List",
      icon: <span className="font-bold">✓</span>,
      action: () => toggleFeature("todo"),
    },
  ]

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

          {/* Empty div to maintain flex layout */}
          <div></div>
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
                    <div className="text-2xl font-bold text-white">{waterCount} glasses</div>
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
                <div className="text-2xl font-mono font-bold mb-3 text-white">
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

        {/* Vertical feature menu in top right */}
        <div className="fixed top-4 right-4 z-30 flex flex-col gap-2">
          {featureIcons.map((item, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-black/30 backdrop-blur-md rounded-full hover:bg-white/10 transition-all duration-200 group"
                    onClick={item.action}
                  >
                    <span className="text-cyan-400 group-hover:text-pink-400 transition-colors">{item.icon}  </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>{item.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>

        {/* Feature modals */}
        {showWeather && (
          <Modal isOpen={showWeather} onClose={() => setShowWeather(false)}>
            <div className="p-4 text-center">
              <h2 className="text-2xl font-bold mb-4">Weather</h2>
              {weather.loading ? (
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
                  <p>Loading weather data...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-4">
                  <weather.icon className="h-16 w-16 text-cyan-400" />
                  <div className="text-4xl font-bold">{weather.temp}</div>
                  <div className="text-xl">{weather.condition}</div>
                  {weather.error && <p className="text-sm text-red-400 mt-2">{weather.error}</p>}
                  <Button
                    onClick={fetchWeatherData}
                    className="mt-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                  >
                    Refresh Weather
                  </Button>
                </div>
              )}
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
                Notes are automatically saved to your browser's local storage.
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

              {/* Bookmark form */}
              <form onSubmit={handleBookmarkSubmit} className="mb-4 p-4 bg-white/10 rounded-lg">
                <div className="mb-3">
                  <Label htmlFor="bookmarkName" className="text-sm font-medium mb-1 block">
                    Name
                  </Label>
                  <Input
                    id="bookmarkName"
                    type="text"
                    placeholder="Website Name"
                    value={newBookmark.name}
                    onChange={(e) => setNewBookmark({ ...newBookmark, name: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                    required
                  />
                </div>

                <div className="mb-3">
                  <Label htmlFor="bookmarkUrl" className="text-sm font-medium mb-1 block">
                    URL
                  </Label>
                  <Input
                    id="bookmarkUrl"
                    type="text"
                    placeholder="https://example.com"
                    value={newBookmark.url}
                    onChange={(e) => setNewBookmark({ ...newBookmark, url: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 border-none"
                >
                  Add Bookmark
                </Button>
              </form>

              {/* Bookmarks list */}
              <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-1">
                {bookmarks.map((bookmark, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white/10 p-2 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <Button
                      variant="ghost"
                      className="flex items-center justify-start gap-2 text-white hover:bg-transparent hover:text-cyan-400 flex-grow text-left"
                      onClick={() => openBookmark(bookmark.url)}
                    >
                      {bookmark.icon}
                      <span className="truncate">{bookmark.name}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white/60 hover:text-red-400 hover:bg-red-500/20"
                      onClick={() => deleteBookmark(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {bookmarks.length === 0 && (
                <p className="text-center text-white/60 py-4">No bookmarks yet. Add one above!</p>
              )}
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

        {showColorPicker && (
          <Modal isOpen={showColorPicker} onClose={() => setShowColorPicker(false)}>
            <div className="p-4">
              <h2 className="text-2xl font-bold mb-4">Color Picker</h2>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-5 gap-2">
                  {[
                    "#FF5733",
                    "#33FF57",
                    "#3357FF",
                    "#F3FF33",
                    "#FF33F3",
                    "#33FFF3",
                    "#FF3333",
                    "#33FF33",
                    "#3333FF",
                    "#FFFFFF",
                  ].map((color, index) => (
                    <div
                      key={index}
                      className="h-12 w-full rounded-md cursor-pointer border border-white/20 transition-transform hover:scale-110"
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        navigator.clipboard.writeText(color)
                        alert(`Color ${color} copied to clipboard!`)
                      }}
                    />
                  ))}
                </div>
                <div className="mt-2">
                  <Label htmlFor="customColor" className="text-sm font-medium mb-1 block">
                    Custom Color
                  </Label>
                  <input
                    type="color"
                    id="customColor"
                    className="w-full h-12 rounded-md cursor-pointer bg-transparent"
                    onChange={(e) => {
                      navigator.clipboard.writeText(e.target.value)
                      alert(`Color ${e.target.value} copied to clipboard!`)
                    }}
                  />
                </div>
                <p className="text-sm text-white/70 mt-2">Click on any color to copy its hex value to clipboard.</p>
              </div>
            </div>
          </Modal>
        )}

        {showPasswordGenerator && (
          <Modal isOpen={showPasswordGenerator} onClose={() => setShowPasswordGenerator(false)}>
            <div className="p-4">
              <h2 className="text-2xl font-bold mb-4">Password Generator</h2>

              <div className="bg-white/10 p-3 rounded-lg mb-4 flex">
                <Input
                  type="text"
                  value={password}
                  readOnly
                  className="bg-transparent border-none text-white font-mono"
                />
                <Button onClick={copyPassword} variant="ghost" className="text-white hover:bg-white/10">
                  Copy
                </Button>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <Label htmlFor="passwordLength" className="text-sm font-medium mb-1 block">
                    Length: {passwordLength}
                  </Label>
                  <input
                    id="passwordLength"
                    type="range"
                    min="8"
                    max="32"
                    value={passwordLength}
                    onChange={(e) => setPasswordLength(Number.parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    id="includeNumbers"
                    type="checkbox"
                    checked={includeNumbers}
                    onChange={() => setIncludeNumbers(!includeNumbers)}
                    className="rounded"
                  />
                  <Label htmlFor="includeNumbers">Include Numbers</Label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    id="includeSymbols"
                    type="checkbox"
                    checked={includeSymbols}
                    onChange={() => setIncludeSymbols(!includeSymbols)}
                    className="rounded"
                  />
                  <Label htmlFor="includeSymbols">Include Symbols</Label>
                </div>
              </div>

              <Button
                onClick={generatePassword}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 border-none"
              >
                Generate New Password
              </Button>
            </div>
          </Modal>
        )}

        {showNews && (
          <Modal isOpen={showNews} onClose={() => setShowNews(false)}>
            <div className="p-4">
              <h2 className="text-2xl font-bold mb-4">News Headlines</h2>

              <div className="space-y-3 max-h-80 overflow-y-auto">
                {news.map((item, index) => (
                  <div key={index} className="p-3 bg-white/10 rounded-lg hover:bg-white/15 transition-colors">
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-white/70 mt-1">Source: {item.source}</p>
                  </div>
                ))}
              </div>

              <Button
                onClick={fetchNewsHeadlines}
                className="w-full mt-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 border-none"
              >
                Refresh Headlines
              </Button>

              <p className="text-sm text-white/70 mt-2">
                This is simulated news data. In a real extension, this would use a news API.
              </p>
            </div>
          </Modal>
        )}

        {showScreenshot && (
          <Modal isOpen={showScreenshot} onClose={() => setShowScreenshot(false)}>
            <div className="p-4 text-center">
              <h2 className="text-2xl font-bold mb-4">Screenshot Tool</h2>

              <div className="bg-white/10 p-6 rounded-lg mb-4">
                <Camera className="h-16 w-16 mx-auto text-cyan-400 mb-4" />
                <p className="text-lg mb-4">Capture the current tab as a screenshot</p>
                <Button
                  onClick={captureScreenshot}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 border-none"
                >
                  Take Screenshot
                </Button>
              </div>

              <p className="text-sm text-white/70 mt-2">
                In a real Chrome extension, this would use chrome.tabs.captureVisibleTab() API.
              </p>
            </div>
          </Modal>
        )}
      </div>
    </>
  )
}
