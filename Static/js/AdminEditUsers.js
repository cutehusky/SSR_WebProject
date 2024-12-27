const roles = document.querySelectorAll('.role_selectors');

roles.forEach(role => {
    role.addEventListener('change', () => {
        const roleValue = role.value;
        const categorySection = role.parentElement.nextElementSibling;

        if (roleValue === 'editor') {
            categorySection.classList.remove('d-none');
        } else {
            categorySection.classList.add('d-none');
        }
    });
});
