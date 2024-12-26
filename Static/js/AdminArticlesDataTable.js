$(document).ready(function () {
    $('#myTable').DataTable({
        responsive: true,
        searching: false,
        lengthChange: false,
        paging: false,
        columnDefs: [
            {
                targets: 5,
                orderable: false,
            },
        ],
    });
    $('#editorPendingTable').DataTable({
        responsive: true,
        searching: false,
        paging: false,
        lengthChange: false,
        columnDefs: [
            {
                targets: 4,
                orderable: false,
            },
        ],
    });
});
