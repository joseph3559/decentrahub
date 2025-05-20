// /home/scott/Desktop/Office/decentrahub/frontend/app/dashboard/creator/earnings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

import { Download, DollarSign, TrendingUp, Layers, Users, CalendarDays, AlertTriangle } from 'lucide-react';
import { toast } from "sonner";
import { useAuth } from '../../../context/AuthContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { EmptyState } from '../../../components/EmptyState';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import EarningsChart from '../../../components/EarningsChart';

// Define Transaction type
type TransactionType = 'Sale' | 'Royalty' | 'Subscription';
type TransactionStatus = 'Completed' | 'Pending' | 'Failed';

interface Transaction {
  id: string;
  date: string; // Or Date object
  type: TransactionType;
  amount: number;
  currency: string; // e.g., GHO, ETH
  nftTitle?: string; // Optional, may not apply to subscriptions
  buyer?: string; // Wallet address or user handle
  status: TransactionStatus;
}

// Mock Data - Replace with actual API calls
const mockTransactions: Transaction[] = [
  { id: 'txn1', date: '2024-05-10', type: 'Sale', amount: 1.5, currency: 'ETH', nftTitle: 'Genesis Bloom', buyer: '@user123', status: 'Completed' },
  { id: 'txn2', date: '2024-05-08', type: 'Royalty', amount: 0.05, currency: 'ETH', nftTitle: 'Pixel Warriors #001', buyer: '@collectorX', status: 'Completed' },
  { id: 'txn3', date: '2024-05-05', type: 'Subscription', amount: 5, currency: 'GHO', buyer: '@fanXYZ', status: 'Completed' },
  { id: 'txn4', date: '2024-05-02', type: 'Sale', amount: 0.75, currency: 'ETH', nftTitle: 'Decentralized Rhapsody', buyer: '@musicLover', status: 'Pending' },
  { id: 'txn5', date: '2024-04-28', type: 'Sale', amount: 2.0, currency: 'ETH', nftTitle: 'VR Sculpting Showcase', buyer: '@vrWorld', status: 'Failed' },
];

interface EarningsStats {
  totalEarnings: number;
  totalSales: number;
  totalRoyalties: number;
  totalSubscriptions: number;
  currency: string; // Primary currency for display
}

const mockEarningsStats: EarningsStats = {
  totalEarnings: 1575.50,
  totalSales: 1200.00,
  totalRoyalties: 75.50,
  totalSubscriptions: 300.00,
  currency: 'GHO', // Assuming GHO or a stablecoin equivalent
};

// Placeholder for chart data - structure depends on chart library
interface ChartDataPoint {
  name: string; // e.g., 'Jan', 'Feb', 'Week 1'
  earnings: number;
}
const mockChartData: ChartDataPoint[] = [
  { name: 'Jan', earnings: 200 }, { name: 'Feb', earnings: 350 }, { name: 'Mar', earnings: 280 },
  { name: 'Apr', earnings: 450 }, { name: 'May', earnings: 300 },
];

const dateRangeOptions = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: 'all', label: 'All Time' },
];

export default function EarningsPage() {
  const { address, userRole } = useAuth();
  const [earningsStats, setEarningsStats] = useState<EarningsStats>(mockEarningsStats);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>(mockChartData);
  const [selectedDateRange, setSelectedDateRange] = useState('30d');
  const [isLoading, setIsLoading] = useState(true);

  // TODO: Implement actual data fetching based on `address` and `selectedDateRange`
  useEffect(() => {
    setIsLoading(true);
    if (address) {
      console.log(`Fetching earnings for address: ${address}, range: ${selectedDateRange}`);
      // Simulate API call
      setTimeout(() => {
        // Filter mock transactions based on date range (very simplified)
        const filteredTxns = mockTransactions.filter(t => {
            const date = new Date(t.date);
            const now = new Date();
            if (selectedDateRange === '7d') return (now.getTime() - date.getTime()) / (1000 * 3600 * 24) <= 7;
            if (selectedDateRange === '30d') return (now.getTime() - date.getTime()) / (1000 * 3600 * 24) <= 30;
            // Add more sophisticated date filtering for '90d' and 'all'
            return true;
        });
        setTransactions(filteredTxns);
        // Update stats and chart data based on fetched data
        setEarningsStats(mockEarningsStats); // Keep mock stats for now
        setChartData(mockChartData); // Keep mock chart data
        setIsLoading(false);
      }, 1000);
    } else {
      setIsLoading(false);
      setTransactions([]);
    }
  }, [address, selectedDateRange]);

  const handleExport = (format: 'csv' | 'pdf') => {
    toast.info(`Exporting earnings as ${format.toUpperCase()}. (Feature not implemented)`);
    // TODO: Implement actual export functionality
  };

  const getStatusBadgeColor = (status: TransactionStatus) => {
    switch (status) {
      case 'Completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Failed': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  // Basic role check
  if (!isLoading && userRole && userRole !== 'creator') {
    return (
        <div className="min-h-screen bg-[#16213e] p-4 md:p-8 font-inter text-white flex flex-col items-center justify-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
            <p className="text-[#a1a1aa] mt-2">This dashboard is for creators only.</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#16213e] p-4 md:p-8 font-inter text-white">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-center mb-6 md:mb-8 gap-4"
      >
        <div>
            <h1 className="text-3xl md:text-4xl font-montserrat font-bold text-white">Earnings Dashboard</h1>
            <p className="text-md text-[#a1a1aa] font-opensans mt-1">Track your revenue from sales, royalties, and subscriptions.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
            <SelectTrigger className="w-full sm:w-[180px] bg-[#1a1a2e] border-[#0f3460] text-[#a1a1aa] focus:ring-[#e94560]">
              <CalendarDays className="h-4 w-4 mr-2 opacity-70" />
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a2e] border-[#0f3460] text-[#a1a1aa]">
              {dateRangeOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value} className="hover:bg-[#0f3460] focus:bg-[#0f3460]">{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => handleExport('csv')} className="border-[#0f3460] text-[#a1a1aa] hover:bg-[#0f3460] hover:text-white">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </motion.div>

      {/* Earnings Overview Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8"
      >
        <Card className="bg-[#1a1a2e] border-[#0f3460] text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#a1a1aa]">Total Earnings</CardTitle>
            <DollarSign className="h-5 w-5 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{earningsStats.totalEarnings.toFixed(2)} {earningsStats.currency}</div>
            {/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
          </CardContent>
        </Card>
        <Card className="bg-[#1a1a2e] border-[#0f3460] text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#a1a1aa]">Total Sales</CardTitle>
            <TrendingUp className="h-5 w-5 text-sky-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{earningsStats.totalSales.toFixed(2)} {earningsStats.currency}</div>
          </CardContent>
        </Card>
        <Card className="bg-[#1a1a2e] border-[#0f3460] text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#a1a1aa]">Total Royalties</CardTitle>
            <Layers className="h-5 w-5 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{earningsStats.totalRoyalties.toFixed(2)} {earningsStats.currency}</div>
          </CardContent>
        </Card>
        <Card className="bg-[#1a1a2e] border-[#0f3460] text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#a1a1aa]">Total Subscriptions</CardTitle>
            <Users className="h-5 w-5 text-pink-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{earningsStats.totalSubscriptions.toFixed(2)} {earningsStats.currency}</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Interactive Chart Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mb-8"
      >
      <EarningsChart chartData={chartData} />



      </motion.div>

      {/* Transaction History Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h2 className="text-2xl font-montserrat font-semibold text-white mb-4">Transaction History</h2>
        {isLoading ? (
          <div className="text-center py-10 text-[#a1a1aa]">Loading transactions...</div>
        ) : transactions.length > 0 ? (
          <Card className="bg-[#1a1a2e] border-[#0f3460]">
            <Table>
              <TableHeader>
                <TableRow className="border-b-[#0f3460] hover:bg-[#101829]">
                  <TableHead className="text-[#a1a1aa]">Date</TableHead>
                  <TableHead className="text-[#a1a1aa]">Type</TableHead>
                  <TableHead className="text-[#a1a1aa]">NFT/Details</TableHead>
                  <TableHead className="text-[#a1a1aa]">Buyer/Source</TableHead>
                  <TableHead className="text-right text-[#a1a1aa]">Amount</TableHead>
                  <TableHead className="text-center text-[#a1a1aa]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id} className="border-b-[#0f3460]/50 hover:bg-[#101829]/70">
                    <TableCell className="font-medium text-white">{new Date(tx.date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-slate-300">{tx.type}</TableCell>
                    <TableCell className="text-slate-300">{tx.nftTitle || 'N/A'}</TableCell>
                    <TableCell className="text-slate-300">{tx.buyer || 'N/A'}</TableCell>
                    <TableCell className="text-right font-semibold text-green-400">
                      {tx.amount.toFixed(2)} {tx.currency}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadgeColor(tx.status)}`}>
                        {tx.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        ) : (
          <EmptyState
            IconComponent={DollarSign}
            title="No Earnings Yet"
            message="Your transaction history will appear here once you start generating revenue from your creations."
            actionButton={
              <Link href="/dashboard/creator/mint-content">
                <Button className="bg-[#e94560] hover:bg-[#d6304a] text-white">
                  Mint Your First NFT
                </Button>
              </Link>
            }
          />
        )}
      </motion.div>
    </div>
  );
}
