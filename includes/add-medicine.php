<form method="post" 
      action="<?php echo $context === 'pharma' ? '/actions/add_inventory.php' : '/actions/add_prescription.php'; ?>"
      class="add-medicine-form">

    <h2>
        <?php echo $context === 'pharma' ? 'Add Medicine to Inventory' : 'Add Medicine to Prescription'; ?>
    </h2>

    <label for="medicine_name">Medicine Name:</label>
    <input type="text" id="medicine_name" name="medicine_name" required>

    <?php if ($context === 'pharma'): ?>
        <label for="quantity">Quantity:</label>
        <input type="number" id="quantity" name="quantity" required>

        <label for="expiry_date">Expiry Date:</label>
        <input type="date" id="expiry_date" name="expiry_date" required>
    <?php else: ?>
        <label for="dosage">Dosage:</label>
        <input type="text" id="dosage" name="dosage" required>

        <label for="duration">Duration (in days):</label>
        <input type="number" id="duration" name="duration" required>
    <?php endif; ?>

    <button type="submit">Add Medicine</button>
</form>
