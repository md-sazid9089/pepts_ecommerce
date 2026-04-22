import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="not-found-page">
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you&apos;re looking for doesn&apos;t exist.</p>
      <Link to="/">Go back to home</Link>
    </div>
  )
}
