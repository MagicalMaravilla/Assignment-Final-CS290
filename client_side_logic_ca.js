document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('create-account-form');
    const usernameInput = document.getElementById('new-username');
    const emailInput = document.getElementById('new-email');
    const passwordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');

    // Function to validate the password against specified criteria
    function isValidPassword(password) {
        // Regular expression to check for password strength
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?=.{8,})/;
        return regex.test(password);
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior

        // Check if the passwords match
        if (passwordInput.value !== confirmPasswordInput.value) {
            alert('Passwords do not match.');
            return; // Stop form submission and provide feedback
        }

        // Validate the password strength
        if (!isValidPassword(passwordInput.value)) {
            alert('Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*).');
            return; // Stop form submission and provide feedback
        }

        const formData = {
            username: usernameInput.value,
            email: emailInput.value,
            password: passwordInput.value,
        };

        try {
            const response = await fetch('/create-account', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                // Account creation successful
                window.location.href = 'signin.html'; // Redirect to sign-in
            } else {
                // Handle server errors (e.g., user already exists)
                const data = await response.text();
                alert(data);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while creating your account. Please try again.');
        }
    });
});
