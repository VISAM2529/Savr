"use client";
import { useState } from "react";

export default function NotificationSettings({ onSave }) {
  const [email, setEmail] = useState("");
  const [sms, setSms] = useState("");

  const handleSave = () => {
    onSave({ email, sms });
  };

  return (
    <div className="bg-white p-4 rounded shadow mt-5">
      <h2 className="text-lg font-bold mb-2">Notification Settings</h2>
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          className="border p-2 w-full rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700">SMS</label>
        <input
          type="text"
          className="border p-2 w-full rounded"
          value={sms}
          onChange={(e) => setSms(e.target.value)}
        />
      </div>
      <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleSave}>
        Save
      </button>
    </div>
  );
}
