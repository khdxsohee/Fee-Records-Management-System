![Version](https://img.shields.io/badge/version-v1.0-blue.svg)
![Status](https://img.shields.io/badge/status-active-green.svg)
![Google Apps Script](https://img.shields.io/badge/Apps%20Script-4285F4?style=flat&logo=google&logoColor=white)
![Google Sheets](https://img.shields.io/badge/Google%20Sheets-34A853?style=flat&logo=googlesheets&logoColor=white)
![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
[![Follow on GitHub](https://img.shields.io/badge/GitHub-Follow%20@khdxsohee-181717?style=flat&logo=github&logoColor=white)](https://github.com/khdxsohee)
[![Live Demo Updated](https://img.shields.io/badge/Live%20Demo-khalid--randhawa.web.app-brightgreen?style=flat)](https://khalid-randhawa.web.app/apps-projects/indexwithfeeupdatefeature.html)
### Fee Records Management System

A dynamic and efficient web application built on Google Apps Script and Google Sheets to manage student fee records. This system provides a user-friendly interface for registering students, tracking monthly fee payments, and generating comprehensive reports. It's a powerful tool for educational institutions and tutors to simplify their administrative tasks..

### Live Demo & Screenshots (PIN IS 1234)

-   **Live Demo Old:** [Click Here to see Live Preview](https://khalid-randhawa.web.app/apps-projects/fee-records-management-system.html)
-   **Live Demo Updated:** [Click Here to see Live Preview](https://khalid-randhawa.web.app/apps-projects/indexwithfeeupdatefeature.html)
-   **Live Demo Updated Pin Password Added:** [Click Here to see Live Preview](https://khalid-randhawa.web.app/apps-projects/Fee-Records-management-system-with-pin-security.html)
-   **Live Demo Updated Email Confirmation + Pin:** [Click Here to see Live Preview](https://khalid-randhawa.web.app/apps-projects/Fee-Records-management-system-with-pin-security.html)
-   **Live Demo Updated Theme Change Feature:** [Click Here to see Live Preview](https://khalid-randhawa.web.app/apps-projects/index-with-email-confirmation+theme%20changer+receipt.html)
-   **Live Demo Updated + Receipt Generation PDF Added:** [Click Here to see Live Preview](https://khalid-randhawa.web.app/apps-projects/index-with-email-confirmation%20+%20recept%20generation.html)

---

<img width="1351" height="641" alt="image" src="https://github.com/user-attachments/assets/0af9fcc1-afb5-4b40-9aaa-1b63bba8aced" />

## ✨ New Key Features Added

### 1. Receipt Generation (PDF) (Pin is : 1234)
Generate professional PDF receipts automatically for each fee payment, enhancing record-keeping and providing students/parents with official payment proof.

### 2. Email Confirmation (Pin is : 1234)
Receive automated confirmation emails with fee payment details and receipts, ensuring transparent communication. *(Configure your email in the Apps Script for personalized use.)*

### 3. PIN Password Security (Pin is : 1234)
Protect your dashboard with a secure PIN (default: `1234`), restricting unauthorized access and safeguarding sensitive data.

### 4. Color Theme Changing (Pin is : 1234)
You can change Color Theme according to your favourite color. Color theme will be saved in local storage as of user preference.

---
### Features

This system is packed with features to streamline your fee management process:

-   **Student Registration:** Easily add new students with their details, including name, class, admission date, and monthly fee. The system prevents duplicate entries to maintain data integrity.
-   **Fee Submission:** Record fee payments for any student for any given month. The system automatically updates the payment status (e.g., Paid, Half Paid, Extra Paid) based on the amount received.
-   **Real-time Dashboard:** A comprehensive dashboard provides an at-a-glance view of your students' payment status. You can filter the dashboard by month to see who has paid and who is pending.
-   **Student Statements:** Generate a detailed statement for any student, showing their complete fee payment history across all months.
-   **Student Status Management:** Mark students as "Inactive" with a withdrawal date when they leave, ensuring your records stay accurate.
-   **Data Export:** Export monthly reports to a CSV file for offline analysis and record-keeping.
-   **WhatsApp Integration:** A unique feature that allows you to send a report summary directly to a WhatsApp number.
-   **Fully Automated:** The entire backend logic runs on Google Apps Script, requiring no external servers or complex databases.

### Technologies Used

-   **Backend:** Google Apps Script
-   **Database:** Google Sheets
-   **Frontend:** HTML, CSS, JavaScript
-   **Libraries:** Chart.js, jsPDF, jsPDF-autotable, XLSX.js

### Getting Started

#### Prerequisites

To use this application, you need a Google account with access to Google Sheets and Google Apps Script.

#### Step 1: Create a Google Sheet

1.  Go to [Google Sheets](https://sheets.google.com/) and create a new spreadsheet.
2.  Name the spreadsheet something memorable, e.g., "Student Fee Records".
3.  In the first sheet, rename it to `Student Registration`. This sheet will store all your student details. The script will automatically create the header row.

#### Step 2: Set Up the Google Apps Script

1.  In your new Google Sheet, click on `Extensions` > `Apps Script`. This will open a new tab with the Apps Script editor.
2.  Delete any existing code in the editor.
3.  Copy the provided Apps Script code (from your prompt) and paste it into the code editor.

```
// Global variables for easy sheet access
const SPREADSHEET = SpreadsheetApp.getActiveSpreadsheet();
const REGISTRATION_SHEET_NAME = "Student Registration";

function doGet(e) {
  const action = e.parameter.action;

  if (action === "getStudents") {
    return getStudents();
  }

  if (action === "getStudentData") {
    const name = e.parameter.name;
    return getStudentData(name);
  }

  if (action === "getStatement") {
    const name = e.parameter.name;
    return getStatement(name);
  }

  // ✅ New: Get all data for the dashboard, including unpaid students, for a specific month or all months
  if (action === "getAllData") {
    return getAllData(e.parameter.month);
  }

  // ✅ New: Get list of all available months for the dropdown menu
  if (action === "getMonths") {
    return getAvailableMonths();
  }

  return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Invalid action'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const postData = JSON.parse(e.postData.contents);
    const action = postData.action;
    const data = postData.data;

    if (action === "registerStudent") {
      return registerStudent(data);
    }

    if (action === "submitFee") {
      return submitFee(data);
    }

    if (action === "markWithdrawn") {
      return markWithdrawn(data);
    }
    if (action === "updateStudentDetails") {
      return updateStudentDetails(data);
    }
    return ContentService.createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Invalid action'
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
        status: 'error',
        message: error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}


// --- New: Update Student Details ---
function updateStudentDetails(data) {
    const regSheet = SPREADSHEET.getSheetByName(REGISTRATION_SHEET_NAME);
    if (!regSheet) {
        return ContentService.createTextOutput(JSON.stringify({
            status: 'error',
            message: 'Registration sheet not found.'
        })).setMimeType(ContentService.MimeType.JSON);
    }

    const regData = regSheet.getDataRange().getValues();
    let studentRowIndex = -1;
    for (let i = 1; i < regData.length; i++) {
        if (regData[i][0].toLowerCase() === data.name.toLowerCase()) {
            studentRowIndex = i + 1;
            break;
        }
    }

    if (studentRowIndex === -1) {
        return ContentService.createTextOutput(JSON.stringify({
            status: 'error',
            message: 'Student not found.'
        })).setMimeType(ContentService.MimeType.JSON);
    }

    const range = regSheet.getRange(studentRowIndex, 1, 1, 6);
    const row = range.getValues()[0];

    row[1] = data.class;
    row[3] = data.monthlyFee;
    row[4] = data.status;
    row[5] = data.withdrawnDate;

    range.setValues([row]);

    return ContentService.createTextOutput(JSON.stringify({
        status: 'success'
    })).setMimeType(ContentService.MimeType.JSON);
}

// --- Updated: Get Specific Student Data & Fee History (for Fee Entry Summary) ---
function getStudentData(name) {
    const regSheet = SPREADSHEET.getSheetByName(REGISTRATION_SHEET_NAME);
    if (!regSheet) {
        return ContentService.createTextOutput(JSON.stringify(null)).setMimeType(ContentService.MimeType.JSON);
    }

    const regData = regSheet.getDataRange().getValues();
    let studentDetails = null;
    for (let i = 1; i < regData.length; i++) {
        if (regData[i][0].toLowerCase() === name.toLowerCase()) {
            studentDetails = {
                name: regData[i][0],
                class: regData[i][1],
                admissionDate: Utilities.formatDate(new Date(regData[i][2]), "GMT", "yyyy-MM-dd"),
                monthlyFee: regData[i][3],
                status: regData[i][4],
                withdrawnDate: regData[i][5] ? Utilities.formatDate(new Date(regData[i][5]), "GMT", "yyyy-MM-dd") : '',
            };
            break;
        }
    }

    if (!studentDetails) {
        return ContentService.createTextOutput(JSON.stringify(null)).setMimeType(ContentService.MimeType.JSON);
    }

    // Calculate total fee paid and months present from ALL sheets
    let totalFeePaid = 0;
    let monthsPresent = new Set();
    const sheets = SPREADSHEET.getSheets();
    sheets.forEach(sheet => {
        const sheetName = sheet.getName();
        if (sheetName.match(/^\w+\s\d{4}$/)) {
            const data = sheet.getDataRange().getValues();
            for (let i = 1; i < data.length; i++) {
                if (data[i][0] && data[i][0].toLowerCase() === name.toLowerCase()) {
                    totalFeePaid += parseFloat(data[i][4] || 0);
                    monthsPresent.add(sheetName);
                }
            }
        }
    });

    studentDetails.totalFeePaid = totalFeePaid;
    studentDetails.monthsPresent = monthsPresent.size;

    return ContentService.createTextOutput(JSON.stringify(studentDetails))
        .setMimeType(ContentService.MimeType.JSON);
}


// --- New Student Registration Function ---
function registerStudent(data) {
    let sheet = SPREADSHEET.getSheetByName(REGISTRATION_SHEET_NAME);
    if (!sheet) {
        sheet = SPREADSHEET.insertSheet(REGISTRATION_SHEET_NAME);
        sheet.appendRow(["Name", "Class", "Date of Admission", "Monthly Fee", "Status", "Date of Dropout"]);
    }

    // Check for duplicate name AND class
    const regData = sheet.getDataRange().getValues();
    for (let i = 1; i < regData.length; i++) {
        if (regData[i][0].toLowerCase() === data.name.toLowerCase() && regData[i][1].toLowerCase() === data.class.toLowerCase()) {
            return ContentService.createTextOutput(JSON.stringify({
                status: 'error',
                message: 'Student with this name and class has already registered.'
            }))
            .setMimeType(ContentService.MimeType.JSON);
        }
    }

    sheet.appendRow([data.name, data.class, data.admissionDate, data.monthlyFee, "Active", ""]);

    return ContentService.createTextOutput(JSON.stringify({
        status: 'success'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// --- Get All Students Function (for autocomplete) ---
function getStudents() {
    const sheet = SPREADSHEET.getSheetByName(REGISTRATION_SHEET_NAME);
    if (!sheet) {
        return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON);
    }
    const data = sheet.getDataRange().getValues();
    const students = data.slice(1).map(row => [row[0], row[1], row[2], row[3], row[4], row[5]]);

    return ContentService.createTextOutput(JSON.stringify(students))
    .setMimeType(ContentService.MimeType.JSON);
}

// --- Get Specific Student Data & Fee History (for Fee Entry Summary) ---
function getStudentData(name) {
    const regSheet = SPREADSHEET.getSheetByName(REGISTRATION_SHEET_NAME);
    if (!regSheet) {
        return ContentService.createTextOutput(JSON.stringify(null)).setMimeType(ContentService.MimeType.JSON);
    }

    const regData = regSheet.getDataRange().getValues();
    let studentDetails = null;
    for (let i = 1; i < regData.length; i++) {
        if (regData[i][0].toLowerCase() === name.toLowerCase()) {
            studentDetails = {
                name: regData[i][0],
                class: regData[i][1],
                admissionDate: Utilities.formatDate(new Date(regData[i][2]), "GMT", "yyyy-MM-dd"),
                monthlyFee: regData[i][3],
                status: regData[i][4],
                withdrawnDate: regData[i][5] ? Utilities.formatDate(new Date(regData[i][5]), "GMT", "yyyy-MM-dd") : null,
            };
            break;
        }
    }

    if (!studentDetails) {
        return ContentService.createTextOutput(JSON.stringify(null)).setMimeType(ContentService.MimeType.JSON);
    }

    // Calculate total fee paid and months present from ALL sheets
    let totalFeePaid = 0;
    let monthsPresent = new Set();
    const sheets = SPREADSHEET.getSheets();
    sheets.forEach(sheet => {
        const sheetName = sheet.getName();
        if (sheetName.match(/^\w+\s\d{4}$/)) {
            const data = sheet.getDataRange().getValues();
            for (let i = 1; i < data.length; i++) {
                if (data[i][0] && data[i][0].toLowerCase() === name.toLowerCase()) {
                    totalFeePaid += parseFloat(data[i][4] || 0);
                    monthsPresent.add(sheetName);
                }
            }
        }
    });

    studentDetails.totalFeePaid = totalFeePaid;
    studentDetails.monthsPresent = monthsPresent.size;

    return ContentService.createTextOutput(JSON.stringify(studentDetails))
    .setMimeType(ContentService.MimeType.JSON);
}










// --- Submit Fee Function (to monthly sheet) ---
// --- Submit Fee Function (to monthly sheet) ---
function submitFee(data) {
    const monthName = data.month;
    let sheet = SPREADSHEET.getSheetByName(monthName);

    if (!sheet) {
        sheet = SPREADSHEET.insertSheet(monthName);
        sheet.appendRow(["Name", "Class", "Date", "Monthly Fee", "Paid Amount", "Status"]);
    }

    const monthlyData = sheet.getDataRange().getValues();
    const monthlyFeeFromData = parseFloat(data.monthlyFee);
    const paidAmountFromData = parseFloat(data.paidAmount);

    let studentRowIndex = -1;
    let currentPaidAmount = 0;

    // Find the student's row and current paid amount
    for (let i = 1; i < monthlyData.length; i++) {
        if (monthlyData[i][0] && monthlyData[i][0].toLowerCase() === data.name.toLowerCase()) {
            studentRowIndex = i + 1;
            currentPaidAmount = parseFloat(monthlyData[i][4] || 0);
            break;
        }
    }

    const newTotalPaidAmount = currentPaidAmount + paidAmountFromData;
    let status;

    // New logic for 'Extra Paid' status
    if (newTotalPaidAmount > monthlyFeeFromData) {
        status = "Extra Paid";
    } else if (newTotalPaidAmount === monthlyFeeFromData) {
        status = "Paid";
    } else {
        status = "Half Paid";
    }

    const today = new Date();
    const formattedDate = Utilities.formatDate(today, SPREADSHEET.getSpreadsheetTimeZone(), "yyyy-MM-dd");

    if (studentRowIndex === -1) {
        // Student not found, add a new row
        sheet.appendRow([
            data.name,
            data.class,
            formattedDate,
            monthlyFeeFromData,
            newTotalPaidAmount,
            status
        ]);
    } else {
        // Student found, update the existing row
        sheet.getRange(studentRowIndex, 5).setValue(newTotalPaidAmount);
        sheet.getRange(studentRowIndex, 6).setValue(status);
    }

    return ContentService.createTextOutput(JSON.stringify({
        status: 'success'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}









// --- Mark Student as Withdrawn Function ---
function markWithdrawn(data) {
    const regSheet = SPREADSHEET.getSheetByName(REGISTRATION_SHEET_NAME);
    if (!regSheet) {
        return ContentService.createTextOutput(JSON.stringify({
            status: 'error',
            message: 'Registration sheet not found.'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const regData = regSheet.getDataRange().getValues();
    for (let i = 1; i < regData.length; i++) {
        if (regData[i][0].toLowerCase() === data.name.toLowerCase()) {
            regSheet.getRange(i + 1, 5).setValue("Inactive");
            regSheet.getRange(i + 1, 6).setValue(data.withdrawnDate);
            return ContentService.createTextOutput(JSON.stringify({
                status: 'success'
            }))
            .setMimeType(ContentService.MimeType.JSON);
        }
    }

    return ContentService.createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Student not found.'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// --- Get Student Statement Function ---
function getStatement(name) {
    let records = [];
    const sheets = SPREADSHEET.getSheets();
    sheets.forEach(sheet => {
        const sheetName = sheet.getName();
        if (sheetName.match(/^\w+\s\d{4}$/)) {
            const data = sheet.getDataRange().getValues();
            for (let i = 1; i < data.length; i++) {
                if (data[i][0] && data[i][0].toLowerCase() === name.toLowerCase()) {
                    records.push({
                        month: sheetName,
                        name: data[i][0],
                        class: data[i][1],
                        date: Utilities.formatDate(new Date(data[i][2]), "GMT", "yyyy-MM-dd"),
                        monthlyFee: data[i][3],
                        paidAmount: data[i][4],
                        status: data[i][5]
                    });
                }
            }
        }
    });

    if (records.length > 0) {
        return ContentService.createTextOutput(JSON.stringify({
            status: 'success',
            records: records
        }))
        .setMimeType(ContentService.MimeType.JSON);
    } else {
        return ContentService.createTextOutput(JSON.stringify({
            status: 'error',
            message: 'No records found.'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
}

// --- ✅ Updated: Get ALL data for dashboard, including unpaid students, for a specific month or all months ---
function getAllData(selectedMonth) {
    const regSheet = SPREADSHEET.getSheetByName(REGISTRATION_SHEET_NAME);
    if (!regSheet) {
        return ContentService.createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON);
    }
    const regData = regSheet.getDataRange().getValues();
    const allRegisteredStudents = regData.slice(1).map(row => ({
        name: row[0],
        class: row[1],
        admissionDate: new Date(row[2]),
        monthlyFee: row[3],
        status: row[4],
        withdrawnDate: row[5] ? new Date(row[5]) : null
    }));

    let allRows = [];

    if (selectedMonth) {
        // Only get data for the selected month
        const targetMonth = new Date(selectedMonth);
        const targetMonthName = targetMonth.toLocaleString('default', {
            month: 'long',
            year: 'numeric'
        });
        allRows = getMonthlyData(targetMonthName, allRegisteredStudents);
    } else {
        // Get data for all months
        const sheets = SPREADSHEET.getSheets();
        sheets.forEach(sheet => {
            const sheetName = sheet.getName();
            if (sheetName.match(/^\w+\s\d{4}$/)) {
                const monthRows = getMonthlyData(sheetName, allRegisteredStudents);
                allRows = allRows.concat(monthRows);
            }
        });
    }

    const finalData = allRows.map(r => [r.month, r.name, r.class, r.date, r.monthlyFee, r.paidAmount, r.status]);
    return ContentService.createTextOutput(JSON.stringify(finalData))
    .setMimeType(ContentService.MimeType.JSON);
}

// --- ✅ New Helper function for single month data fetching ---
function getMonthlyData(targetMonthName, allRegisteredStudents) {
    const monthlySheet = SPREADSHEET.getSheetByName(targetMonthName);
    let rows = [];
    let paidStudents = new Set();

    if (monthlySheet) {
        const monthlyData = monthlySheet.getDataRange().getValues();
        for (let i = 1; i < monthlyData.length; i++) {
            if (monthlyData[i][0]) {
                rows.push({
                    month: targetMonthName,
                    name: monthlyData[i][0],
                    class: monthlyData[i][1],
                    date: monthlyData[i][2] ? Utilities.formatDate(new Date(monthlyData[i][2]), "GMT", "yyyy-MM-dd") : "",
                    monthlyFee: monthlyData[i][3] || 0,
                    paidAmount: monthlyData[i][4] || 0,
                    status: monthlyData[i][5]
                });
                paidStudents.add(monthlyData[i][0].toLowerCase());
            }
        }
    }

    const [m, y] = targetMonthName.split(" ");
    const monthIndex = new Date(`${m} 1, ${y}`).getMonth();
    const year = parseInt(y);

    allRegisteredStudents.forEach(student => {
        const admitted = (student.admissionDate.getFullYear() < year) ||
            (student.admissionDate.getFullYear() === year && student.admissionDate.getMonth() <= monthIndex);

        let withdrawnBefore = false;
        if (student.status.toLowerCase() === 'inactive' && student.withdrawnDate) {
            const lastDayPrevMonth = new Date(year, monthIndex, 0);
            if (student.withdrawnDate < lastDayPrevMonth) withdrawnBefore = true;
        }

        if (admitted && !withdrawnBefore && !paidStudents.has(student.name.toLowerCase())) {
            rows.push({
                month: targetMonthName,
                name: student.name,
                class: student.class,
                date: "",
                monthlyFee: student.monthlyFee,
                paidAmount: 0,
                status: "Not Paid"
            });
        }
    });
    return rows;
}

// --- ✅ New: Get all months for dropdown ---
function getAvailableMonths() {
    const sheets = SPREADSHEET.getSheets();
    let months = new Set();
    sheets.forEach(sheet => {
        const sheetName = sheet.getName();
        if (sheetName.match(/^\w+\s\d{4}$/)) {
            months.add(sheetName);
        }
    });
    const sortedMonths = Array.from(months).sort((a, b) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        return dateA - dateB;
    });
    return ContentService.createTextOutput(JSON.stringify(sortedMonths))
    .setMimeType(ContentService.MimeType.JSON);
}
```

5.  Click the "Save project" button (the floppy disk icon).
6.  Give your project a name, e.g., `FeeRecords_Backend`.

#### Step 3: Deploy the Web App

1.  In the Apps Script editor, click on the `Deploy` button in the top right corner and select `New deployment`.
2.  Click the gear icon next to "Select type" and choose `Web app`.
3.  Fill in the deployment settings:
    -   **Description:** "Initial deployment" (or a descriptive name).
    -   **Execute as:** `Me` (your Google account).
    -   **Who has access:** `Anyone`.
4.  Click `Deploy`.
5.  Google will ask for authorization. Follow the on-screen prompts:
    -   Click `Review permissions`.
    -   Choose your Google account.
    -   You may see a "Google hasn’t verified this app" warning. This is normal because it's your own app. Click `Advanced` and then `Go to [Project Name] (unsafe)`.
    -   Grant the necessary permissions (to view and manage your spreadsheets).
6.  Once the deployment is successful, you will see a popup with the Web app URL. **Copy this URL.** You will need it to link your frontend.

#### Step 4: Link the Frontend HTML File

1.  You have an `index.html` file that serves as the frontend. You need to open this file in a text editor.
2.  Find the `const SCRIPT_URL = '';` line in your JavaScript code.
3.  Paste the Web app URL you copied in the previous step between the single quotes.
4.  Save the `index.html` file.

Now your frontend is connected to your backend. You can host this `index.html` file on any web server or a service like Firebase Hosting, as you have done in your live demo.

### Usage Guide

-   **Student Registration:**
    -   Navigate to the "Register Student" tab.
    -   Fill in the student details and click "Register".
    -   The student will be added to the `Student Registration` sheet.
-   **Fee Entry:**
    -   Go to the "Fee Entry" tab.
    -   Start typing a student's name in the "Name" field. An autocomplete dropdown will appear.
    -   Select the student. Their class and monthly fee will auto-populate.
    -   Enter the `Paid Amount`.
    -   Select the `Month` for which the fee is being paid.
    -   Click `Submit Fee`. The record will be added to a new sheet with the month's name (e.g., `August 2025`).
-   **Dashboard:**
    -   Go to the "Dashboard" tab.
    -   Select a month from the dropdown to see the payment status for that month.
    -   The dashboard will show all students and their respective statuses: "Paid", "Half Paid", "Extra Paid", or "Not Paid".
-   **Student Statement:**
    -   Navigate to the "Fee Statement" tab.
    -   Search for a student by name.
    -   The system will display a full statement of all their payments.
-   **Exporting Data:**
    -   On the Dashboard, click the "Export CSV" button to download the data for the currently selected month.
-   **Marking as Withdrawn:**
    -   On the "Register Student" tab, you can search for a student and update their status to "Inactive". This will mark them as withdrawn and record the date of dropout.

### Contribution

Feel free to fork this repository, suggest improvements, or submit pull requests. For any issues or feature requests, please open an issue on GitHub.

### Author

-   **Khalid R**
-   GitHub: [khdxsohee](https://github.com/khdxsohee)
