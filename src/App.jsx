import { useState } from "react";

export default function App() {
  const [ipServer, setIpServer] = useState("");
  const [portServer, setPortServer] = useState("");
  const [serviceID, setServiceID] = useState("");
  const [isBtech, setIsBtech] = useState(false);

  const makeBatContent = (payload) => {
    // JSON body as string, escape double quotes for use inside bat -d "..."
    const jsonString = JSON.stringify(payload);
    const escapedJson = jsonString.replace(/"/g, '\\"');

    // Build bat content (Windows cmd), using ^ for line continuation
    const bat = [
      "@echo off",
      'curl -s -X POST "http://localhost:9004/api/OutputNumber/configurations" ^',
      '  -H "Content-Type: application/json" ^',
      `  -d "${escapedJson}" ^`,
      '  -w "\\nTimestamp: %date% %time% --- Status Code: %{http_code}\\n"',
      '',
      "echo.",
      "echo Request finished. Press any key to close...",
      "pause"
    ].join("\r\n");

    return bat;
  };

  const handleDownloadBat = (e) => {
    e.preventDefault();

    const payload = {
      isBtech,
      ipServer,
      portServer: Number(portServer || 0),
      serviceName: "vnvc1",
      serviceID,
      stackID: "1",
    };

    const batContent = makeBatContent(payload);
    const blob = new Blob([batContent], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    // filename can include timestamp or serviceID
    const fileName = `config_outnumber.bat`;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form className="bg-white p-6 rounded shadow-md space-y-4 w-full max-w-md">
        <h1 className="text-xl font-bold">API Config Form</h1>

        <input name="ipServer" placeholder="IP Server" value={ipServer} onChange={(e) => setIpServer(e.target.value)} className="w-full p-2 border rounded" required />

        <input name="portServer" placeholder="Port Server" value={portServer} onChange={(e) => setPortServer(e.target.value)} className="w-full p-2 border rounded" required />

        <input name="serviceID" placeholder="Service ID" value={serviceID} onChange={(e) => setServiceID(e.target.value)} className="w-full p-2 border rounded" required />

        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={isBtech} onChange={(e) => setIsBtech(e.target.checked)} />
          <span>Is Btech</span>
        </label>

        <div className="flex space-x-2">
          <button onClick={handleDownloadBat} className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700">Submit</button>
        </div>

        <p className="text-sm text-gray-500">
          Sau khi tải về, vui lòng mở file .bat trên máy Windows (double-click hoặc chạy bằng cmd).
        </p>
      </form>
    </div>
  );
}
