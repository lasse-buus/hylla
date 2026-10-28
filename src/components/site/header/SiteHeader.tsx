import type { Navigation } from '@/lib/navigation'

import { Logo } from '../Logo'
import { DepartmentNav } from './DepartmentNav'
import { HeaderActions } from './HeaderActions'
import { SearchForm } from './SearchForm'
import { ServiceBar } from './ServiceBar'

export function SiteHeader({ navigation }: { navigation: Navigation }) {
  return (
    <header className="relative z-30 bg-white">
      <ServiceBar freeShippingThreshold={navigation.freeShippingThreshold} />
      <div className="shop-container flex flex-wrap items-center gap-x-9 gap-y-4 py-[21px]">
        <Logo />
        <div className="order-3 w-full lg:order-none lg:w-auto lg:flex-1">
          <SearchForm />
        </div>
        <div className="ml-auto lg:ml-0">
          <HeaderActions />
        </div>
      </div>
      <DepartmentNav departments={navigation.departments} />
    </header>
  )
}
