const modalHeaders = document.querySelectorAll('.modal-header-config-title');

modalHeaders.forEach(header => {
    header.addEventListener('click', () => {
        modalHeaders.forEach(sibling => {
            if (sibling !== header && sibling.classList.contains('is-active')) {
                sibling.classList.remove('is-active');
            }
        });
        header.classList.add('is-active');

        document.querySelectorAll('.authentication-section').forEach(item => {
            if (!item.classList.contains('d-none')) {
                item.classList.add('d-none');
            }
        });

        // Show the targeted form
        const target = document.getElementById(
            header.getAttribute('data-target')
        );
        target.classList.remove('d-none');
    });
});

// If user already has account
const isRegistered = document.querySelector('.is-registered');

isRegistered.addEventListener('click', () => {
    const signin = document.getElementById('sign-in-section');
    const signup = document.getElementById('sign-up-section');

    if (signin.classList.contains('d-none')) {
        signin.classList.remove('d-none');
        signup.classList.add('d-none');

        const headers = document.querySelectorAll('.modal-header-config-title');
        headers.forEach(header => {
            header.classList.remove('is-active');

            if (header.getAttribute('data-target') === 'sign-in-section') {
                header.classList.add('is-active');
            }
        });
    }
});

// Email Regex
function validEmail(e) {
    const patt = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return patt.test(e);
}

// Fullname Regex
function validateFullname(fullname) {
    // Regex: Tên chỉ bao gồm chữ cái, dấu cách, và độ dài từ 3-50 ký tự
    const fullnameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỵỷỹ ]{3,50}$/u;

    if (fullnameRegex.test(fullname)) {
        return true; // Hợp lệ
    } else {
        return false; // Không hợp lệ
    }
}
// Submit Sign Up form

document.addEventListener('DOMContentLoaded', () => {
    const signUpForm = $('.sign-up-form');

    signUpForm.on('submit', event => {
        event.preventDefault();

        const email = $('#sign-up-form-email').val();
        const fullName = $('#sign-up-form-username').val();
        const password = $('#sign-up-form-password').val();
        const confirmPassword = $('#sign-up-form-confirm-password').val();
        const gRecaptchaResponse = grecaptcha.getResponse();

        if (!validEmail(email)) {
            Swal.fire({
                icon: 'error',
                title: 'Email không hợp lệ!',
                text: 'Vui lòng nhập một địa chỉ email hợp lệ (ví dụ: user@example.com).',
            });
            return;
        }

        if (!validateFullname(fullName)) {
            Swal.fire({
                icon: 'error',
                title: 'Fullname không hợp lệ!',
                text: 'Fullname chỉ bao gồm chữ cái, dấu cách, và độ dài từ 3-50 ký tự',
            });
            return;
        }

        if (password !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Mật khẩu không khớp!',
                text: 'Hãy đảm bảo mật khẩu và nhập lại mật khẩu khớp nhau.',
            });
            return;
        }

        if (password.length <= 5) {
            Swal.fire({
                icon: 'error',
                title: 'Mật khẩu quá ngắn!',
                text: 'Hãy đảm bảo mật khẩu có độ dài trên 5 ký tự.',
            });
            return;
        }

        if (localStorage.getItem('errorSignUp')) {
            localStorage.removeItem('errorSignUp');
        }

        $.ajax({
            url: '/user/register',
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
                email,
                password,
                fullname: username,
                'g-recaptcha-response': gRecaptchaResponse,
            }),
            success: function () {},
            error: function (jqXHR) {
                const error = jqXHR.responseJSON.error;
                const message = jqXHR.responseJSON.message;
                const notification = {
                    error,
                    message,
                };

                if (!localStorage.getItem('errorSignUp'))
                    localStorage.setItem(
                        'errorSignUp',
                        JSON.stringify(notification)
                    );
                window.location.replace('/');
            },
        });

        // signUpForm.off('submit').trigger('submit');
    });
});

// Submit Sign In form

document.addEventListener('DOMContentLoaded', () => {
    const signInForm = $('.sign-in-form');

    signInForm.on('submit', event => {
        event.preventDefault();

        const email = $('#sign-in-form-email').val();
        const password = $('#sign-in-form-password').val();

        if (localStorage.getItem('errorSignIn')) {
            localStorage.removeItem('errorSignIn');
        }

        $.ajax({
            url: '/user/login',
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
                email,
                password,
            }),
            success: function (response) {
                window.location.replace(response.successUrl);
            },
            error: function (jqXHR) {
                const error = jqXHR.responseJSON.error;
                const message = jqXHR.responseJSON.message;
                const notification = { error, message };

                if (!localStorage.getItem('errorSignIn'))
                    localStorage.setItem(
                        'errorSignIn',
                        JSON.stringify(notification)
                    );
                window.location.replace('/');
            },
        });
    });
});

// Check remove error

document.addEventListener('DOMContentLoaded', () => {
    const closeModalIcon = $('.close-modal-icon');

    closeModalIcon.on('click', () => {
        if (localStorage.getItem('errorSignIn')) {
            localStorage.removeItem('errorSignIn');

            $('.error-signin-notification').addClass('d-none');
        } else if (localStorage.getItem('errorSignUp')) {
            localStorage.removeItem('errorSignUp');

            $('.error-signup-notification').addClass('d-none');
        }
    });
});
