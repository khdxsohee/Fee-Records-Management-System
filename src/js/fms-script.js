 /*
 * ===================================================================
 * PROJECT: Fee Records Management System (FMS)
 * VERSION: v1.1.0 - Major Feature Update
 * DATE: 2025-10-10
 * AUTHOR: khdxsohee
 * ===================================================================
 */

 const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxAKGnz9ptb1iXPqKwidl3-UAp-DKXhPl6Sjd3fJgNK_3ex9-lX03ECMrOjws6y_eJlSw/exec'; // *** IMPORTANT: DEPLOY KARKE URL YAHAN PASTE KAREIN ***

        let receiptData = null;
        const sections = document.querySelectorAll('.section');

        let allStudents = [];
        let currentMonthlyFee = 0; // New global variable to store monthly fee

        // Dashboard variables
        let allRows = [];
        let filtered = [];
        let barChart, lineChart;

        const monthSelect = document.getElementById('monthSelect');
        const statusSelect = document.getElementById('statusSelect');
        const searchInput = document.getElementById('searchInput');
        const tbody = document.querySelector('#dataTable tbody');
        const info = document.getElementById('tableInfo');
        // Password Protection Elements
        const passwordOverlay = document.getElementById('passwordOverlay');
        const passwordForm = document.getElementById('passwordForm');
        const passwordInput = document.getElementById('passwordInput');
        const passwordAlert = document.getElementById('passwordAlert');
        const correctPIN = '1234';
        function showSection(sectionId) {
            sections.forEach(section => {
                section.style.display = 'none';
            });
            document.getElementById(sectionId).style.display = 'block';

            // Special logic for sections that need initial data
            if (sectionId === 'feeEntrySection') {
                getAllStudents();
                populateMonthDropdown();
            } else if (sectionId === 'withdrawnSection') {
                getAllStudents();
            } else if (sectionId === 'statementSection') {
                getAllStudentsForStatement();
            } else if (sectionId === 'dashboardSection') {
                initDashboard();
            } else if (sectionId === 'editSection') { // Naya code
                getAllStudentsForEdit();
            } else if (sectionId === 'editFeeSection') { // New code
                getAllStudentsForEditFee();
                populateEditFeeMonthDropdown();
            }
        }

        function closeReceiptModal() {
            document.getElementById("receiptModal").style.display = "none";
            receiptData = null;
        }



        // Initial setup
        document.addEventListener("DOMContentLoaded", () => {
            const today = new Date().toISOString().split("T")[0];
            document.getElementById("regAdmissionDate").value = today;
            document.getElementById("withdrawnDate").value = today;

            const urlParams = new URLSearchParams(window.location.search);
            const sectionToShow = urlParams.get('section');
            if (sectionToShow) {
                showSection(sectionToShow);
            } else {
                showSection('dashboardSection');
            }
        });

        // Password form submission handler
        passwordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const enteredPIN = passwordInput.value;
            if (enteredPIN === correctPIN) {
                // Fade out and hide the overlay
                passwordOverlay.style.opacity = '0';
                passwordOverlay.style.visibility = 'hidden';
            } else {
                showAlert(passwordAlert, 'Incorrect PIN. Please try again.', 'error');
                passwordInput.value = '';
            }
        });

        // Auto login on input (NEW LOGIC)
        passwordInput.addEventListener('input', () => {
            if (passwordInput.value === correctPIN) {
                passwordOverlay.style.opacity = '0';
                passwordOverlay.style.visibility = 'hidden';
            }
        });
        // --- Shared Autocomplete Logic ---
        async function getAllStudents() {
            try {
                const response = await fetch(SCRIPT_URL + '?action=getStudents');
                const data = await response.json();
                allStudents = data;
            } catch (error) {
                console.error('Error fetching students:', error);
            }
        }

        function setupAutocomplete(inputElementId, listElementId, callback) {
            const input = document.getElementById(inputElementId);
            const list = document.getElementById(listElementId);
            const searchLoading = document.getElementById('nameSearchLoading');

            input.addEventListener('input', () => {
                const searchText = input.value.toLowerCase();
                list.innerHTML = '';
                if (searchText.length > 0) {
                    if (searchLoading) searchLoading.style.display = 'block'; // Show loading text
                    const filteredStudents = allStudents.filter(student =>
                        student[0].toLowerCase().includes(searchText)
                    );

                    if (filteredStudents.length > 0) {
                        filteredStudents.forEach(student => {
                            const li = document.createElement('li');
                            li.textContent = student[0];
                            li.addEventListener('click', () => {
                                input.value = student[0];
                                list.innerHTML = '';
                                if (searchLoading) searchLoading.style.display = 'none'; // Hide loading text
                                if (callback) callback(student[0]);
                            });
                            list.appendChild(li);
                        });
                    } else {
                        list.innerHTML = '<li>No student found.</li>';
                    }
                } else {
                    list.innerHTML = '';
                }
                if (searchLoading) searchLoading.style.display = 'none'; // Hide loading text after processing
            });
        }

        // --- New Student Registration Logic ---
        const registrationForm = document.getElementById('registrationForm');
        const registrationAlert = document.getElementById('registrationAlert');
        const registrationLoadingIndicator = document.getElementById('registrationLoadingIndicator');

        registrationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            registrationLoadingIndicator.style.display = 'flex'; // Loading indicator show
            const data = {
                name: document.getElementById('regName').value,
                class: document.getElementById('regClass').value,
                admissionDate: document.getElementById('regAdmissionDate').value,
                monthlyFee: document.getElementById('regMonthlyFee').value
            };

            fetch(SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify({ action: 'registerStudent', data: data }),
                headers: { 'Content-Type': 'text/plain' }
            })
                .then(response => response.json())
                .then(result => {
                    if (result.status === 'success') {
                        showAlert(registrationAlert, 'Student Registered Successfully!', 'success');
                        registrationForm.reset();
                    } else {
                        showAlert(registrationAlert, 'Error: ' + result.message, 'error');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    showAlert(registrationAlert, 'An unexpected error occurred.', 'error');
                })
                .finally(() => {
                    registrationLoadingIndicator.style.display = 'none'; // Loading indicator hide
                });
        });

        // --- Student Fee Entry Logic ---
        const feeEntryForm = document.getElementById('feeEntryForm');
        const studentNameInput = document.getElementById('studentName');
        const nameAutocompleteList = document.getElementById('nameAutocompleteList');
        const monthlyFeeDisplay = document.getElementById('monthlyFeeDisplay');
        const feeSummary = document.getElementById('feeSummary');
        const feeEntryAlert = document.getElementById('feeEntryAlert');
        const paidAmountInput = document.getElementById('paidAmount');
        const monthlyFeeInput = document.getElementById('monthlyFee');
        const statusInput = document.getElementById('status');
        const dateInput = document.getElementById('date');
        const feeEntryLoadingIndicator = document.getElementById('feeEntryLoadingIndicator');
        const submitFeeBtn = document.getElementById('submitFeeBtn');

        setupAutocomplete('studentName', 'nameAutocompleteList', getStudentData);

        async function getStudentData(name) {
            feeEntryLoadingIndicator.style.display = 'flex'; // Loading indicator show
            try {
                const response = await fetch(SCRIPT_URL + `?action=getStudentData&name=${encodeURIComponent(name)}`);
                const student = await response.json();

                if (student) {
                    document.getElementById('studentClass').value = student.class;
                    document.getElementById('studentAdmissionDate').value = student.admissionDate;

                    // Store the monthly fee and set the input field
                    currentMonthlyFee = parseFloat(student.monthlyFee) || 0;
                    document.getElementById('monthlyFee').value = currentMonthlyFee;
                    monthlyFeeDisplay.textContent = `Monthly Fee: ${currentMonthlyFee}`;

                    updateFeeSummary(student);
                } else {
                    // Handle case where student is not found
                    showAlert(feeEntryAlert, 'Student not found.', 'error');
                    feeSummary.style.display = 'none';
                    monthlyFeeDisplay.textContent = '';
                }
            } catch (error) {
                console.error('Error fetching student data:', error);
                showAlert(feeEntryAlert, 'Error fetching student data.', 'error');
            } finally {
                feeEntryLoadingIndicator.style.display = 'none'; // Loading indicator hide
            }
        }

        function updateFeeSummary(student) {
            const totalMonths = student.monthsPresent;
            const totalFeeOwed = totalMonths * student.monthlyFee;
            const totalFeePaid = student.totalFeePaid;
            const remainingBalance = totalFeeOwed - totalFeePaid;

            document.getElementById('summaryTotalMonths').textContent = totalMonths;
            document.getElementById('summaryTotalOwed').textContent = totalFeeOwed;
            document.getElementById('summaryTotalPaid').textContent = totalFeePaid;
            document.getElementById('summaryRemainingBalance').textContent = remainingBalance;

            feeSummary.style.display = 'block';
        }

        paidAmountInput.addEventListener('input', () => {
            const paid = parseFloat(paidAmountInput.value);
            const monthly = currentMonthlyFee; // Use the stored global variable
            if (paid >= monthly) {
                statusInput.value = 'Paid';
            } else if (paid > 0 && paid < monthly) {
                statusInput.value = 'Half Paid';
            } else {
                statusInput.value = 'Not Paid';
            }
        });

        feeEntryForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Show button loading state
            submitFeeBtn.textContent = 'Submitting...';
            submitFeeBtn.classList.add('button-loading');
            const spinner = document.createElement('span');
            spinner.className = 'spinner-small';
            submitFeeBtn.appendChild(spinner);
            submitFeeBtn.disabled = true;

            const selectedMonth = document.getElementById('monthSelectEntry').value;

            // Re-calculate status and ensure monthly fee is correct before submitting
            const paid = parseFloat(paidAmountInput.value);
            const monthly = currentMonthlyFee;
            let finalStatus;
            if (paid >= monthly) {
                finalStatus = 'Paid';
                paidAmountInput.value = monthly; // Ensure paid amount doesn't exceed monthly fee
            } else if (paid > 0 && paid < monthly) {
                finalStatus = 'Half Paid';
            } else {
                finalStatus = 'Not Paid';
            }

            const data = {
                name: studentNameInput.value,
                class: document.getElementById('studentClass').value,
                date: dateInput.value, // date field ko wahan rehne den jahan woh hai
                monthlyFee: monthly,
                paidAmount: paidAmountInput.value,
                status: finalStatus,
                month: selectedMonth // Naya month field add karen
            };

            fetch(SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify({ action: 'submitFee', data: data }),
                headers: { 'Content-Type': 'text/plain' }
            })
                .then(response => response.json())
                .then(result => {
                    if (result.status === 'success') {
                        showAlert(feeEntryAlert, 'Fee Submitted Successfully!', 'success');
                        feeEntryForm.reset();
                        monthlyFeeDisplay.textContent = '';
                        feeSummary.style.display = 'none';
                        currentMonthlyFee = 0; // Reset the global variable


                        // ✅ Show Receipt Modal (instead of auto PDF)
                        receiptData = data; // store current transaction globally
                        document.getElementById("receiptModal").style.display = "flex";

                    } else {
                        showAlert(feeEntryAlert, 'Error: ' + result.message, 'error');
                    }
                })


                .catch(error => {
                    console.error('Error:', error);
                    showAlert(feeEntryAlert, 'An unexpected error occurred.', 'error');
                })
                .finally(() => {
                    // Hide button loading state
                    submitFeeBtn.textContent = 'Submit Fee';
                    submitFeeBtn.classList.remove('button-loading');
                    submitFeeBtn.disabled = false;
                });
        });

        // --- Student Dropout Logic ---
        const withdrawnForm = document.getElementById('withdrawnForm');
        const withdrawnAlert = document.getElementById('dropoutAlert');
        const dropoutLoadingIndicator = document.getElementById('dropoutLoadingIndicator');

        setupAutocomplete('withdrawnName', 'withdrawnAutocompleteList');

        withdrawnForm.addEventListener('submit', (e) => {
            e.preventDefault();
            dropoutLoadingIndicator.style.display = 'flex'; // Loading indicator show
            const data = {
                name: document.getElementById('withdrawnName').value,
                withdrawnDate: document.getElementById('withdrawnDate').value
            };

            fetch(SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify({ action: 'markWithdrawn', data: data }),
                headers: { 'Content-Type': 'text/plain' }
            })
                .then(response => response.json())
                .then(result => {
                    if (result.status === 'success') {
                        showAlert(withdrawnAlert, 'Student marked as dropout successfully!', 'success');
                        withdrawnForm.reset();
                    } else {
                        showAlert(withdrawnAlert, 'Error: ' + result.message, 'error');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    showAlert(withdrawnAlert, 'An unexpected error occurred.', 'error');
                })
                .finally(() => {
                    dropoutLoadingIndicator.style.display = 'none'; // Loading indicator hide
                });
        });

        // --- Student Statement Logic ---
        async function getAllStudentsForStatement() {
            await getAllStudents();
            setupAutocomplete('searchName', 'searchAutocompleteList', getStatement);
        }

        async function getStatement() {
            const name = document.getElementById('searchName').value.trim();
            const statementArea = document.getElementById('statementArea');
            const statementLoadingIndicator = document.getElementById('statementLoadingIndicator');

            if (!name) {
                showAlert(document.getElementById('statementAlert'), 'Please enter a student name.', 'error');
                return;
            }

            statementLoadingIndicator.style.display = 'flex'; // Loading indicator show
            statementArea.innerHTML = ''; // Clear previous content

            try {
                const response = await fetch(SCRIPT_URL + `?action=getStatement&name=${encodeURIComponent(name)}`);
                const data = await response.json();

                if (data.status === 'error' || data.records.length === 0) {
                    statementArea.innerHTML = '<p>No record found for this student.</p>';
                    showAlert(document.getElementById('statementAlert'), 'No record found.', 'error');
                    return;
                }

                let totalPaid = 0;
                let totalMonthlyFee = 0;

                const tableRows = data.records.map(r => {
                    const rowData = [r.month, r.name, r.class, r.date, r.monthlyFee, r.paidAmount, r.status];
                    totalPaid += parseFloat(r.paidAmount || 0);
                    totalMonthlyFee += parseFloat(r.monthlyFee || 0);
                    return `<tr>
                                <td>${r.month}</td>
                                <td>${r.name}</td>
                                <td>${r.class}</td>
                                <td>${r.date}</td>
                                <td>${r.monthlyFee}</td>
                                <td>${r.paidAmount}</td>
                                <td>${r.status}</td>
                            </tr>`;
                }).join('');

                const remainingBalance = totalMonthlyFee - totalPaid;

                statementArea.innerHTML = `
                    <h3>Statement of Account for ${name}</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Month</th>
                                <th>Name</th>
                                <th>Class</th>
                                <th>Date</th>
                                <th>Monthly Fee</th>
                                <th>Paid Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRows}
                        </tbody>
                    </table>
                    <hr>
                    <p><strong>Total Fee Owed:</strong> ${totalMonthlyFee}</p>
                    <p><strong>Total Fee Paid:</strong> ${totalPaid}</p>
                    <p><strong>Remaining Balance:</strong> ${remainingBalance}</p>
                    <button class="print-btn" onclick="window.print()">Print Statement</button>
                `;
            } catch (error) {
                console.error('Error generating statement:', error);
                statementArea.innerHTML = '<p>Failed to load statement. Please try again later.</p>';
                showAlert(document.getElementById('statementAlert'), 'An unexpected error occurred.', 'error');
            } finally {
                statementLoadingIndicator.style.display = 'none'; // Loading indicator hide
            }
        }



        // --- NEW: Edit Fee Logic ---
        async function getAllStudentsForEditFee() {
            await getAllStudents();
            setupAutocomplete('editFeeStudentName', 'editFeeStudentNameAutocomplete', getEditFeeDetails);
        }

        async function populateEditFeeMonthDropdown() {
            try {
                const response = await fetch(SCRIPT_URL + '?action=getMonths');
                const months = await response.json();
                const select = document.getElementById('editFeeMonth');
                select.innerHTML = '<option value="">Select a Month</option>';
                months.forEach(month => {
                    select.innerHTML += `<option value="${month}">${month}</option>`;
                });
            } catch (error) {
                console.error('Error fetching months:', error);
            }
        }

        async function getEditFeeDetails(name) {
            const month = document.getElementById('editFeeMonth').value;
            const editFeeDetailsSection = document.getElementById('editFeeDetailsSection');
            const editFeeLoadingIndicator = document.getElementById('editFeeLoadingIndicator');
            editFeeDetailsSection.style.display = 'none';

            if (!month) {
                showAlert(document.getElementById('editFeeAlert'), 'Please select a month.', 'error');
                return;
            }

            editFeeLoadingIndicator.style.display = 'flex';

            try {
                const response = await fetch(SCRIPT_URL + `?action=getStatement&name=${encodeURIComponent(name)}`);
                const result = await response.json();

                if (result.status === 'success') {
                    const monthlyRecord = result.records.find(rec => rec.month === month);
                    if (monthlyRecord) {
                        document.getElementById('editFeePaidAmount').value = monthlyRecord.paidAmount;
                        document.getElementById('editFeeStatus').value = monthlyRecord.status;
                        editFeeDetailsSection.style.display = 'block';
                        showAlert(document.getElementById('editFeeAlert'), 'Fee record loaded. You can now edit.', 'success');
                    } else {
                        showAlert(document.getElementById('editFeeAlert'), 'No fee record found for this student in the selected month.', 'error');
                    }
                } else {
                    showAlert(document.getElementById('editFeeAlert'), 'No fee records found for this student.', 'error');
                }
            } catch (error) {
                console.error('Error fetching fee details:', error);
                showAlert(document.getElementById('editFeeAlert'), 'Error fetching fee details.', 'error');
            } finally {
                editFeeLoadingIndicator.style.display = 'none';
            }
        }

        document.getElementById('editFeeMonth').addEventListener('change', () => {
            const studentName = document.getElementById('editFeeStudentName').value;
            if (studentName) {
                getEditFeeDetails(studentName);
            }
        });

        const editFeeForm = document.getElementById('editFeeForm');
        editFeeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const saveFeeEditBtn = document.getElementById('saveFeeEditBtn');
            saveFeeEditBtn.textContent = 'Saving...';
            saveFeeEditBtn.classList.add('button-loading');
            saveFeeEditBtn.disabled = true;

            const data = {
                name: document.getElementById('editFeeStudentName').value,
                month: document.getElementById('editFeeMonth').value,
                paidAmount: document.getElementById('editFeePaidAmount').value,
                status: document.getElementById('editFeeStatus').value
            };

            fetch(SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify({ action: "editFeeDetails", data: data }),
                headers: { 'Content-Type': 'text/plain' }
            })
                .then(response => response.json())
                .then(result => {
                    if (result.status === 'success') {
                        showAlert(document.getElementById('editFeeAlert'), result.message || 'Fee details updated successfully!', 'success');
                    } else {
                        showAlert(document.getElementById('editFeeAlert'), 'Error: ' + result.message, 'error');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    showAlert(document.getElementById('editFeeAlert'), 'An unexpected error occurred.', 'error');
                })
                .finally(() => {
                    saveFeeEditBtn.textContent = 'Save Changes';
                    saveFeeEditBtn.classList.remove('button-loading');
                    saveFeeEditBtn.disabled = false;
                });
        });



        async function getAllStudentsForEdit() {
            await getAllStudents();
            setupAutocomplete('editName', 'editAutocompleteList', showEditDetails);
        }

        async function showEditDetails(name) {
            const editDetailsDiv = document.getElementById('editDetails');
            const editLoadingIndicator = document.getElementById('editLoadingIndicator');
            editDetailsDiv.style.display = 'none';
            editLoadingIndicator.style.display = 'flex';

            try {
                const response = await fetch(SCRIPT_URL + `?action=getStudentData&name=${encodeURIComponent(name)}`);
                const student = await response.json();

                if (student) {
                    document.getElementById('editClass').value = student.class;
                    document.getElementById('editMonthlyFee').value = student.monthlyFee;
                    document.getElementById('editStatus').value = student.status;

                    const dropoutDateGroup = document.getElementById('editDropoutDateGroup');
                    if (student.status === 'Inactive') {
                        dropoutDateGroup.style.display = 'block';
                        document.getElementById('editDropoutDate').value = student.withdrawnDate;
                    } else {
                        dropoutDateGroup.style.display = 'none';
                        document.getElementById('editDropoutDate').value = '';
                    }

                    editDetailsDiv.style.display = 'block';
                } else {
                    showAlert(document.getElementById('editAlert'), 'Student not found.', 'error');
                }
            } catch (error) {
                console.error('Error fetching student data:', error);
                showAlert(document.getElementById('editAlert'), 'Error fetching student data.', 'error');
            } finally {
                editLoadingIndicator.style.display = 'none';
            }
        }

        // Status dropdown change event listener
        document.getElementById('editStatus').addEventListener('change', (e) => {
            const dropoutDateGroup = document.getElementById('editDropoutDateGroup');
            if (e.target.value === 'Inactive') {
                dropoutDateGroup.style.display = 'block';
            } else {
                dropoutDateGroup.style.display = 'none';
            }
        });

        // Edit form submission logic
        const editForm = document.getElementById('editForm');
        editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const saveEditBtn = document.getElementById('saveEditBtn');
            saveEditBtn.textContent = 'Saving...';
            saveEditBtn.classList.add('button-loading');
            saveEditBtn.disabled = true;

            const originalName = document.getElementById('editName').value;
            const updatedData = {
                name: originalName,
                class: document.getElementById('editClass').value,
                monthlyFee: document.getElementById('editMonthlyFee').value,
                status: document.getElementById('editStatus').value,
                withdrawnDate: document.getElementById('editStatus').value === 'Inactive' ? document.getElementById('editDropoutDate').value : ''
            };

            fetch(SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify({ action: 'updateStudentDetails', data: updatedData }),
                headers: { 'Content-Type': 'text/plain' }
            })
                .then(response => response.json())
                .then(result => {
                    if (result.status === 'success') {
                        showAlert(document.getElementById('editAlert'), 'Student details updated successfully!', 'success');
                    } else {
                        showAlert(document.getElementById('editAlert'), 'Error: ' + result.message, 'error');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    showAlert(document.getElementById('editAlert'), 'An unexpected error occurred.', 'error');
                })
                .finally(() => {
                    saveEditBtn.textContent = 'Save Changes';
                    saveEditBtn.classList.remove('button-loading');
                    saveEditBtn.disabled = false;
                });
        });

        // Search by class ke liye dashboard logic
        searchInput.addEventListener('input', applyFilters); // Already exists



        // --- Utility function for alerts ---
        function showAlert(element, message, type) {
            element.textContent = message;
            element.className = `alert-message alert-${type}`;
            element.style.display = 'block';
            setTimeout(() => {
                element.style.display = 'none';
            }, 5000);
        }

        // --- Dashboard Scripts (New) ---
        const rs = (n) => n.toLocaleString(undefined, { maximumFractionDigits: 0 });
        const money = (n) => n.toLocaleString(undefined, { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 });
        const toDate = (v) => {
            if (!v) return '';
            const d = new Date(v);
            return isNaN(d) ? String(v) : d.toISOString().slice(0, 10);
        };
        const dashboardLoadingIndicator = document.getElementById('dashboardLoadingIndicator');


        async function initDashboard() {
            dashboardLoadingIndicator.style.display = 'flex';
            try {
                // Fetch all data instead of just for the current month
                const url = SCRIPT_URL + '?action=getAllData';
                const response = await fetch(url);
                const data = await response.json();
                allRows = data;
                buildMonthOptions(allRows);
                applyFilters();
            } catch (e) {
                console.error(e);
                info.textContent = 'Failed to load data. Please check sharing permissions.';
            } finally {
                dashboardLoadingIndicator.style.display = 'none';
            }

            monthSelect.addEventListener('change', applyFilters);
            statusSelect.addEventListener('change', applyFilters);
            searchInput.addEventListener('input', applyFilters);
        }


        function buildMonthOptions(rows) {
            const months = Array.from(new Set(rows.map(r => r[0]))).filter(Boolean);
            months.sort((a, b) => {
                const dateA = new Date(`1 ${a}`);
                const dateB = new Date(`1 ${b}`);
                return dateA - dateB;
            });

            const currentMonth = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });

            let optionsHtml = '<option value="">All Months</option>';
            optionsHtml += months.map(m => `<option value="${m}" ${m === currentMonth ? 'selected' : ''}>${m}</option>`).join('');
            monthSelect.innerHTML = optionsHtml;
        }

        function applyFilters() {
            const m = monthSelect.value.trim();
            const s = statusSelect.value.trim().toLowerCase();
            const q = searchInput.value.trim().toLowerCase();

            // Filter logic based on the selected month, status, and search query
            filtered = allRows.filter(r => {
                const matchM = !m || (r[0] === m);
                const matchS = !s || (r[6] || '').toLowerCase() === s;
                const matchQ = !q || (r[1] + ' ' + r[2]).toLowerCase().includes(q);
                return matchM && matchS && matchQ;
            });

            renderTable(filtered);
            renderKPIs(filtered);
            renderCharts(allRows, filtered);
        }

        function renderTable(rows) {
            tbody.innerHTML = rows.map(r => `
                <tr>
                    <td>${r[0]}</td>
                    <td>${r[1]}</td>
                    <td>${r[2]}</td>
                    <td>${r[3]}</td>
                    <td class="right">${r[4] === 0 ? '-' : rs(r[4])}</td>
                    <td class="right">${r[5] === 0 ? '-' : rs(r[5])}</td>
                    <td>${r[6]}</td>
                </tr>`).join('');
            info.textContent = `${rows.length} record(s)`;
        }

        function renderKPIs(rows) {
            const uniqStudents = new Set(rows.map(r => (r[1] + '|' + r[2]))).size;
            const totalPaid = rows.reduce((a, r) => a + (Number(r[5]) || 0), 0);
            const totalDue = rows.reduce((a, r) => a + Math.max(0, (Number(r[4]) || 0) - (Number(r[5]) || 0)), 0);
            const paidRows = rows.filter(r => (r[6] || '').toLowerCase() === 'paid').length;
            const paidRate = rows.length ? Math.round((paidRows / rows.length) * 100) : 0;
            document.getElementById('kpiStudents').textContent = rs(uniqStudents);
            document.getElementById('kpiCollected').textContent = money(totalPaid);
            document.getElementById('kpiDue').textContent = money(totalDue);
            document.getElementById('kpiPaidRate').textContent = rs(paidRate) + '%';
        }

        function renderCharts(all, rows) {
            const months = Array.from(new Set(all.map(r => r[0]))).filter(Boolean);
            months.sort((a, b) => new Date('1 ' + a) - new Date('1 ' + b));
            const sumByMonth = Object.fromEntries(months.map(m => [m, 0]));
            rows.forEach(r => sumByMonth[r[0]] = (sumByMonth[r[0]] || 0) + (Number(r[5]) || 0));
            const barData = months.map(m => sumByMonth[m] || 0);
            if (barChart) barChart.destroy();
            barChart = new Chart(document.getElementById('barMonthly'), {
                type: 'bar',
                data: { labels: months, datasets: [{ label: 'Paid Amount (PKR)', data: barData }] },
                options: { responsive: true, plugins: { legend: { display: true } }, scales: { y: { beginAtZero: true } } }
            });
            const statuses = ['Paid', 'Half Paid', 'Not Paid', 'Inactive'];
            const statusData = {};
            statuses.forEach(status => {
                statusData[status] = months.map(m => rows.filter(r => r[0] === m && (r[6] || '').toLowerCase() === status.toLowerCase()).length);
            });
            if (lineChart) lineChart.destroy();
            lineChart = new Chart(document.getElementById('lineStatus'), {
                type: 'line',
                data: {
                    labels: months,
                    datasets: statuses.map((status, i) => ({
                        label: status,
                        data: statusData[status],
                        borderColor: ['#4CAF50', '#FFC107', '#f44336', '#9E9E9E'][i],
                        tension: 0.1
                    }))
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { display: true }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }

        function exportToPdfDashboard() {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            doc.autoTable({ html: '#dataTable' });
            doc.save('Transactions Report.pdf');
        }

        function exportToExcelDashboard() {
            const table = document.getElementById('dataTable');
            const ws = XLSX.utils.table_to_sheet(table);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Transactions Report");
            XLSX.writeFile(wb, "Transactions Report.csv");
        }

        function sendWhatsappReport() {
            exportToPdfDashboard(); // This will download the PDF

            const number = '920000000000'; // Replace with the actual WhatsApp number
            const message = encodeURIComponent(`Your Message Goes Here.`);

            const whatsappUrl = `https://wa.me/${number}?text=${message}`;
            window.open(whatsappUrl, '_blank');
        }


        function populateMonthDropdown() {
            const monthSelect = document.getElementById('monthSelectEntry');
            const now = new Date();
            const currentYear = now.getFullYear();
            const currentMonth = now.getMonth();

            monthSelect.innerHTML = ''; // Clear existing options

            for (let i = 0; i < 12; i++) {
                const date = new Date(currentYear, i, 1);
                const monthText = date.toLocaleString('default', { month: 'long', year: 'numeric' });
                const option = document.createElement('option');
                option.value = monthText;
                option.textContent = monthText;

                // Optionally, select the current month
                if (i === currentMonth) {
                    option.selected = true;
                }

                monthSelect.appendChild(option);
            }
        }


        // ===== Receipt and Download option =====
    document.addEventListener('contextmenu', event => event.preventDefault());


    document.addEventListener('keydown', function (event) {

        if (event.key === 'F12') {
            event.preventDefault();
        }

        if (event.ctrlKey && event.shiftKey && event.key === 'I') {
            event.preventDefault();
        }

        if (event.ctrlKey && event.shiftKey && event.key === 'J') {
            event.preventDefault();
        }

        if (event.ctrlKey && event.key === 'U') {
            event.preventDefault();
        }
    });



    function generateReceiptPDF(data) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // ===== Header =====
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text("Fee Receipt", 105, 20, { align: "center" });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.text("Your School / Institute Name", 105, 28, { align: "center" });
        doc.text("Address Line, City, Contact No.", 105, 34, { align: "center" });
        doc.text("Email: school@email.com", 105, 40, { align: "center" });

        // ===== Student Info =====
        const today = new Date().toLocaleDateString();
        doc.setFontSize(12);
        doc.text(`Receipt No: ${Math.floor(Math.random() * 90000 + 10000)}`, 150, 55);
        doc.text(`Date: ${today}`, 150, 62);

        doc.text(`Student Name: ${data.name}`, 15, 70);
        doc.text(`Class: ${data.class}`, 15, 78);
        doc.text(`Month: ${data.month}`, 15, 86);

        // ===== Status Color Coding =====
        let statusColor = [0, 0, 0];
        if (data.status === "Paid") statusColor = [0, 150, 0];      // Green
        else if (data.status === "Half Paid") statusColor = [255, 140, 0]; // Orange
        else if (data.status === "Not Paid") statusColor = [200, 0, 0]; // Red
        else if (data.status === "Extra Paid") statusColor = [0, 100, 255]; // Blue

        // ===== Fee Table =====
        doc.autoTable({
            startY: 95,
            head: [['Description', 'Amount']],
            body: [
                ['Monthly Fee', data.monthlyFee],
                ['Paid Amount', data.paidAmount],
                ['Status', data.status]
            ],
            theme: 'grid',
            styles: { halign: 'center' },
            headStyles: { fillColor: [0, 150, 200], textColor: 255, fontStyle: 'bold' },
            didParseCell: function (hookData) {
                if (hookData.row.index === 2 && hookData.column.index === 1) {
                    hookData.cell.styles.textColor = statusColor;
                    hookData.cell.styles.fontStyle = 'bold';
                }
            }
        });

        // ===== Signatures =====
        const finalY = doc.lastAutoTable.finalY + 20;
        doc.line(20, finalY, 80, finalY);
        doc.text("Admin Signature", 25, finalY + 8);

        doc.line(130, finalY, 190, finalY);
        doc.text("Parent/Student", 140, finalY + 8);

        // ===== Footer =====
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("This is a computer-generated receipt. No signature is required if Mailed. Thank you!", 105, finalY + 30, { align: "center" });

        // Save
        doc.save(`Receipt_${data.name}_${data.month}.pdf`);

        // Auto-close modal after saving
        closeReceiptModal();
    }
