# 🌌 Wondercraft - Simple Server Form & Tracking Console

Wondercraft is a clean and simple tool for server teams to collect configuration details from clients and show them a live, high-tech status board as their server is being set up.

No complex code setup is needed to understand how it works!

---

## 🌟 What Wondercraft Does

1. **Build Custom Forms:** Create questions for your clients (like text answers, dates, single choice, or checkboxes) using a simple form editor.
2. **Collect Responses:** Send a public link to your clients to fill out.
3. **Track Status:** Clients get a **Reference Code** (for example: `TKN-5897CRFC-0446`). They can paste this code into a tracking search bar to see a live visual timeline of their request (Queued -> Working -> Completed or Rejected).
4. **Admin Dashboard:** Log in as an administrator to approve requests, update their status, and add other staff members.

---

## 🔑 Default Administrator Login

To log in and start building forms, use the following credentials:
* **Login Link:** `http://localhost:3000/login`
* **Email:** `sanpatel323@gmail.com`
* **Password:** `Codecode21@`

---

## 🚀 How to Use Wondercraft (Easy Guide)

### 1. Build a Form
* Go to the **Forms Console** in your Dashboard.
* Click **Build New Form** (or **Add Canvas Field**).
* Enter a title and description, choose your question types, and click **Save Form**.

### 2. Share the Link
* On your forms list, click the **Copy Link** icon. 
* Send this link to your clients. When they submit the form, they will receive a unique **Tracking Token** (e.g. `TKN-XXXX`).

### 3. Review Submissions & Update Status
* In your dashboard, click **Review Request** next to any new submission.
* Change the status to **Working** or **Completed** to update the client's timeline.

### 4. Client Tracking
* Clients can go to the **Track Ticket Status** page, enter their token, and see their live progress timeline.

---

## ☁️ How to Deploy to Vercel (Simplified Steps)

To put this website online permanently using Vercel, follow these simple steps:

### Step 1: Set up your Database (MongoDB Atlas)
1. Register for a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a database.
2. Under **Network Access**, click **Add IP Address** and select **Allow Access From Anywhere** (`0.0.0.0/0`). This is necessary so Vercel can connect to your database.
3. Go to **Database Access** and create a database user and password.
4. Copy your database connection link (looks like `mongodb+srv://...`).

### Step 2: Initialize the Administrator Account
1. Open your local project folder and paste your database connection link into the `.env` file next to `MONGODB_URI=`.
2. Open your terminal and run:
   ```bash
   npm run db:seed
   ```
   *This registers your admin account in the database.*

### Step 3: Deploy on Vercel
1. Upload your code to a GitHub repository.
2. Log into [Vercel](https://vercel.com) and import your repository.
3. Under **Environment Variables**, add these two settings:
   * **`MONGODB_URI`**: *Your MongoDB Atlas connection link*
   * **`JWT_SECRET`**: `Codecode21@` *(or any secret password of your choice)*
4. Click **Deploy**! Your website is now live!
