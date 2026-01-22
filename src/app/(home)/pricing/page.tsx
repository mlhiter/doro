'use client'

import Image from 'next/image'
import { dark } from '@clerk/themes'
import { PricingTable } from '@clerk/nextjs'

import { useCurrentTheme } from '@/hooks/use-current-theme'

const Page = () => {
  const currentTheme = useCurrentTheme()
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col space-y-8">
      <section className="space-y-6 pt-[16vh] 2xl:pt-48">
        <div className="flex flex-col items-center">
          <Image src="/logo.svg" alt="Doro" width={50} height={50} className="hidden md:block" />
        </div>
        <h1 className="text-center text-xl font-bold md:text-3xl">Pricing</h1>
        <p className="text-center text-sm text-muted-foreground md:text-base">Choose the plan that fits your needs.</p>
      </section>
      <PricingTable
        appearance={{
          baseTheme: currentTheme === 'dark' ? dark : undefined,
          elements: {
            pricingTableCard: 'border! shadow-none! rounded-lg!',
          },
        }}
      />
    </div>
  )
}

export default Page
