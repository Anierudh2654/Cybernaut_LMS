import React, { useEffect, useState } from "react";
import axios from "axios";
import paidIcon from "../assets/paid.svg";
import pendingIcon from "../assets/pending.svg";

const Payment = () => {
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/salary");
        setAdmins(res.data);
      } catch (err) {
        console.error("Failed to fetch admins:", err);
      }
    };

    fetchAdmins();
  }, []);

  const handleApprovePayment = async (admin) => {
  try {
    const res = await axios.post(`http://localhost:5000/api/salary/${admin._id}/pay`);
    const { orderId, amount, adminName } = res.data;

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, // set this in .env
      amount,
      currency: "INR",
      name: "LMS Salary Payment",
      description: `Salary for ${adminName}`,
      order_id: orderId,
      handler: async function (response) {
        // verify on backend
        await axios.post(`http://localhost:5000/api/salary/${admin._id}/verify`, {
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          signature: response.razorpay_signature,
        });

        const res = await axios.post(`http://localhost:5000/api/salary/${admin._id}/invoice`, {
      adminName: admin.user?.name,
      email: admin.user?.email,
      amount: admin.salary * 100, // in paise
    });

        // Refresh UI
        alert("Payment successful");
        window.location.reload();
      },
      prefill: {
        name: adminName,
        email: "", // optional
      },
      theme: {
        color: "#1F2937", // Tailwind black
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
    console.error("Payment error:", err);
    alert("Payment initiation failed");
  }
};


  const currentMonth = new Date().getMonth();

  return (
    <div className="...">
      {/* your top section */}
      
      {/* Recent Payments */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-2">Recent Payments</h2>

        <table className="w-full text-left text-sm border-separate border-spacing-y-3">
          <thead>
            <tr className="text-gray-500">
              <th>Lecturer</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Month</th>
              <th>Order ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {admins.map((admin, idx) => {
              const isPaid = admin.paidForMonth === currentMonth;
              const status = isPaid ? "Paid" : "Pending";
              return (
                <tr key={idx} className="bg-white shadow-sm rounded-md">
                  <td className="py-3 px-2">{admin.user?.name || "Unnamed"}</td>
                  <td className="py-3 px-2 text-green-600 font-semibold">₹{admin.salary}</td>
                  <td className="py-3 px-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${
                        isPaid
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      <img
                        src={isPaid ? paidIcon : pendingIcon}
                        alt={status}
                        className="w-4 h-4"
                      />
                      {status}
                    </span>
                  </td>
                  <td className="py-3 px-2">{new Date().toLocaleString('default', { month: 'long' })}</td>
                  <td className="py-3 px-2">{admin.lastOrderId || "—"}</td>
                  <td className="py-3 px-2">
                      {!isPaid && (
                        <button className="bg-black text-white px-2 py-1 text-xs rounded"
                          onClick={() => handleApprovePayment(admin)}>Approve
                        </button>
                      )}
                      {admin.invoiceId && ( <a href={`http://localhost:5000/api/salary/invoice/${admin.invoiceId}`}
                        target="_blank" className="ml-2 text-blue-600 underline text-xs"> View Invoice
                        </a>
                      )}
                 </td>


                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Bottom section as-is */}
    </div>
  );
};

export default Payment;
