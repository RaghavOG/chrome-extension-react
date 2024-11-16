import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import TodoApp from './components/TodoApp'


const root = document.createElement('div')
root.id = 'todo'
document.body.append(root)

createRoot(root).render(
<StrictMode>
    <TodoApp />
</StrictMode>,
)
