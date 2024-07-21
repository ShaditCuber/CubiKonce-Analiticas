import { useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import Table from './components/Table'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='flex items-center justify-center'>
        <Table />
      </div>
      <Analytics />
    </>
  )
}

export default App
