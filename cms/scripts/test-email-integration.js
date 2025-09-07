const fetch = require('node-fetch');

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const EMAIL_SERVICE_URL = process.env.EMAIL_SERVICE_URL || 'http://localhost:3030';

async function testEmailIntegration() {
  console.log('🧪 Testing Email Service Integration with Strapi\n');

  try {
    // Test 1: Check if Strapi is running
    console.log('1️⃣ Checking if Strapi is running...');
    const strapiHealth = await fetch(`${STRAPI_URL}/_health`);
    if (!strapiHealth.ok) {
      throw new Error(`Strapi health check failed: ${strapiHealth.status}`);
    }
    console.log('✅ Strapi is running\n');

    // Test 2: Check if Email Service is running
    console.log('2️⃣ Checking if Email Service is running...');
    const emailHealth = await fetch(`${EMAIL_SERVICE_URL}/health`);
    if (!emailHealth.ok) {
      throw new Error(`Email service health check failed: ${emailHealth.status}`);
    }
    console.log('✅ Email Service is running\n');

    // Test 3: Test Contact Form Submission
    console.log('3️⃣ Testing Contact Form Submission...');
    const contactData = {
      data: {
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Integration Test',
        message: 'This is a test message for email integration'
      }
    };

    const contactResponse = await fetch(`${STRAPI_URL}/api/contact-submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(contactData)
    });

    if (!contactResponse.ok) {
      const errorText = await contactResponse.text();
      throw new Error(`Contact submission failed: ${contactResponse.status} - ${errorText}`);
    }

    const contactResult = await contactResponse.json();
    console.log('✅ Contact form submitted successfully');
    console.log(`   - ID: ${contactResult.id}`);
    console.log(`   - Email: ${contactResult.email}\n`);

    // Test 4: Test Newsletter Signup
    console.log('4️⃣ Testing Newsletter Signup...');
    const newsletterData = {
      email: 'newsletter@example.com',
      firstName: 'Newsletter',
      lastName: 'Test',
      source: 'api',
      sourceUrl: 'http://localhost:3000/test'
    };

    const newsletterResponse = await fetch(`${STRAPI_URL}/api/newsletter-signups`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newsletterData)
    });

    if (!newsletterResponse.ok) {
      const errorText = await newsletterResponse.text();
      throw new Error(`Newsletter signup failed: ${newsletterResponse.status} - ${errorText}`);
    }

    const newsletterResult = await newsletterResponse.json();
    console.log('✅ Newsletter signup successful');
    console.log(`   - ID: ${newsletterResult.data.id}`);
    console.log(`   - Email: ${newsletterResult.data.email}`);
    console.log(`   - Status: ${newsletterResult.data.subscriptionStatus}`);
    console.log(`   - Verified: ${newsletterResult.data.verified}\n`);

    // Test 5: Test Newsletter Verification (if we have a token)
    if (newsletterResult.data.verificationToken) {
      console.log('5️⃣ Testing Newsletter Verification...');
      const verifyResponse = await fetch(`${STRAPI_URL}/api/newsletter-signups/verify/${newsletterResult.data.verificationToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (verifyResponse.ok) {
        const verifyResult = await verifyResponse.json();
        console.log('✅ Newsletter verification successful');
        console.log(`   - Status: ${verifyResult.data.subscriptionStatus}`);
        console.log(`   - Verified: ${verifyResult.data.verified}\n`);
      } else {
        console.log('⚠️ Newsletter verification failed (this might be expected in development)\n');
      }
    }

    console.log('🎉 All integration tests passed!');
    console.log('\n📧 Check your email inbox for:');
    console.log('   - Contact welcome email');
    console.log('   - Newsletter verification email');
    console.log('   - Newsletter welcome email (if verification was successful)');

  } catch (error) {
    console.error('❌ Integration test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testEmailIntegration();
