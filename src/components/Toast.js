// src/components/Toast.js
export default function Toast({ message, type }) {
  return <div className={`toast ${type}`}>{message}</div>;
}
