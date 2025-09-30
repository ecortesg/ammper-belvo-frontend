import { getInstitutions, getLinks } from "@/server/actions"
import { PageHeader } from "@/components/page-header"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"

import { LandmarkIcon } from "lucide-react"
import Link from "next/link"
import { BankLink, Institution } from "@/lib/types"

export default async function BanksPage() {
  const [institutions, links]: [
    { results: Institution[] },
    { results: BankLink[] }
  ] = await Promise.all([getInstitutions(), getLinks()])

  const linkedInstitutions = new Set(
    links.results.map((link: BankLink) => link.institution)
  )

  return (
    <>
      <PageHeader title="Banks" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {institutions.results
          .filter((institution: Institution) =>
            linkedInstitutions.has(institution.name)
          )
          .map((institution: Institution) => (
            <Link key={institution.id} href={`/banks/${institution.id}`}>
              <Card className="flex h-full flex-col justify-between shadow-sm transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle className="flex gap-3">
                    <LandmarkIcon className="size-5 shrink-0 text-primary sm:size-7" />
                    <h3 className="text-base font-semibold text-gray-900 sm:text-lg">
                      {institution.display_name}
                    </h3>
                  </CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ))}
      </div>
    </>
  )
}
