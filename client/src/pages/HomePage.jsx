import HeroSection from "../components/HeroSection/HeroSection"
import NewArrivals from "../components/NewArrivals/NewArrivals"
import CategorySection from "../components/CategorySection/CategorySection"
import FeaturedProducts from "../components/FeaturedProducts/FeaturedProducts"

export default function HomePage() {
  return (
    <div className="home-page">
      <HeroSection />
      <NewArrivals />
      <CategorySection />
      <FeaturedProducts />
    </div>
  )
}
