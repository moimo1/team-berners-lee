<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="../assets/css/auth/login.css">
</head>
<body>
    <div class="wrapper">
        <div class="card">
            <div class="logo">MediTrack </div>
            <p class="subtitle">Please sign in to continue</p>

            <?php if (!empty($_GET['error'])): ?>
                <div class="error"><?php echo htmlspecialchars($_GET['error']); ?></div>
            <?php endif; ?>

            <form method="post" action="../controller/login.php" autocomplete="on">
                <div class="field">
                    <label for="username">Email or username</label>
                    <input type="text" id="username" name="username" placeholder="Enter email or username" required />
                </div>
                <div class="field">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" placeholder="Enter password" required />
                </div>
                <div class="actions">
                    <button type="submit" class="btn btn-primary">Login</button>
                    <a class="btn btn-secondary" href="#">Sign up</a>
                </div>
                <div class="muted">Forgot password? <a href="#">Reset</a></div>
            </form>
        </div>
    </div>
</body>
</html>

