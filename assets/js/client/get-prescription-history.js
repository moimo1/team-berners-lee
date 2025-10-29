document.addEventListener("DOMContentLoaded", () => {
    const table = document.getElementById("table-body");

    fetch("../../controller/get-prescription-history.php")
    .then(res => {
        return res.json();
    })
    .then(data => {
        data.forEach(item => {
            row = document.createElement("tr");
            
            date = document.createElement("td");
            date.innerHTML = `<p>${item.date}</p>`;
            row.appendChild(date);

            expDate = document.createElement("td");
            expDate.innerHTML = `<p>${item.expDate}</p>`;
            row.appendChild(expDate);

            doctor = document.createElement("td");
            doctor.innerHTML = `<p>${item.doctor}</p>`;
            row.appendChild(doctor);

            prescStatus = document.createElement("td");
            prescStatus.innerHTML = `<p>${item.status}</p>`;
            row.appendChild(prescStatus);

            table.appendChild(row);
        });
    });
})