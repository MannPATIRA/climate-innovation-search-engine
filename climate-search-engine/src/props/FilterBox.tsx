import { useState } from 'react'

interface FilterBoxProps {
  onFilterSubmit: (filter: string) => void
}

const filterContainerStyle = {
  marginTop: '20px',
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  gap: '15px'
}

const filterInputStyle = {
  width: '300px',
  padding: '10px',
  fontSize: '16px',
  borderRadius: '5px',
  border: '1px solid #ccc'
}

const filterTagsContainer = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: '10px',
  justifyContent: 'center'
}

const filterTagStyle = {
  padding: '5px 15px',
  borderRadius: '25px',
  backgroundColor: '#333',
  color: 'white',
  border: '1px solid white',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  cursor: 'pointer',
  transition: 'all 0.3s ease'
}

export const FilterBox: React.FC<FilterBoxProps> = ({ onFilterSubmit }) => {
  const [filter, setFilter] = useState<string>('')
  const [filters, setFilters] = useState<string[]>([])
  const [hoveredFilter, setHoveredFilter] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (filter.trim() && !filters.includes(filter.trim())) {
      setFilters([...filters, filter.trim()])
      onFilterSubmit(filter.trim())
      setFilter('')
    }
  }

  const removeFilter = (filterToRemove: string) => {
    setFilters(filters.filter(f => f !== filterToRemove))
  }

  return (
    <div style={filterContainerStyle}>
      <form onSubmit={handleSubmit}>
        <input 
          type="text"
          style={filterInputStyle}
          placeholder="Add filters (e.g., Leeds, London)"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </form>

      <div style={filterTagsContainer}>
        {filters.map((filterTag) => (
          <div
            key={filterTag}
            style={{
              ...filterTagStyle,
              backgroundColor: hoveredFilter === filterTag ? 'white' : '#333',
              color: hoveredFilter === filterTag ? 'black' : 'white',
            }}
            onMouseEnter={() => setHoveredFilter(filterTag)}
            onMouseLeave={() => setHoveredFilter(null)}
          >
            {filterTag}
            <span 
              onClick={() => removeFilter(filterTag)}
              style={{ fontSize: '18px', fontWeight: 'bold' }}
            >
              ×
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}