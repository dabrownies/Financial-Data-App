"use client";

import React, { useEffect, useState } from "react";
import fetchFinancialData from "@/api/fetchFinancialData";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell} from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Landmark, Filter, ListOrdered, Info, UsersRound, UserRound, CalendarDays, Building, SearchX} from "lucide-react";
import { motion } from "framer-motion";


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
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [revenueMin, setRevenueMin] = useState("");
  const [revenueMax, setRevenueMax] = useState("");
  const [netIncomeMin, setNetIncomeMin] = useState("");
  const [netIncomeMax, setNetIncomeMax] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sortBy, setSortBy] = useState(""); 
  const [sortOrder, setSortOrder] = useState(""); 
  const [query, setQuery] = useState(false);


  /** Retrieves query responses from user input from server side
   *  @sets setFilteredData to contain the data filtered within the specificed range
   *  @sets query states to handle when queries yield no results
   */
  const applyFilters = async () => {
    const queryParams = new URLSearchParams();

    if (dateStart) queryParams.append("year_start", dateStart);
    if (dateEnd) queryParams.append("year_end", dateEnd);
    if (revenueMin) queryParams.append("min_revenue", revenueMin);
    if (revenueMax) queryParams.append("max_revenue", revenueMax);
    if (netIncomeMin) queryParams.append("min_net_income", netIncomeMin);
    if (netIncomeMax) queryParams.append("max_net_income", netIncomeMax);

    try {
      console.log("Starting API request");
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data?${queryParams.toString()}`);
        console.log("Response status:", response.status);
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        console.log("Received data:", data);

        const results = data.filter((item) => {
            const dateValid =
                (!dateStart || parseInt(item.date, 10) >= parseInt(dateStart || 0, 10)) &&
                (!dateEnd || parseInt(item.date, 10) <= parseInt(dateEnd || Infinity, 10));
            const revenueValid =
                (!revenueMin || parseFloat(item.revenue) >= parseFloat(revenueMin || 0)) &&
                (!revenueMax || parseFloat(item.revenue) <= parseFloat(revenueMax || Infinity));
            const netIncomeValid =
                (!netIncomeMin || parseFloat(item.netIncome) >= parseFloat(netIncomeMin || 0)) &&
                (!netIncomeMax || parseFloat(item.netIncome) <= parseFloat(netIncomeMax || Infinity));

            return dateValid && revenueValid && netIncomeValid;
        });

        setFilteredData(results);
        setQuery(true);
        setIsDialogOpen(false);
    } catch (error) {
        console.error("Error fetching filtered data:", error);
    }
};

  
  /** Retrieves query responses from user input from server side
   *  @sets setFilteredData to contain the data sorted by the user's specifications
   */
  const applySorting = async () => {
    try {
      const queryParams = new URLSearchParams({
        sort_by: sortBy,
        sort_order: sortOrder,
      });
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
  
      const sortedData = await response.json();
      setFilteredData(sortedData); 
    } catch (error) {
      console.error("Error applying sorting:", error);
    }
  };


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

  // loading animation
  if (loading) {
    return <div>Loading data...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f9fafe]">
      <header className="bg-secondary text-primary-foreground py-5 px-6 shadow-md">
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
              <motion.div 
                  whileHover={{ scale: 1.07 }}
                  whileTap={{ scale: 0.9 }}
              >
                <button 
                  className="px-4 py-2 flex items-center gap-2 font-bold rounded-2xl bg-secondary text-white"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </button>
              </motion.div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogContent className="w-full max-w-md bg-background p-6 rounded-md shadow-lg">
                    <DialogHeader>
                      <DialogTitle>Filter By</DialogTitle>
                      <DialogDescription>Adjust the filters to refine your search.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="yearStart">Date Range</Label>
                        <div className="flex items-center gap-4">
                          <Input
                            id="yearStart"
                            type="number"
                            placeholder="Start Year (e.g., 2020)"
                            value={dateStart}
                            onChange={(e) => setDateStart(e.target.value)}
                          />
                          <span>-</span>
                          <Input
                            id="yearEnd"
                            type="number"
                            placeholder="End Year (e.g., 2022)"
                            value={dateEnd}
                            onChange={(e) => setDateEnd(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="revenueMin">Revenue Range</Label>
                        <div className="flex items-center gap-4">
                          <Input
                            id="revenueMin"
                            type="number"
                            placeholder="Min Revenue"
                            value={revenueMin}
                            onChange={(e) => setRevenueMin(e.target.value)}
                          />
                          <span>-</span>
                          <Input
                            id="revenueMax"
                            type="number"
                            placeholder="Max Revenue"
                            value={revenueMax}
                            onChange={(e) => setRevenueMax(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="netIncomeMin">Net Income Range</Label>
                        <div className="flex items-center gap-4">
                          <Input
                            id="netIncomeMin"
                            type="number"
                            placeholder="Min Net Income"
                            value={netIncomeMin}
                            onChange={(e) => setNetIncomeMin(e.target.value)}
                          />
                          <span>-</span>
                          <Input
                            id="netIncomeMax"
                            type="number"
                            placeholder="Max Net Income"
                            value={netIncomeMax}
                            onChange={(e) => setNetIncomeMax(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter className="flex flex-col sm:flex-row justify-center gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setIsDialogOpen(false)}
                        className="rounded-lg w-full sm:w-auto"
                      >
                        Cancel
                      </Button>
                      <motion.div 
                        whileHover={{ scale: 1.07 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-full sm:w-auto"
                      >
                        <Button 
                          onClick={applyFilters}
                          className="w-full sm:w-auto px-4 py-2 flex items-center gap-2 font-bold rounded-lg bg-secondary text-white hover:bg-secondary"
                        >
                          Apply
                        </Button>
                      </motion.div>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              

              {/* SORT BY DROPDOWN */}
              <Popover>
                <PopoverTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.07 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <button className="px-4 py-2 flex items-center gap-2 font-bold rounded-2xl bg-secondary text-white">
                      <ListOrdered className="w-5 h-5 mr-2" />
                      Sort
                    </button>
                  </motion.div>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Sort By</h4>
                      <p className="text-sm text-muted-foreground">
                        Sort values by ascending or descending.
                      </p>
                    </div>
                    <div className="grid gap-2">
                      {/* Select for Date */}
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="dateSelect">Date</Label>
                        <div className="col-span-2">
                          <Select
                            onValueChange={(value) => {
                              setSortBy("date");
                              setSortOrder(value);
                            }}
                          >
                            <SelectTrigger id="dateSelect" className="w-full">
                              <SelectValue placeholder="Asc/Desc" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Sort Order</SelectLabel>
                                <SelectItem value="asc">Ascending</SelectItem>
                                <SelectItem value="desc">Descending</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      {/* Select for Revenue */}
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="revenueSelect">Revenue</Label>
                        <div className="col-span-2">
                          <Select
                            onValueChange={(value) => {
                              setSortBy("revenue");
                              setSortOrder(value);
                            }}
                          >
                            <SelectTrigger id="revenueSelect" className="w-full">
                              <SelectValue placeholder="Asc/Desc" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Sort Order</SelectLabel>
                                <SelectItem value="asc">Ascending</SelectItem>
                                <SelectItem value="desc">Descending</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      {/* Select for Net Income */}
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="netIncomeSelect">Net Income</Label>
                        <div className="col-span-2">
                          <Select
                            onValueChange={(value) => {
                              setSortBy("netIncome");
                              setSortOrder(value);
                            }}
                          >
                            <SelectTrigger id="netIncomeSelect" className="w-full">
                              <SelectValue placeholder="Asc/Desc" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Sort Order</SelectLabel>
                                <SelectItem value="asc">Ascending</SelectItem>
                                <SelectItem value="desc">Descending</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <motion.div
                        whileHover={{ scale: 1.07 }}
                        whileTap={{ scale: 0.9 }}
                        className="inline-block"
                      >
                        <Button
                          onClick={applySorting}
                          className="w-full sm:w-auto px-4 py-2 flex items-center gap-2 font-bold rounded-lg bg-secondary text-white hover:bg-secondary"
                        >
                          Apply
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>


              {/* TOGGLE FORMAT BUTTON */}
              <div className="flex items-center space-x-2">
                <Switch id="toggle-format" onClick={() => setIsFormatted(!isFormatted)} />
                <Label htmlFor="toggle-format">Format</Label>
              </div>
            </div>


          <div className="overflow-x-auto rounded-2xl w-full border border-gray-200 shadow-lg">
            <Table className="text-sm">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xl font-extrabold py-4 pl-4 md:pl-6 lg:pl-8 text-black bg-white" colSpan={6}>
                    <div className="flex items-center gap-2">
                      Apple Inc. (NASDAQ: AAPL)
                      <Dialog>
                        <TooltipProvider>
                          <Tooltip>
                            <DialogTrigger asChild>
                              <TooltipTrigger asChild>
                                <button className="relative">
                                  <Info className="w-5 h-5 ml-4 mt-1 text-gray-600 hover:text-black" />
                                </button>
                              </TooltipTrigger>
                            </DialogTrigger>
                            <TooltipContent>
                              <p>Learn about AAPL</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>Apple Inc.</DialogTitle>
                            <DialogDescription>A brief overview of the tech giant.</DialogDescription>
                          </DialogHeader>
                          <div className="py-4">
                            {/* Info Card */}
                            <div className="grid grid-cols-2 gap-6 text-center">
                              <div className="flex flex-col items-start gap-2">
                                <div className="flex items-center gap-2">
                                  <p className="font-sm text-gray-500">CEO</p>
                                  <UserRound className="w-4 h-4 text-gray-500" />
                                </div>
                                <p>Timothy Donald Cook</p>
                              </div>
                              <div className="flex flex-col items-start gap-2">
                                <div className="flex items-center gap-2">
                                  <p className="font-sm text-gray-500">Founded</p>
                                  <CalendarDays className="w-4 h-4 text-gray-500" />
                                </div>
                                <p>1976</p>
                              </div>
                              <div className="flex flex-col items-start gap-2">
                                <div className="flex items-center gap-2">
                                  <p className="font-sm text-gray-500">Employees</p>
                                  <UsersRound className="w-4 h-4 text-gray-500" />
                                </div>
                                <p>164,000</p>
                              </div>
                              <div className="flex flex-col items-start gap-2">
                                <div className="flex items-center gap-2">
                                  <p className="font-sm text-gray-500">Headquarters</p>
                                  <Building className="w-4 h-4 text-gray-500" />
                                </div>
                                <p>Cupertino, California</p>
                              </div>
                            </div>
                            <ScrollArea className="rounded-xl border border-gray-200 p-4 max-h-40 overflow-y-auto mt-8">
                              <p className="text-muted-foreground">
                                Apple, Inc. engages in the design, manufacture, and sale of smartphones, personal computers, 
                                tablets, wearables and accessories, and other varieties of related services. It operates through the 
                                following geographical segments: Americas, Europe, Greater China, Japan, and Rest of Asia Pacific. 
                                The Americas segment includes North and South America. The Europe segment consists of European 
                                countries, as well as India, the Middle East, and Africa. The Greater China segment comprises China, 
                                Hong Kong, and Taiwan. The Rest of Asia Pacific segment includes Australia and Asian countries. 
                                Its products and services include iPhone, Mac, iPad, AirPods, Apple TV, Apple Watch, Beats products, 
                                AppleCare, iCloud, digital content stores, streaming, and licensing services. The company was founded 
                                by Steven Paul Jobs, Ronald Gerald Wayne, and Stephen G. Wozniak in April 1976 and is headquartered 
                                in Cupertino, CA. The listed name for AAPL is Apple Inc. Common Stock.
                              </p>
                            </ScrollArea>
                          </div>
                        </DialogContent>
                      </Dialog>

                    </div>
                  </TableHead>
                </TableRow>
                <TableRow className="bg-gray-100">
                  <TableHead className="text-center w-1/6 py-4 px-4">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="nav-link">Date</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Date of Income Statement</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableHead>
                  <TableHead className="text-center w-1/6 py-4 px-4">
                    <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="nav-link">Revenue</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Total money earned from sales</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                  </TableHead>
                  <TableHead className="text-center w-1/6 py-4 px-4">
                    <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="nav-link">Net Income</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Profit after all expenses, taxes, and costs</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                  </TableHead>
                  <TableHead className="text-center w-1/6 py-4 px-4">
                    <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="nav-link">Gross Profit</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Revenue minus direct costs (e.g., manufacturing)</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                  </TableHead>
                  <TableHead className="text-center w-1/6 py-4 px-4">
                    <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="nav-link">EPS</span> 
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>(Earnings Per Share): Net income divided by total shares</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                  </TableHead>
                  <TableHead className="text-center w-1/6 py-4 px-4">
                    <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="nav-link">Operating Income</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Profit from core operations before taxes and interest</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white">
                {query && filteredData.length === 0 ? (
                  <TableRow>
                  <TableCell colSpan={6} className="text-center py-24">
                    <div className="flex flex-col items-center space-y-2">
                      <SearchX className="w-10 h-10" />
                      <span className="text-2xl font-bold">Well, this is awkward...</span>
                      <span className="text-sm font-medium text-gray-600">
                        Seems your search yielded no results.
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
                ) : (
                  (filteredData.length > 0 ? filteredData : data).map((item) => (
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
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
      <footer className="bg-muted text-muted-foreground py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <p className="text-sm">&copy; 2025 Financial Hub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default FinancialData;






// /**
//  * v0 by Vercel.
//  * @see https://v0.dev/t/Iqitzanp9mF
//  * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
//  */
// import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"

// export default function Component() {
//   return (
//     <div className="flex min-h-screen flex-col items-center justify-center bg-background">
//       <Dialog>
//         <DialogTrigger asChild>
//           <Button variant="outline" className="mb-4">
//             Learn About Apple
//           </Button>
//         </DialogTrigger>
//         <DialogContent className="sm:max-w-[600px]">
//           <DialogHeader>
//             <DialogTitle>Apple Inc.</DialogTitle>
//             <DialogDescription>A brief overview of the tech giant.</DialogDescription>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             <div className="grid grid-cols-[100px_1fr] items-center gap-4">
//               <p className="font-medium">CEO:</p>
//               <p>Tim Cook</p>
//             </div>
//             <div className="grid grid-cols-[100px_1fr] items-center gap-4">
//               <p className="font-medium">Founded:</p>
//               <p>1976</p>
//             </div>
//             <div className="grid grid-cols-[100px_1fr] items-center gap-4">
//               <p className="font-medium">Employees:</p>
//               <p>154,000+</p>
//             </div>
//             <div className="grid grid-cols-[100px_1fr] items-center gap-4">
//               <p className="font-medium">Headquarters:</p>
//               <p>Cupertino, California</p>
//             </div>
//             <p className="text-muted-foreground">
//               Apple Inc. is an American multinational technology company that specializes in consumer electronics,
//               software, and online services. It is considered one of the Big Tech companies in the U.S. information
//               technology industry, alongside Amazon, Google, Microsoft, and Meta (Facebook).
//             </p>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => {}}>
//               Close
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }