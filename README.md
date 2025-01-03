# File Converter Web Application

## Overview
This project is a simple and elegant file converter web application that allows users to convert files between various formats. The application provides a user-friendly interface with support for a wide range of formats, ensuring seamless conversion with just a few clicks.

## Features
- Upload and convert files between formats such as PDF, DOCX, PNG, JPG, XLSX, and more.
- Real-time validation to ensure correct file formats are selected.
- Responsive design for desktop and mobile devices.
- Success and error messages that auto-dismiss after 5 seconds.
- Download converted files directly from the interface.

## Tools and Technologies Used
- **React** – Frontend library for building the user interface.
- **Tailwind CSS** – For designing responsive and visually appealing components.
- **ConvertAPI** – API used to handle file conversions between different formats.
- **React Icons** – For integrating LinkedIn, GitHub, and alert icons.


## How It Works
1. Upload a file by clicking the upload area.
2. Select the file format you wish to convert from and to.
3. Click "Convert File" to initiate the conversion process.
4. Download the converted file if the process is successful.

## Installation and Setup
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Create a `.env` file and add your **ConvertAPI** secret key:
```
VITE_CONVERT_API_SECRET=your_api_key_here
```
4. Start the development server by running:
```
npm run dev
```
5. Visit `http://localhost:5173` to use the application.

## Notes
- Ensure you have a valid **ConvertAPI** key to perform conversions.
- The application supports a limited number of conversions depending on your **ConvertAPI** plan.

## Links
- [ConvertAPI Documentation](https://www.convertapi.com/doc)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)

