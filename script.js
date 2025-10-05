const form = document.getElementById('insuranceForm');
const tableBody = document.querySelector('#recordsTable tbody');

// Load saved records from LocalStorage
let records = JSON.parse(localStorage.getItem('insuranceRecords')) || [];

// Function to render table
function renderTable() {
    tableBody.innerHTML = '';
    records.forEach((record, index) => {
        const tr = document.createElement('tr');
        const attachmentLinks = record.attachments.map(att => `<a href="${att.url}" target="_blank">${att.name}</a>`);
        tr.innerHTML = `
            <td>${record.customerName}</td>
            <td>${record.vehicleNumber}</td>
            <td>${record.policyCompany}</td>
            <td>${record.premium}</td>
            <td>${record.commission}</td>
            <td>${record.expiryDate}</td>
            <td>${attachmentLinks.join('<br>')}</td>
            <td>
                <button class="edit">Edit</button>
                <button class="delete">Delete</button>
            </td>
        `;

        tableBody.appendChild(tr);

        // Check expiry and highlight
        checkExpiry(record.expiryDate, tr);

        // Delete
        tr.querySelector('.delete').addEventListener('click', () => {
            records.splice(index, 1);
            saveRecords();
            renderTable();
        });

        // Edit
        tr.querySelector('.edit').addEventListener('click', () => {
            document.getElementById('customerName').value = record.customerName;
            document.getElementById('vehicleNumber').value = record.vehicleNumber;
            document.getElementById('policyCompany').value = record.policyCompany;
            document.getElementById('premium').value = record.premium;
            document.getElementById('commission').value = record.commission;
            document.getElementById('expiryDate').value = record.expiryDate;
            records.splice(index, 1);
            saveRecords();
            renderTable();
        });
    });
}

// Save records to LocalStorage
function saveRecords() {
    localStorage.setItem('insuranceRecords', JSON.stringify(records));
}

// Check expiry and highlight
function checkExpiry(expiryDate, tr) {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 7 && diffDays >= 0) {
        tr.style.backgroundColor = '#ffe0e0'; // light red for upcoming expiry
        tr.title = 'Policy expiring soon!';
        // Uncomment next line if you want an alert every reload
        // alert(`Reminder: Policy is expiring in ${diffDays} day(s)!`);
    } else if (diffDays < 0) {
        tr.style.backgroundColor = '#ffcccc'; // expired
        tr.title = 'Policy expired!';
    } else {
        tr.style.backgroundColor = '';
        tr.title = '';
    }
}

// Add new record
form.addEventListener('submit', function(e) {
    e.preventDefault();

    const customerName = document.getElementById('customerName').value;
    const vehicleNumber = document.getElementById('vehicleNumber').value;
    const policyCompany = document.getElementById('policyCompany').value;
    const premium = document.getElementById('premium').value;
    const commission = document.getElementById('commission').value;
    const expiryDate = document.getElementById('expiryDate').value;
    const attachments = document.getElementById('attachments').files;

    const attachmentFiles = [];
    for (let i = 0; i < attachments.length; i++) {
        const fileURL = URL.createObjectURL(attachments[i]);
        attachmentFiles.push({ name: attachments[i].name, url: fileURL });
    }

    const newRecord = {
        customerName,
        vehicleNumber,
        policyCompany,
        premium,
        commission,
        expiryDate,
        attachments: attachmentFiles
    };

    records.push(newRecord);
    saveRecords();
    renderTable();
    form.reset();
});

// Initial render
renderTable();
