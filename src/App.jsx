import { useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import Table from './components/Table'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='overflow-x-auto'>
        <Table />
      </div>
      <Analytics />
    </>
  )
}

export default App
