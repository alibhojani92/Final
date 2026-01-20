// src/config/permissions.js

const ADMIN_IDS = [
  // put your Telegram numeric ID here
  // example: 7539477188
];

export function isAdmin(userId) {
  return ADMIN_IDS.includes(userId);
}
