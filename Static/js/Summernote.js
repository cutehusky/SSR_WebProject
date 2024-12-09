$(document).ready(function () {
    $('#summernote').summernote({
        placeholder: '',
        tabsize: 2,
        height: 100,
        toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'italic', 'underline', 'clear']],
            ['fontname', ['fontname']],
            ['fontsize', ['fontsize']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            // ['table', ['table']],
            ['insert', ['link', 'picture', 'video']],
            ['view', ['codeview', 'help']],
        ],
    });

    // // Fix Bootstrap dropdowns inside Summernote
    // $(document).on('click', '.dropdown-toggle', function (e) {
    //     $(this).next('.dropdown-menu').toggleClass('show');
    // });

    // // Hide the dropdown menu when an item is clicked
    // $(document).on('click', '.dropdown-item', function (e) {
    //     // Hide the dropdown
    //     $(this).closest('.dropdown-menu').removeClass('show');
    // });

    // // Hide the dropdown menu when a button inside the dropdown is clicked
    // $(document).on('click', '.dropdown-menu button', function (e) {
    //     $(this).closest('.dropdown-menu').removeClass('show');
    // });

    // $(document).on('click', '.note-color-btn', function (e) {
    //     alert('abc');
    //     $(this).closest('.dropdown-menu').removeClass('show');
    // });
});
