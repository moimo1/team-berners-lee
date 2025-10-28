<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My PHP Project</title>
</head>
<body>

<form method="POST" action="/controller/login.php">
  <h2>Login</h2>
  <input type="text" name="email" placeholder="Email" required>
  <input type="password" name="password" placeholder="Password" required>
  
  <select name="role" required>
    <option value="client">Client</option>
    <option value="doctor">Doctor</option>
    <option value="pharma">Pharmacist</option>
    <option value="admin">Admin</option>
  </select>

  <button type="submit">Login</button>
</form>


</body>
</html>
