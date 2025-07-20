// 📁 backend/services/priceJobHandler.js

export default async function priceJobHandler(job) {
  const { token, network, timestamp } = job.data;

  console.log(`📦 [priceJobHandler] Job ID: ${job.id}`);
  console.log(`🔹 Token: ${token}, Network: ${network}, Timestamp: ${timestamp}`);

  if (!token || !network || !timestamp) {
    console.warn(`⚠️ Missing fields:`, job.data);
    return { success: false, reason: 'Invalid job payload' };
  }

  try {
    // 🛠 Simulate a process (e.g., DB write, API call, etc.)
    const result = {
      success: true,
      stored: {
        token,
        network,
        timestamp,
        fetchedAt: new Date(),
      },
    };

    console.log(`✅ Job processed:`, result);
    return result;
  } catch (err) {
    console.error(`❌ Handler error:`, err);
    throw err;
  }
}
