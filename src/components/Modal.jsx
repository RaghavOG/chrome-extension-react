// src/components/Modal.js
import { Button } from "@/components/ui/button";

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="">
        <div className=" flex justify-center items-center flex-col h-80 bg-white">
        <Button onClick={onClose} variant="destructive">Close</Button>
          
          {children}</div>
      </div>
    </div>
  );
}
