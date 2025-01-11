"use client";

import React, { useEffect, useState } from "react";
import fetchFinancialData from "@/api/fetchFinancialData";

import Link from "next/link"
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuCheckboxItem, 
  DropdownMenuRadioGroup, 
  DropdownMenuRadioItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell} from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter } from "@/components/ui/dialog"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input"
import { Landmark, Filter, ListOrdered, ChevronDown} from "lucide-react";


/** Formats large numbers for cleaner table display
 *  @params (num) - the number to be formatted in Trillions, Billions, Millions 
 *  @returns - the number rounded 2 decimal places with the respective symbol (T,B,M) 
 */
const formatNumber = (num) => {
  if (num >= 1_000_000_000_000) {
    return `${(num / 1_000_000_000_000).toFixed(2)}T`;
  } else if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(2)}B`;
  } else if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(2)}M`;
  } else {
    return `${num.toLocaleString()}`;
  }
};

/** Fetches data from API endpoint from fetchFinancialData() to display to the screen
 * @params - None
 * @returns - A data map displayed as a table capable of filtering and sorting rows as specified
 */
const FinancialData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormatted, setIsFormatted] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const financialData = await fetchFinancialData();
        setData(financialData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  if (loading) {
    return <div>Loading data...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f9fafe]">
      <header className="bg-accent text-primary-foreground py-5 px-6 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="#" className="flex items-center gap-2 font-semibold text-lg" prefetch={false}>
            <Landmark className="h-6 w-6" />
            <span>Financial Hub</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 py-8 px-4 md:px-6">
        <div className="container mx-auto">
            <div className="flex flex-wrap items-center gap-4 py-4 pl-4">

              {/* FILTER BY DROPDOWN */}
              <button 
                className="px-4 py-2 flex items-center gap-2 font-bold rounded-2xl bg-accent text-white"
                onClick={() => setIsDialogOpen(true)}
              >
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </button>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogContent className="w-full max-w-md bg-background p-6 rounded-md shadow-lg">
                    <DialogHeader>
                      <DialogTitle>Filter By</DialogTitle>
                      <DialogDescription>Adjust the filters to refine your search.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="dateRange">Date Range</Label>
                        <div className="flex items-center gap-4">
                          <Input
                            id="dateRange"
                            type="number"
                          />
                          <span>-</span>
                          <Input
                            type="number"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="revenueRange">Revenue Range</Label>
                        <div className="flex items-center gap-4">
                          <Input
                            id="revenueRange"
                            type="number"
                          />
                          <span>-</span>
                          <Input
                            type="number"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="netIncomeRange">Net Income Range</Label>
                        <div className="flex items-center gap-4">
                          <Input
                            id="netIncomeRange"
                            type="number"
                          />
                          <span>-</span>
                          <Input
                            type="number"
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setIsDialogOpen(false)}>Apply</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              

              {/* SORT BY DROPDOWN */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="border border-gray-300 bg-gray-100 px-6 py-3 rounded-lg flex items-center gap-2 text-gray-700 font-medium hover:bg-gray-200 focus:ring-2 focus:ring-gray-300">
                    <ListOrdered className="h-4 w-4" />
                    <span>Sort</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value="date">
                    <DropdownMenuRadioItem value="date">Date</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="revenue">Revenue</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="netIncome">Net Income</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="grossProfit">Gross Profit</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="eps">EPS</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="operatingIncome">Operating Income</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* TOGGLE FORMAT BUTTON */}
              <div className="flex items-center space-x-2">
                <Switch id="toggle-format" onClick={() => setIsFormatted(!isFormatted)} />
                <Label htmlFor="toggle-format">Toggle Format</Label>
              </div>
            </div>


          <div className="overflow-x-auto rounded-2xl w-full border border-gray-200 shadow-lg">
            <Table className="text-sm">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xl font-extrabold py-4 pl-4 md:pl-6 lg:pl-8 text-black bg-white" colSpan={6}>
                    Apple Inc. (NASDAQ: AAPL)
                  </TableHead>
                </TableRow>
                <TableRow className="bg-gray-100">
                  <TableHead className="text-center w-1/6 py-4 px-4">Date</TableHead>
                  <TableHead className="text-center w-1/6 py-4 px-4">Revenue</TableHead>
                  <TableHead className="text-center w-1/6 py-4 px-4">Net Income</TableHead>
                  <TableHead className="text-center w-1/6 py-4 px-4">Gross Profit</TableHead>
                  <TableHead className="text-center w-1/6 py-4 px-4">EPS</TableHead>
                  <TableHead className="text-center w-1/6 py-4 px-4">Operating Income</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white">
                {data.map((item) => (
                  <TableRow key={item.date}>
                    <TableCell className="text-center w-1/6 py-4">{item.date}</TableCell>
                    <TableCell className="text-center w-1/6 py-4">
                      {isFormatted ? formatNumber(item.revenue) : `$${item.revenue.toLocaleString()}`}
                    </TableCell>
                    <TableCell className="text-center w-1/6 py-4">
                      {isFormatted ? formatNumber(item.netIncome) : `$${item.netIncome.toLocaleString()}`}
                    </TableCell>
                    <TableCell className="text-center w-1/6 py-4">
                      {isFormatted ? formatNumber(item.grossProfit) : `$${item.grossProfit.toLocaleString()}`}
                    </TableCell>
                    <TableCell className="text-center w-1/6 py-4">{item.eps.toFixed(2)}</TableCell>
                    <TableCell className="text-center w-1/6 py-4">
                      {isFormatted ? formatNumber(item.operatingIncome) : `$${item.operatingIncome.toLocaleString()}`}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
      <footer className="bg-muted text-muted-foreground py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <p className="text-sm">&copy; 2023 AAPL Financials. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:underline" prefetch={false}>
              Privacy Policy
            </Link>
            <Link href="#" className="hover:underline" prefetch={false}>
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FinancialData;






// /**
//  * v0 by Vercel.
//  * @see https://v0.dev/t/RNiYxwh2swb
//  * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
//  */
// "use client"

// import { useState, useMemo } from "react"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu"
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter } from "@/components/ui/dialog"
// import { Label } from "@/components/ui/label"
// import { Input } from "@/components/ui/input"

// export default function Component() {
//   const [filterOpen, setFilterOpen] = useState(false)
//   const [sortOpen, setSortOpen] = useState(false)
//   const [dateRange, setDateRange] = useState({ min: 2020, max: 2024 })
//   const [revenueRange, setRevenueRange] = useState({ min: 0, max: 1000000 })
//   const [netIncomeRange, setNetIncomeRange] = useState({ min: 0, max: 100000 })
//   const [sortBy, setSortBy] = useState("date")
//   const [sortOrder, setSortOrder] = useState("asc")
//   const data = [
//     { id: 1, date: "2021-03-15", revenue: 500000, netIncome: 50000 },
//     { id: 2, date: "2022-07-01", revenue: 750000, netIncome: 75000 },
//     { id: 3, date: "2023-11-30", revenue: 600000, netIncome: 60000 },
//     { id: 4, date: "2024-05-20", revenue: 800000, netIncome: 80000 },
//     { id: 5, date: "2020-09-01", revenue: 400000, netIncome: 40000 },
//   ]
//   const filteredData = useMemo(() => {
//     return data.filter((item) => {
//       const year = new Date(item.date).getFullYear()
//       return (
//         year >= dateRange.min &&
//         year <= dateRange.max &&
//         item.revenue >= revenueRange.min &&
//         item.revenue <= revenueRange.max &&
//         item.netIncome >= netIncomeRange.min &&
//         item.netIncome <= netIncomeRange.max
//       )
//     })
//   }, [dateRange, revenueRange, netIncomeRange])
//   const sortedData = useMemo(() => {
//     return filteredData.sort((a, b) => {
//       if (sortBy === "date") {
//         return sortOrder === "asc"
//           ? new Date(a.date).getTime() - new Date(b.date).getTime()
//           : new Date(b.date).getTime() - new Date(a.date).getTime()
//       } else if (sortBy === "revenue") {
//         return sortOrder === "asc" ? a.revenue - b.revenue : b.revenue - a.revenue
//       } else {
//         return sortOrder === "asc" ? a.netIncome - b.netIncome : b.netIncome - a.netIncome
//       }
//     })
//   }, [filteredData, sortBy, sortOrder])
//   return (
//     <div className="flex flex-col h-screen">
//       <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           <Link href="#" className="text-xl font-bold" prefetch={false}>
//             My App
//           </Link>
//           <Button variant="outline" onClick={() => setFilterOpen(true)} className="px-4 py-2">
//             <FilterIcon className="w-5 h-5 mr-2" />
//             Filter
//           </Button>
//         </div>
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="outline" className="px-4 py-2">
//               <ListOrderedIcon className="w-5 h-5 mr-2" />
//               Sort
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent className="w-56">
//             <DropdownMenuLabel>Sort By</DropdownMenuLabel>
//             <DropdownMenuSeparator />
//             <DropdownMenuRadioGroup value={sortBy} onValueChange={(value) => setSortBy(value)}>
//               <DropdownMenuRadioItem value="date">Date</DropdownMenuRadioItem>
//               <DropdownMenuRadioItem value="revenue">Revenue</DropdownMenuRadioItem>
//               <DropdownMenuRadioItem value="netIncome">Net Income</DropdownMenuRadioItem>
//             </DropdownMenuRadioGroup>
//             <DropdownMenuSeparator />
//             <DropdownMenuRadioGroup value={sortOrder} onValueChange={(value) => setSortOrder(value)}>
//               <DropdownMenuRadioItem value="asc">Ascending</DropdownMenuRadioItem>
//               <DropdownMenuRadioItem value="desc">Descending</DropdownMenuRadioItem>
//             </DropdownMenuRadioGroup>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </header>
//       <main className="flex-1 overflow-y-auto">
//         <div className="container mx-auto py-8 px-6">
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//             {sortedData.map((item) => (
//               <Card key={item.id}>
//                 <CardHeader>
//                   <CardTitle>{item.date}</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-2">
//                     <div>
//                       <span className="font-medium">Revenue:</span>{" "}
//                       {item.revenue.toLocaleString("en-US", {
//                         style: "currency",
//                         currency: "USD",
//                       })}
//                     </div>
//                     <div>
//                       <span className="font-medium">Net Income:</span>{" "}
//                       {item.netIncome.toLocaleString("en-US", {
//                         style: "currency",
//                         currency: "USD",
//                       })}
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </main>
//       <Dialog>
//         <DialogContent className="w-full max-w-md bg-background p-6 rounded-md shadow-lg">
//           <DialogHeader>
//             <DialogTitle>Filter</DialogTitle>
//             <DialogDescription>Adjust the filters to refine your search.</DialogDescription>
//           </DialogHeader>
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="dateRange">Date Range</Label>
//               <div className="flex items-center gap-4">
//                 <Input
//                   id="dateRange"
//                   type="number"
//                 />
//                 <span>-</span>
//                 <Input
//                   type="number"
//                 />
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="revenueRange">Revenue Range</Label>
//               <div className="flex items-center gap-4">
//                 <Input
//                   id="revenueRange"
//                   type="number"
//                 />
//                 <span>-</span>
//                 <Input
//                   type="number"
//                 />
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="netIncomeRange">Net Income Range</Label>
//               <div className="flex items-center gap-4">
//                 <Input
//                   id="netIncomeRange"
//                   type="number"
//                 />
//                 <span>-</span>
//                 <Input
//                   type="number"
//                 />
//               </div>
//             </div>
//           </div>
//           <DialogFooter>
//             <Button variant="outline">
//               Cancel
//             </Button>
//             <Button>Apply</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }
