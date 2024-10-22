import React, { useState, useRef } from 'react';
import { FileUp, LineChart } from 'lucide-react';
import ECGCanvas from './components/ECGCanvas';
import { extractDataFromImage } from './utils/imageProcessing';

function App() {
  const [image, setImage] = useState<string | null>(null);
  const [csvData, setCsvData] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExtractData = async () => {
    if (image) {
      const data = await extractDataFromImage(image);
      const csv = data.map((point) => `${point.x},${point.y}`).join('\n');
      setCsvData(`x,y\n${csv}`);
    }
  };

  const handleDownloadCSV = () => {
    if (csvData) {
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'ecg_data.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-8">ECG Signal Graph to CSV Converter</h1>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <div className="mb-6">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            ref={fileInputRef}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded flex items-center"
          >
            <FileUp className="mr-2" size={20} />
            Upload ECG Image
          </button>
        </div>
        {image && (
          <div className="mb-6">
            <ECGCanvas imageUrl={image} />
          </div>
        )}
        <div className="flex justify-between">
          <button
            onClick={handleExtractData}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded flex items-center"
            disabled={!image}
          >
            <LineChart className="mr-2" size={20} />
            Extract Data
          </button>
          <button
            onClick={handleDownloadCSV}
            className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded flex items-center"
            disabled={!csvData}
          >
            <FileUp className="mr-2" size={20} />
            Download CSV
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;