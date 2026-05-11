import { useState, useEffect } from "react"
import HeroSection from "../components/HeroSection/HeroSection"
import NewArrivals from "../components/NewArrivals/NewArrivals"
import CategorySection from "../components/CategorySection/CategorySection"
import FeaturedProducts from "../components/FeaturedProducts/FeaturedProducts"
import LoadingSpinner from "../components/UI/LoadingSpinner"

export default function HomePage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(t)
  }, [])

  if (loading) return <LoadingSpinner fullScreen message="Welcome to Pepta" />

  return (
    <div className="home-page">
      <HeroSection />
      <NewArrivals />
      <CategorySection />
      <FeaturedProducts />
    </div>
  )
}
