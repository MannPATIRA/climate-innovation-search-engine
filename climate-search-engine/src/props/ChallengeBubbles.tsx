// File: ./props/ChallengeBubbles.tsx
import { useState } from 'react'

interface ChallengeBubblesProps {
  answer: {
    first: string;
    second: string;
    third: string;
  }
  onBubbleSelect: (category: string) => void
}

const bubbleStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '1rem',
  gap: '20px'
}

const individualBubbleStyle = {
  width: '200px',
  height: '75px',
  borderRadius: '50px',
  backgroundColor: '#333',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  color: 'white',
  fontSize: '16px'
}

export const ChallengeBubbles: React.FC<ChallengeBubblesProps> = ({ answer, onBubbleSelect }) => {
  const [hoveredBubble, setHoveredBubble] = useState<string | null>(null)
  const [selectedBubble, setSelectedBubble] = useState<string | null>(null)
  
  const handleBubbleClick = (category: string) => {
    setSelectedBubble(category)
    onBubbleSelect(category)
  }

  return (
    <div style={bubbleStyle}>
      {Object.values(answer).map((category) => (
        <div 
          key={category}
          style={{
            ...individualBubbleStyle,
            backgroundColor: selectedBubble === category 
              ? 'green' 
              : hoveredBubble === category 
                ? 'white' 
                : '#333',
            color: hoveredBubble === category ? 'black' : 'white'
          }}
          onMouseEnter={() => setHoveredBubble(category)}
          onMouseLeave={() => setHoveredBubble(null)}
          onClick={() => handleBubbleClick(category)}
        >
          {category}
        </div>
      ))}
    </div>
  )
}