import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Account, BankLink } from "@/lib/types"
import {
  getAccountsByInstitutionName,
  getInstitutionById,
  getLinks,
} from "@/server/actions"
import { CreditCardIcon, UsersIcon } from "lucide-react"
import Link from "next/link"

export default async function IndividualBankPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [institution, links] = await Promise.all([
    getInstitutionById(id),
    getLinks(),
  ])

  const institutionLink = links.results.find(
    (link: BankLink) => link.institution === institution.name
  )

  const accounts = await getAccountsByInstitutionName(
    institution.name,
    institutionLink.id
  )

  return (
    <>
      <PageHeader title={`Accounts - ${institution.display_name}`} />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {accounts.results.map((account: Account) => (
          <Link key={account.id} href={`/accounts/${account.id}`}>
            <Card className="flex h-full flex-col justify-between shadow-sm transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex gap-3">
                  <CreditCardIcon className="size-5 shrink-0 text-primary sm:size-7" />
                  <h3 className="text-base font-semibold text-gray-900 sm:text-lg">
                    {account.name}
                  </h3>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <UsersIcon className="h-4 w-4" />
                    <span>{account.type}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </>
  )
}
