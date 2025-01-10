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
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Landmark, Filter, ListOrdered} from "lucide-react";


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
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-primary-foreground py-5 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="#" className="flex items-center gap-2 font-semibold text-lg" prefetch={false}>
            <Landmark className="h-6 w-6" />
            <span>Financial Hub</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 py-8 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">AAPL Financial Data</h1>
            <div className="flex items-center gap-4">
              <Button onClick={() => setIsFormatted(!isFormatted)}>
                Toggle Format: {isFormatted ? "ON" : "OFF"}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="hidden md:inline-flex">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem>Date</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Revenue</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Net Income</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Gross Profit</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>EPS</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Operating Income</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="hidden md:inline-flex">
                    <ListOrdered className="h-4 w-4 mr-2" />
                    Sort
                  </Button>
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
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center w-1/6">Date</TableHead>
                  <TableHead className="text-center w-1/6">Revenue</TableHead>
                  <TableHead className="text-center w-1/6">Net Income</TableHead>
                  <TableHead className="text-center w-1/6">Gross Profit</TableHead>
                  <TableHead className="text-center w-1/6">EPS</TableHead>
                  <TableHead className="text-center w-1/6">Operating Income</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item) => (
                  <TableRow key={item.date}>
                    <TableCell className="text-center w-1/6">{item.date}</TableCell>
                    <TableCell className="text-center w-1/6">
                      {isFormatted ? formatNumber(item.revenue) : `$${item.revenue.toLocaleString()}`}
                    </TableCell>
                    <TableCell className="text-center w-1/6">
                      {isFormatted ? formatNumber(item.netIncome) : `$${item.netIncome.toLocaleString()}`}
                    </TableCell>
                    <TableCell className="text-center w-1/6">
                      {isFormatted ? formatNumber(item.grossProfit) : `$${item.grossProfit.toLocaleString()}`}
                    </TableCell>
                    <TableCell className="text-center w-1/6">{item.eps.toFixed(2)}</TableCell>
                    <TableCell className="text-center w-1/6">
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


