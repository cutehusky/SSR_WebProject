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
    $('#myTable2').DataTable({
        responsive: true,
        searching: false,
        lengthChange: false,
        columnDefs: [
            {
                width: '20%',
                targets: 2,
                orderable: false,
            }
        ]
    });
});