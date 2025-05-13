import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { BarChartHorizontalBig } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface ChartDataPoint {
  name: string;
  earnings: number;
}

interface EarningsChartProps {
  chartData: ChartDataPoint[];
}

export default function EarningsChart({ chartData }: EarningsChartProps) {
  const [data, setData] = useState<ChartDataPoint[]>([]);

  useEffect(() => {
    setData(chartData);
  }, [chartData]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="mb-8"
    >
      <Card className="bg-[#1a1a2e] border-[#0f3460] text-white">
        <CardHeader>
          <CardTitle className="font-montserrat text-xl">Earnings Over Time</CardTitle>
          <CardDescription className="text-[#a1a1aa]">
            Visual representation of your earnings for the selected period.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] md:h-[400px] flex items-center justify-center">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0f3460" />
                <XAxis dataKey="name" stroke="#a1a1aa" />
                <YAxis stroke="#a1a1aa" />
                <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', borderColor: '#0f3460' }} />
                <Bar dataKey="earnings" fill="#e94560" barSize={20} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-[#a1a1aa]">
              <BarChartHorizontalBig className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No data available for the selected range.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
