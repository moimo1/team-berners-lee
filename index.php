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

            <?php if (!empty($_GET['error'])): ?>
                <div class="error"><?php echo htmlspecialchars($_GET['error']); ?></div>
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
</body>
</html>

