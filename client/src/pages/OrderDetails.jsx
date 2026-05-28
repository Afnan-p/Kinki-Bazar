import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiDownload, FiBox, FiTruck, FiCheckCircle, FiClock, FiMapPin, FiCreditCard } from 'react-icons/fi';
import { motion } from 'framer-motion';
import api from '../utils/api';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useSelector } from 'react-redux';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
        setLoading(false);
      } catch (error) {
        toast.error('Order not found');
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const generatePDF = () => {
    if (!order) return;
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('KINKI BAZAR', 14, 20);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Premium E-Commerce Platform', 14, 26);
    
    // Invoice Title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', 14, 40);
    
    // Order Details
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Order ID: #${order._id.slice(-6).toUpperCase()}`, 14, 50);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 14, 56);
    doc.text(`Status: ${order.orderStatus}`, 14, 62);
    
    // Shipping Address
    doc.setFont('helvetica', 'bold');
    doc.text('Billed To:', 120, 50);
    doc.setFont('helvetica', 'normal');
    doc.text(`${order.shippingAddress?.fullName || 'N/A'}`, 120, 56);
    doc.text(`${order.shippingAddress?.street || ''}`, 120, 62);
    doc.text(`${order.shippingAddress?.city || ''}, ${order.shippingAddress?.postalCode || ''}`, 120, 68);
    
    // Table
    const tableColumn = ["Item", "Qty", "Price", "Total"];
    const tableRows = [];

    order.orderItems.forEach(item => {
      const rowData = [
        item.name,
        item.qty.toString(),
        `$${item.price.toFixed(2)}`,
        `$${(item.qty * item.price).toFixed(2)}`
      ];
      tableRows.push(rowData);
    });

    doc.autoTable({
      startY: 80,
      head: [tableColumn],
      body: tableRows,
      theme: 'striped',
      headStyles: { fillColor: [11, 16, 32] },
    });

    const finalY = doc.lastAutoTable.finalY || 80;
    
    doc.setFont('helvetica', 'bold');
    doc.text(`Tax: $${(order.taxPrice || 0).toFixed(2)}`, 140, finalY + 10);
    doc.text(`Shipping: $${(order.shippingPrice || 0).toFixed(2)}`, 140, finalY + 16);
    doc.setFontSize(12);
    doc.text(`Total: $${(order.totalPrice || 0).toFixed(2)}`, 140, finalY + 24);

    doc.save(`Invoice_${order._id.slice(-6).toUpperCase()}.pdf`);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" /></div>;
  if (!order) return <div className="min-h-screen flex items-center justify-center font-bold text-xl">Order Not Found</div>;

  const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];
  const currentStatusIndex = statuses.indexOf(order.orderStatus || 'Pending');

  return (
    <div className="bg-[#F6F6F7] min-h-screen pt-32 pb-20 font-['Outfit']">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-[#0B1020] tracking-tighter mb-2">Order <span className="text-primary">#{order._id.slice(-6).toUpperCase()}</span></h1>
            <p className="text-gray-500 font-medium">Placed on {new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <button 
            onClick={generatePDF}
            className="btn-primary h-12 px-6 flex items-center space-x-2 text-xs hover:scale-105 transition-transform"
          >
            <FiDownload className="text-lg" />
            <span>Download Invoice</span>
          </button>
        </div>

        {/* Tracking Timeline */}
        <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-sm border border-gray-100 mb-8 overflow-x-auto">
          <h3 className="text-xl font-black mb-10 text-[#0B1020]">Order Status</h3>
          <div className="relative min-w-[500px]">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -translate-y-1/2 rounded-full" />
            <div className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 rounded-full transition-all duration-1000" style={{ width: `${Math.max(0, (currentStatusIndex / (statuses.length - 1)) * 100)}%` }} />
            
            <div className="relative flex justify-between z-10">
              {statuses.map((status, index) => {
                const isCompleted = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;
                
                let Icon = FiClock;
                if (status === 'Processing') Icon = FiBox;
                if (status === 'Shipped') Icon = FiTruck;
                if (status === 'Delivered') Icon = FiCheckCircle;

                return (
                  <div key={status} className="flex flex-col items-center">
                    <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-500 shadow-sm ${
                      isCompleted ? 'bg-primary text-white scale-110 shadow-primary/30' : 'bg-white text-gray-300 border-4 border-gray-50'
                    }`}>
                      <Icon className="text-xl md:text-2xl" />
                    </div>
                    <span className={`text-[10px] md:text-xs font-black uppercase tracking-widest mt-4 ${
                      isCurrent ? 'text-primary' : isCompleted ? 'text-[#0B1020]' : 'text-gray-400'
                    }`}>{status}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
              <h3 className="text-xl font-black mb-6 text-[#0B1020]">Items Ordered</h3>
              <div className="space-y-6">
                {order.orderItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-6 p-4 rounded-3xl hover:bg-gray-50 transition-colors">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <Link to={`/product/${item.product}`} className="font-bold text-lg hover:text-primary transition-colors truncate block">{item.name}</Link>
                      <p className="text-gray-400 text-sm mt-1">Qty: {item.qty}</p>
                    </div>
                    <div className="font-black text-xl text-[#0B1020]">${((item.price || 0) * (item.qty || 1)).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
              <h3 className="text-xl font-black mb-6 text-[#0B1020]">Order Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Items</span>
                  <span className="text-[#0B1020]">${(order.itemsPrice || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Shipping</span>
                  <span className="text-[#0B1020]">${(order.shippingPrice || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Tax</span>
                  <span className="text-[#0B1020]">${(order.taxPrice || 0).toFixed(2)}</span>
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="font-bold text-[#0B1020]">Total</span>
                  <span className="text-3xl font-black text-primary">${(order.totalPrice || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {order.shippingAddress && (
              <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                <h3 className="text-lg font-black mb-4 flex items-center gap-2 text-[#0B1020]"><FiMapPin className="text-primary"/> Shipping</h3>
                <p className="font-bold mb-1 text-[#0B1020]">{order.shippingAddress.fullName}</p>
                <p className="text-sm text-gray-500">{order.shippingAddress.street}, {order.shippingAddress.city}</p>
                <p className="text-sm text-gray-500">{order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
                <p className="text-sm text-gray-500 mt-2 font-medium">Ph: {order.shippingAddress.phone}</p>
              </div>
            )}
            
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
              <h3 className="text-lg font-black mb-4 flex items-center gap-2 text-[#0B1020]"><FiCreditCard className="text-primary"/> Payment</h3>
              <p className="font-bold text-sm mb-2 text-gray-500">Method: <span className="text-[#0B1020]">{order.paymentMethod}</span></p>
              {order.isPaid ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-xl text-xs font-black uppercase tracking-widest">
                  <FiCheckCircle /> Paid on {new Date(order.paidAt).toLocaleDateString()}
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-black uppercase tracking-widest">
                  <FiClock /> Pending
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
