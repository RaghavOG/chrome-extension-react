import { useState, useEffect } from 'react'
import { Plus, Trash2, Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TodoApp() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')

  useEffect(() => {
    const storedTodos = localStorage.getItem('todos')
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos))
    }
    document.documentElement.classList.add('dark') // Enforce dark theme
  }, [])

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    if (newTodo.trim() !== '') {
      setTodos([...todos, { id: Date.now(), text: newTodo, done: false }])
      setNewTodo('')
    }
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, done: !todo.done } : todo
    ))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 dark">
      <Card className="w-full max-w-md mx-auto bg-gray-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold text-center text-white">Todo List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Input
              type="text"
              placeholder="Add a new todo"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              className="flex-grow bg-gray-700 text-white"
            />
            <Button onClick={addTodo} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
          <ul className="space-y-2">
            {todos.map(todo => (
              <li key={todo.id} className="flex items-center space-x-2 bg-gray-700 p-2 rounded">
                <Button
                  variant={todo.done ? "default" : "outline"}
                  size="icon"
                  className={`w-6 h-6 p-0 ${todo.done ? 'bg-green-600' : 'bg-gray-600'}`}
                  onClick={() => toggleTodo(todo.id)}
                >
                  <Check className={`w-4 h-4 ${todo.done ? 'text-white' : 'text-gray-300'} ${todo.done ? 'opacity-100' : 'opacity-0'}`} />
                </Button>
                <span className={`flex-grow ${todo.done ? 'line-through text-gray-400' : 'text-white'}`}>
                  {todo.text}
                </span>
                <Button
                  variant="destructive"
                  size="icon"
                  className="w-6 h-6 p-0 bg-red-600 hover:bg-red-700"
                  onClick={() => deleteTodo(todo.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
