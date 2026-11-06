import React from 'react';
import { redirect } from 'next/navigation';
import { ShoppingCart, CheckCircle, Clock, Truck, Store } from 'lucide-react';
import { query } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

async function getAdminOrders() {
  try {
    return await query(`
      SELECT *
      FROM public.orders
      ORDER BY created_at DESC;
    `);
  } catch (err) {
    console.error('Error fetching admin orders:', err);
    return [];
  }
}

export default async function AdminOrdersPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  const orders = await getAdminOrders();

  return (
    <div className="space-y-6">
      <div className="border-b border-cellar-border pb-4">
        <div className="text-xs font-bold tracking-widest uppercase text-gold-700 mb-1">
          Fulfillment Center
        </div>
        <h1 className="disp text-3xl sm:text-4xl font-bold text-cellar-charcoal">
          Customer Reservation Orders
        </h1>
        <p className="text-xs text-cellar-muted mt-1">
          Incoming reservations for in-store pickup and local delivery with age verification checks.
        </p>
      </div>

      <div className="bg-white border border-cellar-border rounded-sm shadow-xs overflow-hidden">
        <div className="p-4 border-b border-cellar-border flex justify-between items-center text-xs text-cellar-muted">
          <span>Total Orders: <strong>{orders.length}</strong></span>
        </div>

        {orders.length === 0 ? (
          <div className="p-12 text-center text-cellar-muted">
            <ShoppingCart className="w-12 h-12 text-cellar-borderDark mx-auto mb-3 stroke-1" />
            <p className="disp text-2xl text-cellar-charcoal mb-1">No Orders Yet</p>
            <p className="text-xs">Incoming customer reservations will appear here in real time.</p>
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left text-xs min-w-[650px]">
              <thead>
                <tr className="bg-cellar-cream border-b border-cellar-border text-cellar-muted uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4 font-semibold">Order #</th>
                  <th className="py-3 px-4 font-semibold">Customer</th>
                  <th className="py-3 px-4 font-semibold">Fulfillment</th>
                  <th className="py-3 px-4 font-semibold">Items</th>
                  <th className="py-3 px-4 font-semibold">Total</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cellar-border/60">
                {orders.map((o: any) => {
                  let parsedItems: any[] = [];
                  try {
                    parsedItems = typeof o.items === 'string' ? JSON.parse(o.items) : o.items;
                  } catch {}

                  return (
                    <tr key={o.id} className="hover:bg-cellar-cream/40">
                      <td className="py-3 px-4 font-mono font-bold text-wine-800">
                        {o.order_number}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-cellar-charcoal">{o.customer_name}</div>
                        <div className="text-[11px] text-cellar-muted">{o.customer_email} &bull; {o.customer_phone}</div>
                        {o.delivery_address && (
                          <div className="text-[10px] text-cellar-dark mt-0.5 truncate max-w-xs">{o.delivery_address}</div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 font-semibold uppercase text-[10px] bg-wine-50 text-wine-900 border border-wine-200 px-2 py-0.5 rounded-xs">
                          {o.fulfillment_type === 'pickup' ? (
                            <>
                              <Store className="w-3 h-3" />
                              <span>Pickup</span>
                            </>
                          ) : (
                            <>
                              <Truck className="w-3 h-3" />
                              <span>Delivery</span>
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-cellar-charcoal">
                        <div>{parsedItems.length} items</div>
                        <div className="text-[10px] text-cellar-muted truncate max-w-xs">
                          {parsedItems.map((i: any) => `${i.name} (x${i.quantity})`).join(', ')}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-wine-800">
                        ${parseFloat(o.total_amount).toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded-xs text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {o.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-cellar-muted text-[11px]">
                        {new Date(o.created_at).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

