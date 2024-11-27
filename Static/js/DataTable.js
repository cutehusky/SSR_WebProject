$(document).ready(function () {
    $('#myTable').DataTable({
        responsive: true,
        columnDefs: [
            {
                targets: 4,
                orderable: false,
            }
        ]
    });
});