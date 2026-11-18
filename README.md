# 🌾 KrishiChakra (कृषि चक्र)
> **Smart Rural Machinery Sharing & Resilient Dispatch Platform**  
> *Dynamic machinery allocation with travel buffers, deadline-driven priority rules, real machine photos, and automated weather/breakdown rescheduling.*

---

## 📌 Problem Statement & Key Solutions

Small and marginal farmers depend on equipment owners for tractors, combine harvesters, and sprayers. Bookings over phone calls cause clashes, idle machines, and missed sowing or harvest windows, directly reducing crop yield.

**KrishiChakra** coordinates equipment sharing while dynamically adapting to real-world disruptions:
1. **Zero Double-Bookings & Clashes**: Enforces strict mathematical inequalities ensuring machine start time is always $\ge$ previous end time $+$ rural road travel buffer.
2. **Deadline-Based Priority Rules**: Prioritizes operations with tighter deadlines (e.g. ripe paddy harvest before rain shatter) over flexible operations (routine sowing), displaying transparent plain-language explanations.
3. **Live Machine Photos**: Farmers can see real photographs of tractors, combine harvesters, and sprayers with work rates and pricing before requesting.
4. **Automated Weather & Breakdown Rescheduling**: Dynamically reschedules disrupted bookings with minimal perturbation to unaffected farmers.
5. **Multilingual AI Voice Assistant**: Built specifically for illiterate, elderly, or non-smartphone farmers—farmers simply speak naturally to book equipment instantly without typing or dealers.
6. **100% Multi-Language Translation**: Instant translation across **English, हिन्दी (Hindi), తెలుగు (Telugu), ਪੰਜਾਬੀ (Punjabi), and मराठी (Marathi)**, translating every single heading, card, button, and description.

---

## 🚀 Navigation & Core Views

1. 👨‍🌾 **Farmer Portal (किसान पोर्टल)**:
   * **Available Machinery Fleet (Photos & Specs)**: Real photographs of tractors, combines, and sprayers with 1-click booking.
   * **Lender Selection & Approval Notice**: Shows who is lending the machine (Owner Name, Phone, Rates) and indicates that the request requires owner approval before allotment.
   * **My Registered Farm Plots**: Track plot acreage, crop, and critical deadline windows.
   * **My Bookings & Live Status**: Displays both `⏳ Pending Owner Approval` and `✅ Approved & Allotted` bookings with plain-language rationales and 🔊 **Audio Speech Readout**.
   * **AI Voice Booking Assistant**: 1-click multilingual voice booking directly scheduling machines for farmers with speech recognition and automated SMS.
2. 🚜 **Equipment Owner Portal (उपकरण मालिक पोर्टल)**:
   * **Pending Booking Approvals Inbox (Action Required)**: Review incoming farmer requests with calculated work hours, earnings (₹), and travel distance; click **"Approve & Allot Machine"** to officially allocate the machine.
   * **Active Fleet Manager**: Track machine photos, work rates ($\text{acres/hr}$), hourly/per-acre pricing, and repair health.
   * **Confirmed Dispatches**: All approved bookings with verified travel buffers and zero clashes.
   * **Fleet Analytics**: Active fleet size, scheduled bookings, projected revenue, and transit distance saved.
3. 🤖 **AI Voice Assistant Engine (एआई वॉयस बुकिंग सहायक)**:
   * **Natural Speech Direct Booking**: Farmers speak naturally in Hindi, Telugu, Punjabi, Marathi, or English; the AI parses crop, acreage, and village to book machines instantly.
   * **Live Voice Readout & Automated SMS**: Real-time synthesized speech confirmation and automated SMS dispatch with travel buffer and zero-clash guarantee.

---

## 🛠️ Quick Launch Instructions

### Option 1: Direct Double-Click (Windows)
Double-click `Launch-App.bat` in this folder. It opens `index.html` in your browser in application mode.

### Option 2: Local Python Server
Run the built-in HTTP server:
```powershell
python server.py
```
Open [http://localhost:8080/index.html](http://localhost:8080/index.html) in your browser.

### Option 3: Automated Mathematical Verification Suite
Run the mathematical verification suite directly in PowerShell:
```powershell
python test_optimizer.py
```

---

## ⚖️ Judge Evaluation Checklist

| Evaluation Criteria | Where to Inspect in KrishiChakra |
| :--- | :--- |
| **No Double-Booking or Clashes** | Inspect the **"0 Clashes \| Buffers Safe"** badge in the top bar. The background engine strictly enforces: $\text{StartTime}(B_{i+1}) \ge \text{EndTime}(B_i) + \text{TravelBuffer}$. |
| **Machine Photos** | Check the **Available Machinery Fleet** section in the Farmer Portal and the Booking Modal preview to see real machine photos. |
| **Full Site Language Translation** | Switch the **Language dropdown** in the header between English, हिन्दी, తెలుగు, ਪੰਜਾਬੀ, and मराठी. Notice that every single word, heading, card, button, and modal translates instantly. |
| **Emergency Disruption Testing** | Click **"Inject Heavy Rain (Nov 19)"** or **"Inject Harvester Breakdown"** in the top bar. Affected bookings are automatically rescheduled to safe slots without disrupting unaffected farmers. |
| **Voice Assistance for Low-Literacy Farmers** | Click **"AI Voice Assistant — Speak to Book"** in the Farmer Portal, test the live voice recognition or one-click multilingual voice demo, and watch the instant direct booking and SMS confirmation. |

---
*Developed with ❤️ for Indian and global marginal farmers.*
