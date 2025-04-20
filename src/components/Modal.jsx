/* eslint-disable react/prop-types */
"use client"

import { useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export default function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef()

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose()
      }
    }

    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick)
      document.addEventListener("keydown", handleEscapeKey)
      document.body.style.overflow = "hidden" // Prevent scrolling when modal is open
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
      document.removeEventListener("keydown", handleEscapeKey)
      document.body.style.overflow = "" // Restore scrolling when modal is closed
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-gradient-to-br from-gray-900 to-indigo-900 p-6 rounded-xl w-full max-w-md relative z-60 border border-white/10 shadow-xl"
      >
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 rounded-full hover:bg-white/10 text-white"
        >
          <X className="h-5 w-5" />
        </Button>
        {children}
      </div>
    </div>
  )
}
