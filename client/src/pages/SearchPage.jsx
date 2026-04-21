import { useSearchParams } from 'react-router-dom'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q')
  
  return (
    <div className="search-page">
      <h1>Search Results for "{query}"</h1>
      {/* Page content will be added */}
    </div>
  )
}
