import { Eye, MoreHorizontal, Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function OrdersTable() {
  const orders = [
    {
      id: "#ORD-7231",
      customer: "John Doe",
      product: "Leather Jacket",
      amount: "$299.00",
      status: "Delivered",
      date: "2 mins ago",
    },
    {
      id: "#ORD-7232",
      customer: "Sarah Smith",
      product: "Silk Scarf",
      amount: "$89.50",
      status: "Pending",
      date: "15 mins ago",
    },
    {
      id: "#ORD-7233",
      customer: "Mike Johnson",
      product: "Woolen Coat",
      amount: "$450.00",
      status: "Delivered",
      date: "1 hour ago",
    },
    {
      id: "#ORD-7234",
      customer: "Emma Wilson",
      product: "Cotton Tee",
      amount: "$45.00",
      status: "Cancelled",
      date: "3 hours ago",
    },
    {
      id: "#ORD-7235",
      customer: "David Brown",
      product: "Denim Jeans",
      amount: "$120.00",
      status: "Pending",
      date: "5 hours ago",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Delivered":
        return (
          <Badge className="bg-gray-100 text-black border-none hover:bg-gray-200 uppercase font-black text-[9px] tracking-widest px-3 py-1 rounded-full">
            Delivered
          </Badge>
        );
      case "Pending":
        return (
          <Badge className="bg-black text-white border-none hover:bg-black/80 uppercase font-black text-[9px] tracking-widest px-3 py-1 rounded-full text-white/90">
            Pending
          </Badge>
        );
      case "Cancelled":
        return (
          <Badge className="bg-red-50 text-red-600 border-none hover:bg-red-100 uppercase font-black text-[9px] tracking-widest px-3 py-1 rounded-full">
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-black border-none uppercase font-black text-[9px] tracking-widest px-3 py-1 rounded-full">
            {status}
          </Badge>
        );
    }
  };

  return (
    <Card className="border-gray-100 shadow-sm rounded-3xl overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between px-8 py-8 border-b border-gray-50">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold tracking-tight uppercase italic">
            Recent Orders
          </CardTitle>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-none">
            Real-time order tracking
          </p>
        </div>
        <Button
          variant="outline"
          className="h-10 rounded-xl border-gray-200 hover:bg-gray-50 text-xs font-bold uppercase tracking-widest gap-2"
        >
          <Download size={14} /> Export
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="px-8 h-12 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                  Order ID
                </TableHead>
                <TableHead className="h-12 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                  Customer
                </TableHead>
                <TableHead className="h-12 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                  Product
                </TableHead>
                <TableHead className="h-12 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">
                  Amount
                </TableHead>
                <TableHead className="h-12 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-center">
                  Status
                </TableHead>
                <TableHead className="px-8 h-12 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow
                  key={order.id}
                  className="hover:bg-gray-50/50 transition-colors border-gray-50"
                >
                  <TableCell className="px-8 py-5 text-xs font-bold font-mono">
                    {order.id}
                  </TableCell>
                  <TableCell className="py-5 text-sm font-medium">
                    {order.customer}
                  </TableCell>
                  <TableCell className="py-5 text-xs text-gray-500 font-bold uppercase tracking-wider">
                    {order.product}
                  </TableCell>
                  <TableCell className="py-5 text-sm font-black text-right">
                    {order.amount}
                  </TableCell>
                  <TableCell className="py-5 text-center">
                    {getStatusBadge(order.status)}
                  </TableCell>
                  <TableCell className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg hover:bg-gray-100"
                      >
                        <Eye size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg hover:bg-gray-100"
                      >
                        <MoreHorizontal size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="p-6 border-t border-gray-50 flex justify-center">
          <Button
            variant="ghost"
            className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 hover:text-black"
          >
            View All Activity
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
