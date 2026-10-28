import { SiteFooter } from '@/components/site/footer/SiteFooter'
import { SiteHeader } from '@/components/site/header/SiteHeader'
import { getNavigation } from '@/lib/navigation'

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const navigation = await getNavigation()

  return (
    <>
      <SiteHeader navigation={navigation} />
      <main id="innhold" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </>
  )
}
