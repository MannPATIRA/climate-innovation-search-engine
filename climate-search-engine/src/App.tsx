import { useState } from 'react'
import './App.css'

function App() {
  const [question, setQuestion] = useState('')    // Store the user's question
  const [answer, setAnswer] = useState('')        // Store the API response
  const [error, setError] = useState<string| null>(null) // To store any error messages

  const handleAsk = async () => {
    setError(null)          // Reset any previous errors
    setAnswer('')           // Clear the old answer before fetching

    try {
      // Call your backend
      const response = await fetch(
        'https://climate-innovation-backend-production.up.railway.app/api/ask',
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
      // data should look like { answer: "...some text..." }
      setAnswer(data.answer || 'No answer returned')
    } catch (err: any) {
      setError(err.message || 'Something went wrong.')
    }
  }

  return (
    <div style={{ margin: '2rem' }}>
      <h1>Ask a Question</h1>
      
      <textarea
        rows={4}
        cols={50}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Type your question here..."
      />
      <br /><br />

      <button onClick={handleAsk}>
        Ask
      </button>

      {/* If there's an error, display it */}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {/* If there's an answer, display it */}
      {answer && (
        <div style={{ marginTop: '1rem' }}>
          <strong>Response:</strong>
          <p>{answer}</p>
        </div>
      )}
    </div>
  )
}

export default App
