import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX } from "react-icons/fi"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery("")
    }
  }

  return (
    <header className="bg-cream-50 shadow-sm sticky top-0 z-50 border-b border-cream-200">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="hidden md:flex justify-between items-center text-xs py-2 border-b border-cream-200 text-charcoal-600">
          <div className="flex gap-6">
            <a href="#" className="hover:text-brown-700 transition">Sell on Pepta</a>
            <a href="#" className="hover:text-brown-700 transition">Customer Care</a>
            <a href="#" className="hover:text-brown-700 transition">Track Order</a>
          </div>
          <div className="flex gap-6">
            <Link to="/login" className="hover:text-brown-700 transition">Login</Link>
            <Link to="/register" className="hover:text-brown-700 transition">Signup</Link>
            <a href="#" className="hover:text-brown-700 transition">Language</a>
          </div>
        </div>

        {/* Main Header */}
        <div className="flex items-center justify-between gap-4 py-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 font-bold text-xl text-brown-700">
            <span className="bg-brown-700 text-cream-50 px-3 py-1 rounded">Pepta</span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="flex-1 px-4 py-2 border border-cream-200 rounded-l focus:outline-none focus:border-rose-200 focus:ring-2 focus:ring-rose-200/20"
            />
            <button type="submit" className="bg-brown-700 text-cream-50 px-4 py-2 rounded-r hover:bg-brown-800 transition">
              <FiSearch size={18} />
            </button>
          </form>

          {/* User Links */}
          <div className="flex items-center gap-4">
            <Link to="/login" className="hidden md:block text-charcoal-700 hover:text-brown-700 transition">
              <FiUser size={20} />
            </Link>
            <Link to="/cart" className="relative text-charcoal-700 hover:text-brown-700 transition">
              <FiShoppingCart size={20} />
              <span className="absolute -top-2 -right-2 bg-rose-200 text-brown-700 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">0</span>
            </Link>
          </div>

          {/* Mobile Menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-brown-700"
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 border-t border-cream-200 flex flex-col gap-2 pt-4">
            <Link to="/" className="px-4 py-2 hover:bg-cream-100 text-charcoal-700 rounded transition">Home</Link>
            <Link to="/products" className="px-4 py-2 hover:bg-cream-100 text-charcoal-700 rounded transition">Products</Link>
            <Link to="/categories" className="px-4 py-2 hover:bg-cream-100 text-charcoal-700 rounded transition">Categories</Link>
            <Link to="/about" className="px-4 py-2 hover:bg-cream-100 text-charcoal-700 rounded transition">About</Link>
            <Link to="/contact" className="px-4 py-2 hover:bg-cream-100 text-charcoal-700 rounded transition">Contact</Link>
            <hr className="my-2 border-cream-200" />
            <Link to="/login" className="px-4 py-2 hover:bg-cream-100 text-charcoal-700 rounded transition">Login</Link>
            <Link to="/register" className="px-4 py-2 hover:bg-cream-100 text-charcoal-700 rounded transition">Register</Link>
          </nav>
        )}
      </div>
    </header>
  )
}
