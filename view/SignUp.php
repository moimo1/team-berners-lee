<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create Account - MediTrack</title>
    <link rel="stylesheet" href="../assets/css/auth/signup.css">
</head>
<body>
    <div class="signup-container">
        <?php
        // Role Selection
        if (!isset($_GET['role'])): 
        ?>
            <!-- Role Selection -->
            <div class="signup-card">
                <h1 class="main-title">SIGN IN ACCOUNT</h1>
                <h2 class="sub-title">Select User Type</h2>
                
                <div class="role-selection">
                    <div class="role-card" data-role="doctor">
                        <div class="role-icon">
                            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </div>
                        <p class="role-label">DOCTOR</p>
                    </div>
                    
                    <div class="role-card" data-role="pharmacist">
                        <div class="role-icon">
                            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </div>
                        <p class="role-label">PHARMACIST</p>
                    </div>
                    
                    <div class="role-card" data-role="client">
                        <div class="role-icon">
                            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </div>
                        <p class="role-label">CLIENT</p>
                    </div>
                </div>
                
                <div class="back-link">
                    <a href="../index.php">← Back to Login</a>
                </div>
            </div>

        <?php else: 
            $role = $_GET['role'];
            $isDoctor = $role === 'doctor';
            $isPharmacist = $role === 'pharmacist';
            $isClient = $role === 'client';
        ?>
            <!-- Account Creation Form -->
            <div class="signup-card account-form">
                <h1 class="main-title">CREATE ACCOUNT</h1>
                <h2 class="sub-title">Account Creation - <?php echo strtoupper($role); ?></h2>
                
                <?php if (!empty($_GET['error'])): ?>
                    <div class="error-message"><?php echo htmlspecialchars($_GET['error']); ?></div>
                <?php endif; ?>
                
                <form method="post" action="../controller/signup.php" enctype="multipart/form-data" class="signup-form">
                    <input type="hidden" name="role" value="<?php echo htmlspecialchars($role); ?>">
                    
                    <div class="form-layout">
                        <!-- Left Side: Profile Picture -->
                        <div class="profile-section">
                            <h3 class="section-title">CREATE ACCOUNT</h3>
                            <div class="profile-picture-container">
                                <div class="profile-picture-preview" id="profilePreview">
                                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                </div>
                                <label for="profilePhoto" class="upload-btn">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                                        <circle cx="12" cy="13" r="4"></circle>
                                    </svg>
                                    Add Photo
                                    <input type="file" id="profilePhoto" name="profilePhoto" accept="image/*" style="display: none;">
                                </label>
                            </div>
                        </div>
                        
                        <!-- Right Side: Form Fields -->
                        <div class="form-section">
                            <h3 class="section-title">Sign in</h3>
                            
                            <!-- Personal Information -->
                            <div class="form-row">
                                <div class="form-field">
                                    <label for="lastName">Last Name</label>
                                    <input type="text" id="lastName" name="lastName" placeholder="Enter last name" required>
                                </div>
                                <div class="form-field">
                                    <label for="firstName">First Name</label>
                                    <input type="text" id="firstName" name="firstName" placeholder="Enter first name" required>
                                </div>
                                <div class="form-field">
                                    <label for="middleInitial">Middle Initial</label>
                                    <input type="text" id="middleInitial" name="middleInitial" placeholder="M.I." maxlength="1">
                                </div>
                            </div>
                            
                            <?php if ($isDoctor): ?>
                                <div class="form-field">
                                    <label for="specialization">Specialization</label>
                                    <input type="text" id="specialization" name="specialization" placeholder="Enter specialization" required>
                                </div>
                            <?php elseif ($isPharmacist): ?>
                                <div class="form-field">
                                    <label for="designation">Designation</label>
                                    <input type="text" id="designation" name="designation" placeholder="Enter designation" required>
                                </div>
                            <?php endif; ?>
                            
                            <div class="form-row">
                                <div class="form-field">
                                    <label for="contacts">Contacts</label>
                                    <input type="tel" id="contacts" name="contacts" placeholder="Enter contact number" required>
                                </div>
                                <div class="form-field">
                                    <label for="email">Email</label>
                                    <input type="email" id="email" name="email" placeholder="Enter email address" required>
                                </div>
                            </div>
                            
                            <!-- Address (Client only used in DB) -->
                            <div class="form-field">
                                <label for="address">Address</label>
                                <input type="text" id="address" name="address" placeholder="Enter full address">
                            </div>
                            
                            <!-- Account Credentials -->
                            <div class="form-field">
                                <label for="username">Username</label>
                                <input type="text" id="username" name="username" placeholder="Enter username" required>
                            </div>
                            
                            <div class="form-field">
                                <label for="password">Password</label>
                                <input type="password" id="password" name="password" placeholder="Enter password" required>
                            </div>
                            
                            <div class="form-field">
                                <label for="confirmPassword">Re-Enter Password</label>
                                <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm password" required>
                            </div>
                            
                            <!-- License Upload (Doctor and Pharmacist only) -->
                            <?php if ($isDoctor || $isPharmacist): ?>
                                <div class="form-field">
                                    <label for="licensePicture">Provide Your License Picture</label>
                                    <label for="licensePicture" class="upload-btn license-upload">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                                            <circle cx="12" cy="13" r="4"></circle>
                                        </svg>
                                        Upload License Picture
                                        <input type="file" id="licensePicture" name="licensePicture" accept="image/*" style="display: none;">
                                    </label>
                                </div>
                            <?php endif; ?>
                            
                            <div class="form-actions">
                                <button type="button" class="btn btn-secondary" onclick="window.location.href='SignUp.php'">Back</button>
                                <button type="submit" class="btn btn-primary">Create Account</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        <?php endif; ?>
    </div>
    
    <script type="module" src="../assets/js/auth/signup.js"></script>
</body>
</html>

