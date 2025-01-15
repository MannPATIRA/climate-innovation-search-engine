import { useState } from 'react'
import './App.css'
import { ChallengeBubbles } from './props/ChallengeBubbles'
import { FilterBox } from './props/FilterBox'

function App() {
  const [question, setQuestion] = useState('')    // Store the user's question
  const [answer, setAnswer] = useState<{
    first: string;
    second: string;
    third: string;
  } | null>(null) // Store the API response
  const [error, setError] = useState<string| null>(null) // To store any error messages
  const [selectedBubble, setSelectedBubble] = useState<string | null>(null)
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [filters, setFilters] = useState<string[]>([])
  const [sliderPosition, setSliderPosition] = useState(50)

  const handleAsk = async () => {
    setError(null)          // Reset any previous errors
    setAnswer(null)         // Clear the old answer before fetching

    try {
      // Call your backend
      console.log("endpoint:", import.meta.env.BACKEND_URL);
      const response = await fetch(
        // This should use the .env file to get the API endpoint
        import.meta.env.VITE_BACKEND_URL,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question }),     // The backend expects { question: "..."}
        }
      )

      // Check if the request was successful
      if (!response.ok) {
        // Attempt to parse any error from JSON
        const errorData = await response.json()
        throw new Error(errorData.error || `Error: ${response.statusText}`)
      }

      // Parse the JSON result
      const data = await response.json()
      setAnswer({
        first: data.first || 'No first explanation',
        second: data.second || 'No second explanation',
        third: data.third || 'No third explanation'
      })
    } catch (err: any) {
      setError(err.message || 'Something went wrong.')
    }
  }

  const handleSearch = async () => {
    setIsSearchActive(true)
    console.log('Searching with:', { selectedBubble, filters })
  }

  const mainContentStyle = {
    display: 'flex',
    minHeight: '100vh',
    position: 'relative' as const,
    overflow: 'hidden',
    margin: 0,          // Ensures content starts from edge
    padding: 0,         // Ensures content starts from edge
    width: '100vw'      // Takes full viewport width
}

  const sideStyle = {
    padding: '2rem',
    boxSizing: 'border-box' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    overflow: 'auto',
    height: '100vh',
    margin: 0           // Ensures content starts from edge
  }

  const leftSideStyle = {
    ...sideStyle,
    width: isSearchActive ? `${sliderPosition}%` : '100%',
    transition: 'width 0.3s ease',
    paddingLeft: '0'    // Ensures content starts from edge
  }

  const rightSideStyle = {
    ...sideStyle,
    width: `${100 - sliderPosition}%`,
    borderLeft: '2px solid white'
  }

  const sliderStyle = {
    position: 'absolute' as const,
    top: 0,
    bottom: 0,
    left: `${sliderPosition}%`,
    width: '10px',
    background: 'white',
    cursor: 'col-resize',
    transform: 'translateX(-50%)',
    display: isSearchActive ? 'block' : 'none'
  }

  const searchButtonStyle = {
    padding: '20px 40px',
    fontSize: '18px',
    backgroundColor: '#333',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    marginTop: '20px',
    transition: 'all 0.3s ease'
  }

  const handleMouseDown = () => {
    const handleMouseMove = (e: MouseEvent) => {
      const newPosition = (e.clientX / window.innerWidth) * 100
      setSliderPosition(Math.min(Math.max(newPosition, 20), 80))
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  return (
    <div style={mainContentStyle}>
      <div style={leftSideStyle}>
        <h1>Ask a Question</h1>
        <br /><br />
        
        <textarea
          rows={4}
          cols={100}
          style={{
            fontSize: '16px',
            padding: '10px',
            maxWidth: '100%'
          }}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type your question here..."
        />
        <br /><br />

        <button onClick={handleAsk}>
          Ask
        </button>
        <br /><br />

        {/* If there's an error, display it */}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}

        {/* If there's an answer, display it */}
        {answer && (
          <>
            <ChallengeBubbles 
              answer={answer} 
              onBubbleSelect={setSelectedBubble} 
            />
            <br />
            {selectedBubble && (
              <>
                <FilterBox onFilterSubmit={(filter) => {
                  setFilters([...filters, filter])
                }} />
                <button 
                  style={searchButtonStyle}
                  onClick={handleSearch}
                >
                  Search Papers
                </button>
              </>
            )}
          </>
        )}
      </div>
      
      {isSearchActive && (
        <>
          <div style={sliderStyle} onMouseDown={handleMouseDown} />
          <div style={rightSideStyle}>
            <h2>Search Results</h2>
          </div>
        </>
      )}
    </div>
  )
}

export default App