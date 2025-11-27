<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="assets/css/auth/login.css">
</head>
<body>
    <div class="wrapper">
        <div class="card">
            <div class="logo">
                <img src="assets/logo/meditrack-high-resolution-logo-grayscale-transparent.png" alt="MediTrack" class="logo-img">
            </div>
            <p class="subtitle">Please sign in to continue</p>

            <?php if (!empty($_GET['error']) && $_GET['error'] === 'invalid_credentials'): ?>
                <div id="error-message" class="error-box">
                    <span class="error-text">Incorrect username or password.</span>
                    <button type="button" class="error-dismiss" aria-label="Dismiss error" onclick="dismissError()">×</button>
                </div>
            <?php endif; ?>

            <?php if (!empty($_GET['success'])): ?>
                <div style="background: #d1fae5; border: 1px solid #a7f3d0; color: #065f46; padding: 8px 10px; border-radius: 6px; font-size: 13px; margin-bottom: 12px;">
                    <?php echo htmlspecialchars($_GET['success']); ?>
                </div>
            <?php endif; ?>

            <form method="post" action="controller/login.php" autocomplete="on">
                <div class="field">
                    <label for="email">Email <span class="required">*</span></label>
                    <input type="text" id="username" name="email" placeholder="Enter email" required />
                </div>
                <div class="field">
                    <label for="password">Password <span class="required">*</span></label>
                    <input type="password" id="password" name="password" placeholder="Enter password" required />
                </div>

                <div class="field">
                    <label for="role">Role <span class="required">*</span></label>
                    <select id="role" name="role" required>
                        <option value="">-- Select Role --</option>
                        <option value="client">Client</option>
                        <option value="doctor">Doctor</option>
                        <option value="pharma">Pharmacist</option>
                        <option value="pharma-admin">Pharmacist Admin</option>
                    </select>
                </div>
                
                <div class="actions">
                    <button type="submit" class="btn btn-primary">Login</button>
                    <a class="btn btn-secondary" href="view/SignUp.php">Sign up</a>
                </div>
                <div class="muted">Forgot password? <a href="#">Reset</a></div>
            </form>

        </div>
    </div>
    <script>
        function dismissError() {
            const errorBox = document.getElementById('error-message');
            if (errorBox) {
                errorBox.style.display = 'none';
                // Remove error parameter from URL without reloading
                const urlParams = new URLSearchParams(window.location.search);
                urlParams.delete('error');
                const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
                window.history.replaceState({}, document.title, newUrl);
            }
        }
    </script>
</body>
</html>

