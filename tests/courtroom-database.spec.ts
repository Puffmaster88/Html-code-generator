// tests/courtroom-database.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Court Room - Database Operations', () => {
  
  test('should save decision to database', async ({ page }) => {
    // Navigate to Court Room page
    await page.goto('/court-room');
    
    // Wait for page to load
    await expect(page.locator('h1')).toContainText('Court Room');
    
    // Get case ID before saving
    const caseTitle = await page.locator('h2').textContent();
    console.log('Testing case:', caseTitle);
    
    // Select some evidence
    await page.locator('input[type="checkbox"]').first().check();
    console.log('✓ Evidence selected');
    
    // Add some notes
    await page.locator('textarea#notes').fill('Test notes: This is an automated Playwright test');
    console.log('✓ Notes added');
    
    // Set jury votes
    await page.locator('input[type="range"]').fill('7');
    console.log('✓ Jury votes set');
    
    // Listen for the alert dialog
    page.on('dialog', async dialog => {
      const message = dialog.message();
      console.log('Alert message:', message);
      
      // Check if save was successful
      expect(message).toContain('Saved decision');
      await dialog.accept();
    });
    
    // Click "Save to DB" button
    await page.click('button:has-text("Save to DB")');
    
    // Wait a moment for the save operation
    await page.waitForTimeout(1000);
    console.log('✓ Decision saved to database');
  });

  test('should save 3 different cases to database', async ({ page }) => {
    await page.goto('/court-room');
    
    for (let i = 1; i <= 3; i++) {
      console.log(`\n--- Saving Case ${i} ---`);
      
      // Get case details
      const caseTitle = await page.locator('h2').textContent();
      console.log(`Case ${i}: ${caseTitle}`);
      
      // Configure the case differently each time
      const evidenceCheckboxes = page.locator('input[type="checkbox"]');
      const count = await evidenceCheckboxes.count();
      
      // Select different number of evidence for each case
      for (let j = 0; j < Math.min(i, count); j++) {
        await evidenceCheckboxes.nth(j).check();
      }
      console.log(`✓ Selected ${Math.min(i, count)} evidence items`);
      
      // Add unique notes
      await page.locator('textarea#notes').fill(`Test case ${i} - Automated test at ${new Date().toISOString()}`);
      
      // Set different jury votes
      await page.locator('input[type="range"]').fill(String(i * 3));
      
      // Handle the alert
      page.once('dialog', async dialog => {
        expect(dialog.message()).toContain('Saved decision');
        await dialog.accept();
      });
      
      // Save to database
      await page.click('button:has-text("Save to DB")');
      await page.waitForTimeout(1000);
      console.log(`✓ Case ${i} saved`);
      
      // Generate new case for next iteration (if not last)
      if (i < 3) {
        await page.click('button:has-text("New Case")');
        await page.waitForTimeout(500);
      }
    }
    
    console.log('\n✓ All 3 cases saved to database successfully');
  });

  test('should verify database API endpoint returns saved decisions', async ({ request }) => {
    // Make a GET request to the API
    const response = await request.get('/api/decisions');
    
    // Check response is OK
    expect(response.ok()).toBeTruthy();
    
    // Parse JSON response
    const data = await response.json();
    console.log('API Response:', JSON.stringify(data, null, 2));
    
    // Verify response structure
    expect(data).toHaveProperty('success', true);
    expect(data).toHaveProperty('data');
    expect(Array.isArray(data.data)).toBeTruthy();
    
    // Log how many decisions are saved
    console.log(`✓ Database contains ${data.data.length} saved decisions`);
    
    // If there are saved decisions, verify structure
    if (data.data.length > 0) {
      const firstDecision = data.data[0];
      expect(firstDecision).toHaveProperty('caseId');
      expect(firstDecision).toHaveProperty('caseType');
      expect(firstDecision).toHaveProperty('caseTitle');
      expect(firstDecision).toHaveProperty('strength');
      console.log('✓ Decision structure verified');
    }
  });
  
});