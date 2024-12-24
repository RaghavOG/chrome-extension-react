/* eslint-disable react/prop-types */
'use client'

import { useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"

export default function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef()

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick)
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-indigo-800 p-4 rounded-lg w-full max-w-md relative z-60">
        <Button onClick={onClose} variant="destructive" className="absolute top-2 right-2">
          Close
        </Button>
        {children}
      </div>
    </div>
  )
}

