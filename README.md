# Fee Records Management System

![Version](https://img.shields.io/badge/version-v1.1.0-blue.svg)
![Status](https://img.shields.io/badge/status-active-green.svg)
![Google Apps Script](https://img.shields.io/badge/Apps%20Script-4285F4?style=flat&logo=google&logoColor=white)
![Google Sheets](https://img.shields.io/badge/Google%20Sheets-34A853?style=flat&logo=googlesheets&logoColor=white)
![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
[![Live Demo Updated](https://img.shields.io/badge/Live%20Demo-khalid--randhawa.web.app-brightgreen?style=flat)](https://khalid-randhawa.web.app/apps-projects/indexwithfeeupdatefeature.html)

A dynamic, open-source web application designed to **streamline student fee management** for educational institutions and tutors. Built entirely on the Google ecosystem, this system leverages **Google Apps Script** for backend logic and **Google Sheets** as a reliable, cloud-based database.

Say goodbye to manual ledgers and complex software—manage registration, track monthly payments, and generate insightful reports with a simple, user-friendly interface.

## 🚀 Key Features

| Feature | Description | Benefit to User |
| :--- | :--- | :--- |
| **Real-time Dashboard** | Provides an up-to-the-minute overview of all student payment statuses. | Instantly identify who's paid and who's pending, filtered by month. |
| **Automated Fee Tracking** | Records payments and automatically assigns status: **Paid**, **Half Paid**, **Extra Paid**, or **Not Paid**. | Eliminates manual calculations and reduces tracking errors. |
| **Comprehensive Statements** | Generate a detailed, chronological statement of a student's entire fee payment history. | Simplifies parent communication and internal audits. |
| **PDF Receipt Generation** | Automatically creates and provides professional PDF receipts for every transaction. | Enhances professional record-keeping and provides proof of payment. |
| **PIN Security** | Protects the dashboard and sensitive data with a secure PIN (default: `1234`). | Ensures data security and restricts unauthorized access. |
| **Student Lifecycle Management** | Features for registering new students, editing details, and marking students as **Withdrawn/Inactive**. | Keeps student records clean and up-to-date. |
| **Data Export & Reports** | Export monthly fee records to a **CSV file** for offline analysis. | Provides flexibility for external reporting and analysis. |
| **WhatsApp Integration** | Unique feature to send a payment report summary directly via WhatsApp. | Streamlines and accelerates communication. |

## 💻 Technologies

| Category | Technology | 
| :--- | :--- | 
| **Backend** | Google Apps Script | 
| **Database** | Google Sheets | 
| **Frontend** | HTML5, CSS3, JavaScript | 
| **Libraries** | Chart.js, jsPDF, XLSX.js |

-----

## 🖼️ Live Demo & Screenshots

Test every feature—from registration to receipt generation—using the live demo. All records in the demo are **fictional**.

**PIN for Demo: `1234`**

<p align="center">
  <a href="https://khalid-randhawa.web.app/apps-projects/index-with-email-confirmation%20+%20recept%20generation.html">
    <img src="https://img.shields.io/badge/LIVE%20DEMO-Full%20Features%20%26%20Receipt-brightgreen?style=for-the-badge">
  </a>
  &nbsp;
  <a href="https://khalid-randhawa.web.app/apps-projects/Fee-Records-management-system-with-pin-security.html">
    <img src="https://img.shields.io/badge/LIVE%20DEMO-PIN%20Security%20Only-green?style=for-the-badge">
  </a>
  &nbsp;
  <a href="https://khalid-randhawa.web.app/apps-projects/index-with-email-confirmation+theme%20changer+receipt.html">
    <img src="https://img.shields.io/badge/LIVE%20DEMO-Theme%20Changer%20%26%20Receipt-blue?style=for-the-badge">
  </a>
</p>

<img width="1351" height="641" alt="Dashboard Screenshot" src="https://github.com/user-attachments/assets/0af9fcc1-afb5-4b40-9aaa-1b63bba8aced" />


-----

## 🛠️ Getting Started (Self-Hosting)

You need a Google Account to use Google Sheets and Google Apps Script.

### Step 1: Prepare Google Sheets

1.  Create a **New Google Sheet** and name it (e.g., "Student Fee Records").
2.  Rename the first sheet to `Student Registration`. The script will automatically populate the header row on the first run.

### Step 2: 🔗 Full Source Code

If you want to see the complete Apps Script code in a single file, click here:
<p align="center">
  <a href="https://khalid-randhawa.web.app/apps-projects/FMS-dashboard/FMS-apps-script.html">
    <img src="https://img.shields.io/badge/View%20Apps%20Script%20Code-Source%20Code-000000?style=for-the-badge&logo=github&logoColor=white">
  </a>
</p>

### Step 3: Deploy the Apps Script Backend

1.  In your Google Sheet, go to `Extensions` \> `Apps Script`.
2.  Paste the provided Google Apps Script code into the editor.
3.  Click **Save Project**.
4.  Click **Deploy** (top right) \> **New deployment**.
5.  Set the deployment type to **Web app**.
6.  Configure the settings:
      * **Execute as:** `Me` (your account).
      * **Who has access:** `Anyone`.
7.  Click **Deploy** and complete the necessary **authorization** steps (you'll need to grant permission for the script to manage your spreadsheets).
8.  **Crucially, copy the resulting Web app URL.** This is your unique backend API endpoint.

### Step 4: Connect the Frontend

1.  Open your `index.html` frontend file.
2.  Find the JavaScript variable for the API URL:
    ```javascript
    const SCRIPT_URL = ''; // <-- PASTE YOUR URL HERE
    ```
3.  Paste the **Web app URL** you copied in Step 2 between the single quotes.
4.  Save the `index.html` file.

The application is now fully linked\! You can host your `index.html` file on any service (like Firebase Hosting, GitHub Pages, or a local server) to use the system.

## 🙌 Contribution

We welcome contributions\! If you have suggestions for new features, bug fixes, or improvements to the codebase, please:

1.  **Fork** the repository.
2.  Create a new branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a **Pull Request**.

### Author

                                                    Made with 💙 by khdxsohee
