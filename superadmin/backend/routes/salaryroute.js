const express = require('express');
const Razorpay = require('razorpay');
const Admin = require('../models/Admin');
require('dotenv').config();
const axios = require('axios');
const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.get('/', async (req, res) => {
  try {
    const admins = await Admin.find().populate('user', 'name'); // Get admin.user.name
    res.json(admins);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch admins' });
  }
});

// POST /api/salary/admins/:id/pay - create Razorpay order and mark as paid
router.post('/:id/pay', async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ error: 'Admin not found' });

    const currentMonth = new Date().getMonth();
    if (admin.paidForMonth === currentMonth) {
      return res.status(400).json({ error: 'Already paid for this month' });
    }

    const amountRs = admin.salary;
    const shortReceipt = `sal_${admin._id.toString().slice(-6)}_${Date.now().toString().slice(-6)}`;

    const order = await razorpay.orders.create({
      amount: amountRs * 100,
      currency: 'INR',
      receipt: shortReceipt,
    });

    // Save temporary orderId to admin for reference
    admin.lastOrderId = order.id;
    await admin.save();

    res.json({ orderId: order.id, amount: order.amount, adminName: admin.name });
  } catch (err) {
    console.error("ERROR in /:id/pay route:", err);
    res.status(500).json({ error: 'Payment initiation failed' });
  }
});

// OPTIONAL: POST /api/salary/admins/:id/verify - verify payment after frontend checkout
router.post('/:id/verify', async (req, res) => {
  const { paymentId, orderId, signature } = req.body;

  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin || admin.lastOrderId !== orderId) {
      return res.status(400).json({ error: 'Invalid order reference' });
    }

    // OPTIONAL: you can use crypto to verify signature here if needed

    // Mark as paid
    admin.paidForMonth = new Date().getMonth();
    admin.lastPaymentId = paymentId;
    await admin.save();
    res.json({ message: 'Payment verified and marked as paid' });
  } catch (err) {
    res.status(500).json({ error: 'Verification failed' });
  }
});

router.post("/:adminId/invoice", async (req, res) => {
  const { adminName, email, amount } = req.body;

  try {
    const invoice = await razorpay.invoices.create({
      type: "invoice",
      description: `Salary payment for ${adminName}`,
      customer: {
        name: adminName,
        email: email,
      },
      line_items: [
        {
          name: "Monthly Salary",
          amount: amount, // in paise
          currency: "INR",
          quantity: 1,
        },
      ],
      notes: {
        payment_status: "Paid via Razorpay Order",
        issued_for: "Salary",
        issued_by: "LMS System",
      },
      currency: "INR",
    });

    await Admin.findByIdAndUpdate(req.params.adminId, {
      invoiceId: invoice.id,
    });

    res.json(invoice);
  } catch (err) {
    console.error("Invoice creation error:", err.response?.data || err);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

// GET /api/salary/invoice/:invoiceId
router.get("/invoice/:invoiceId", async (req, res) => {
  try {
    const invoice = await razorpay.invoices.fetch(req.params.invoiceId);
    res.redirect(invoice.short_url);
  } catch (err) {
    console.error("Error fetching invoice:", err);
    res.status(500).json({ message: "Failed to fetch invoice" });
  }
});


module.exports = router;
