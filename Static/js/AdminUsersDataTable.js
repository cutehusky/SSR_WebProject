$(document).ready(function () {
    $('#myTable').DataTable({
        responsive: true,
        searching: false,
        lengthChange: false,
        paging: false,
        columnDefs: [
            {
                targets: 4,
                orderable: false,
            }
        ]
    });
});