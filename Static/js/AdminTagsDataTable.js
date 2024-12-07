$(document).ready(function () {
    $('#myTable').DataTable({
        responsive: true,
        searching: false,
        lengthChange: false,
        columnDefs: [
            {
                width: '30%',
                targets: 1,
                orderable: false,
            }
        ]
    });
});