// 📁 services/birthdateService.js

// 🔹 Hardcoded birthdates for supported tokens
const tokenBirthdates = {
  usdt: 1625097600000, // July 1, 2021
  weth: 1609459200000, // Jan 1, 2021
  uni: 1598918400000,  // Sep 1, 2020
  link: 1585699200000, // Apr 1, 2020
};

// 🔹 Service function to get birthdate for a token
export async function getTokenBirthdate(token, network) {
  const key = token.toLowerCase();
  return tokenBirthdates[key] || null;
}
