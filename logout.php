<?php
require_once __DIR__ . '/includes/session.php';

destroySession();

header("Location: index.php");
exit();
