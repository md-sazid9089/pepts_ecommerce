import { Link, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { buildBreadcrumb, getBreadcrumbBackground, shouldShowBreadcrumb } from '@/utils/breadcrumbHelper'
import { queryKeys } from '@/lib/queryKeys'
import productsApi from '@/services/api/products.api'

const styles = {
  nav: (backgroundColor) => ({
    width: '100%',
    backgroundColor,
    borderBottom: 'none',
  }),
  inner: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0.75rem 1rem',
  },
  list: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    flexWrap: 'wrap',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    fontSize: '0.875rem',
    lineHeight: 1.4,
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    minWidth: 0,
  },
  link: {
    color: '#64748b',
    textDecoration: 'none',
    transition: 'color 0.2s ease',
  },
  current: {
    color: '#1f2937',
    fontWeight: 700,
    display: 'inline-block',
    maxWidth: 'min(58vw, 520px)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    verticalAlign: 'bottom',
  },
  separator: {
    color: '#94a3b8',
    userSelect: 'none',
  },
}

function getProductId(pathname) {
  const match = pathname.match(/^\/product\/([^/?#]+)/)
  return match ? Number(match[1]) : null
}

export default function Breadcrumb() {
  const { pathname } = useLocation()
  const productId = getProductId(pathname)

  const { data: product, isLoading } = useQuery({
    queryKey: queryKeys.products.detail(productId),
    queryFn: async () => {
      const response = await productsApi.getById(productId)
      return response.data
    },
    enabled: Boolean(productId),
    staleTime: 1000 * 60 * 2,
  })

  if (!shouldShowBreadcrumb(pathname)) return null

  const dynamicLabel = productId
    ? isLoading
      ? 'Loading...'
      : product?.title || product?.name || 'Product'
    : undefined
  const items = buildBreadcrumb(pathname, dynamicLabel)

  if (!items.length) return null

  return (
    <nav aria-label="Breadcrumb" style={styles.nav(getBreadcrumbBackground(pathname))}>
      <div style={styles.inner}>
        <ol style={styles.list}>
          {items.map((item, index) => {
            const isLast = index === items.length - 1

            return (
              <li key={`${item.label}-${index}`} style={styles.item}>
                {item.path && !isLast ? (
                  <Link
                    to={item.path}
                    style={styles.link}
                    onMouseEnter={(event) => { event.currentTarget.style.color = '#1f2937' }}
                    onMouseLeave={(event) => { event.currentTarget.style.color = styles.link.color }}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span style={styles.current}>{item.label}</span>
                )}
                {!isLast && <span style={styles.separator}>›</span>}
              </li>
            )
          })}
        </ol>
      </div>
    </nav>
  )
}
