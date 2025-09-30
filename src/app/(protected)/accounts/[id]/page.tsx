import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAccountById, getTransactionsByAccountId } from "@/server/actions"
import { CircleDollarSignIcon } from "lucide-react"
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table"
import { Transaction } from "@/lib/types"

export default async function IndividualAccountPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const account = await getAccountById(id)

  const transactions = await getTransactionsByAccountId(
    account.id,
    account.link
  )

  const sortedTransactions = [...transactions.results].sort((a, b) => {
    return new Date(b.value_date).getTime() - new Date(a.value_date).getTime()
  })

  return (
    <>
      <PageHeader title={account.name} />
      <Card className="max-w-md shadow-sm">
        <CardHeader>
          <CardTitle className="flex gap-3">
            <CircleDollarSignIcon className="size-5 shrink-0 text-primary sm:size-7" />
            <h3 className="text-base font-semibold text-gray-900 sm:text-lg">
              Balance
            </h3>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600">
            <p>
              <strong>Current:</strong> {account.balance.current}
            </p>
            <p>
              <strong>Available:</strong> {account.balance.available}
            </p>
          </div>
        </CardContent>
      </Card>
      <h2 className="mt-10 mb-4 text-2xl font-semibold">Transactions</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {sortedTransactions.map((tx: Transaction) => (
            <TableRow key={tx.id}>
              <TableCell>
                {new Date(tx.value_date).toLocaleDateString()}
              </TableCell>
              <TableCell className="font-medium">{tx.description}</TableCell>
              <TableCell>{tx.category || "-"}</TableCell>
              <TableCell>
                {tx.type === "INFLOW" ? (
                  <span className="text-green-600 font-semibold">Inflow</span>
                ) : (
                  <span className="text-red-600 font-semibold">Outflow</span>
                )}
              </TableCell>
              <TableCell>{tx.status}</TableCell>
              <TableCell className="text-right">
                {tx.currency}{" "}
                {tx.amount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
