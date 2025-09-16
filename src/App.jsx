import { useState } from "react";

export default function App() {
  const [form, setForm] = useState({
    ipServer: "",
    portServer: "",
    serviceID: "",
    serviceName: "vnvc1",
    stackID: "1",
    isBtech: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      alert("Response: " + JSON.stringify(data));
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md space-y-4 w-96"
      >
        <h1 className="text-xl font-bold">Config Outnumber Form</h1>

        <input
          name="ipServer"
          placeholder="IP Server"
          value={form.ipServer}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          name="portServer"
          placeholder="Port Server"
          value={form.portServer}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          name="serviceID"
          placeholder="Service ID"
          value={form.serviceID}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isBtech"
            checked={form.isBtech}
            onChange={handleChange}
          />
          <span>Is Btech</span>
        </label>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
