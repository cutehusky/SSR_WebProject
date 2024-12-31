$(document).ready(function () {
    $('#myTable').DataTable({
        responsive: true,
        searching: false,
        lengthChange: false,
        paging: false,
        ordering: false,
        columnDefs: [
            {
                width: '30%',
                targets: 1,
            }
        ]
    });
});