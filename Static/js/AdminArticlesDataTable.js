$(document).ready(function () {
    $('#myTable').DataTable({
        responsive: true,
        searching: false,
        lengthChange: false,
        columnDefs: [
            {
                targets: 5,
                orderable: false,
            }
        ]
    });
});