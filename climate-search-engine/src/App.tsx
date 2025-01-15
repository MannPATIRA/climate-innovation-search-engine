import { useState } from 'react'
import './App.css'
import { ChallengeBubbles } from './props/ChallengeBubbles'

function App() {
  const [question, setQuestion] = useState('')    // Store the user's question
  const [answer, setAnswer] = useState<{
    first: string;
    second: string;
    third: string;
  } | null>(null) // Store the API response
  const [error, setError] = useState<string| null>(null) // To store any error messages

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
      // data should look like { answer: "...some text..." }
      setAnswer({
        first: data.first || 'No first explanation',
        second: data.second || 'No second explanation',
        third: data.third || 'No third explanation'
      })
    } catch (err: any) {
      setError(err.message || 'Something went wrong.')
    }
  }

  return (
    <div style={{ margin: '2rem' }}>
      <h1>Ask a Question</h1>
      
      <textarea
        rows={4}
        cols={100} // width
          style={{
          fontSize: '16px',  // Increases text size
          padding: '10px'    // Optional: adds some padding
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
      {answer && <ChallengeBubbles answer={answer} />}
    </div>
  )
}

export default App
