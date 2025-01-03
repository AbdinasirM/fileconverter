import React, { useState, useEffect, useRef } from 'react';
import ConvertApi from 'convertapi-js';
import { FaCheckCircle, FaExclamationCircle, FaLinkedin , FaGithub } from 'react-icons/fa';

function App() {
  const [file, setFile] = useState(null);
  const [convertFrom, setConvertFrom] = useState('PDF');
  const [convertTo, setConvertTo] = useState('');
  const [convertedFile, setConvertedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [conversionError, setConversionError] = useState('');
  const [formats, setFormats] = useState([]);
  const fileInputRef = useRef(null);

  const convertApiSecret = import.meta.env.VITE_CONVERT_API_SECRET;
  let convertApi = ConvertApi.auth(convertApiSecret);

  useEffect(() => {
    const topFormats = [
      'DOCX', 'PDF', 'HTML', 'XLSX', 'PPTX', 'PNG', 'JPG', 'TXT', 'EPUB', 'SVG', 'TIFF', 'CSV', 'XLS', 'DOC', 'RTF', 'ODT', 'PAGES', 'KEY', 'NUMBERS', 'BMP'
    ];
    setFormats(topFormats);
  }, []);

  useEffect(() => {
    if (conversionError) {
      const timer = setTimeout(() => {
        setConversionError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [conversionError]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setConvertedFile(null);
    setConversionError('');
  };


  const handleConvert = async () => {
    if (!file) {
      setConversionError('Please choose a file to convert.');
      return;
    }
  
    const fileExtension = file.name.split('.').pop().toUpperCase();
  
    if (fileExtension !== convertFrom) {
      setConversionError(`Selected file type (${fileExtension}) does not match the "Convert From" format (${convertFrom}).`);
      return;
    }
  
    if (!convertFrom || !convertTo) {
      setConversionError('Please select both formats.');
      return;
    }
  
    // Define valid format conversions to prevent unsupported attempts
    const validConversions = {
      DOCX: ['PDF', 'TXT'],
      PDF: ['DOCX', 'JPG', 'TXT'],
      PNG: ['JPG', 'PDF'],
      JPG: ['PNG', 'PDF'],
      XLSX: ['PDF', 'CSV'],
      TXT: ['PDF'],
    };
  
    if (!validConversions[convertFrom]?.includes(convertTo)) {
      setConversionError(`Conversion from ${convertFrom} to ${convertTo} is not supported.`);
      return;
    }
  
    setLoading(true);
    let params = convertApi.createParams();
    params.add('file', file);
  
    // Add format-specific parameters if necessary
    if (convertFrom === 'PNG' && convertTo === 'JPG') {
      params.add('scale', 'true');
    }
  
    try {
      let result = await convertApi.convert(convertFrom.toLowerCase(), convertTo.toLowerCase(), params);
      if (result.files.length > 0) {
        let url = result.files[0].Url;
        setConvertedFile(url);
      } else {
        setConversionError('Conversion failed. No file returned.');
      }
    } catch (error) {
      console.error('Conversion error:', error);
      setConversionError('Conversion failed. Please check the file format or try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const downloadConvertedFile = () => {
    if (convertedFile) {
      const link = document.createElement('a');
      link.href = convertedFile;
      link.setAttribute('download', true);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setFile(null);
      setConvertedFile(null);
      setConvertFrom('DOCX');
      setConvertTo('PDF');
    }
  };

  return (
<>

    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 relative">
        <img src="/convert.png" alt="Convert Logo" className="w-48 h-48 mb-6" />

      <div className="absolute top-4 right-4 space-y-4">
        {conversionError && (
          <div className="flex items-center p-4 text-sm text-red-700 bg-red-100 rounded-lg shadow-lg" role="alert">
            <FaExclamationCircle className="mr-3" />
            <span>{conversionError}</span>
          </div>
        )}

        {convertedFile && (
          <div className="flex items-center p-4 text-sm text-green-700 bg-green-100 rounded-lg shadow-lg" role="alert">
            <FaCheckCircle className="mr-3" />
            <span>File converted successfully! <button onClick={downloadConvertedFile} className="text-blue-500 underline">Download it here</button>.</span>
          </div>
        )}
      </div>

      <div className="w-full max-w-3xl p-8 mb-6 bg-white dark:bg-gray-900 rounded-xl shadow-2xl transition-all transform hover:scale-105 duration-300">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 dark:text-gray-100 mb-6 animate-pulse">File Converter</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-8">Convert files between various formats with ease.</p>
        
        <form className="space-y-6">
          <div className="flex flex-col items-center">
            <input
              id="file_input"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
            <label
              htmlFor="file_input"
              className="cursor-pointer px-6 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center w-2/3 transition-all transform hover:scale-105 duration-300"
            >
              {file ? file.name : 'Click to upload a file'}
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Convert From</label>
              <select
                value={convertFrom}
                onChange={(e) => setConvertFrom(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-200 dark:focus:ring-blue-600 dark:bg-gray-800 dark:border-gray-700 shadow-lg"
              >
                {formats.map((format) => (
                  <option key={format} value={format}>{format}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Convert To</label>
              <select
                value={convertTo}
                onChange={(e) => setConvertTo(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-200 dark:focus:ring-blue-600 dark:bg-gray-800 dark:border-gray-700 shadow-lg"
              >
                {formats.map((format) => (
                  <option key={format} value={format}>{format}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={handleConvert}
            className={`w-full py-3 px-4 rounded-lg text-white bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-xl transition-all transform hover:scale-105 duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Converting...' : 'Convert File'}
          </button>
        </form>
        
      </div>
      <div className="absolute bottom-8 flex space-x-6">
        <a href="https://www.linkedin.com/in/abdinasir-mumin-566b30177/" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-blue-500">
          <FaLinkedin size={30} />
        </a>
        <a href="https://github.com/AbdinasirM" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-black">
          <FaGithub size={30} />
        </a>
      </div>
    </div>
    </>
  );
}

export default App;
