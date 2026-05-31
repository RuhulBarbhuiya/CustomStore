const USER_KEY = "user";
const USER_CHANGE_EVENT = "user:changed";

function canUseStorage() {
  return typeof window !== "undefined" && window.localStorage;
}

function notifyUserChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(USER_CHANGE_EVENT));
  }
}

export function clearUser() {
  if (!canUseStorage()) return;

  localStorage.removeItem(USER_KEY);
  notifyUserChange();
}

export function getUserSnapshot() {
  if (!canUseStorage()) return "null";

  return localStorage.getItem(USER_KEY) || "null";
}

export function subscribeToUser(callback) {
  if (typeof window === "undefined") return () => {};

  window.addEventListener(USER_CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(USER_CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
