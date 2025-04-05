// import React from "react";
// import "./printStyles.css"; // Ensure this CSS file is imported

// const PrintButton = () => {
//   const handlePrint = () => window.print();

//   return (
//     <button
//       onClick={handlePrint}
//       className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow no-print"
//     >
//       Print
//     </button>
//   );
// };

// export default PrintButton;

 //option 2
 // components/PrintButton.jsx
import React from "react";

const PrintButton = ({ image, tagline }) => {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return alert("Popup blocked! Please allow popups.");

    const htmlContent = `
      <html>
        <head>
          <title>Print</title>
          <style>
            body {
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              background: #f0f0f0;
              font-family: Arial, sans-serif;
            }
            .polaroid {
              background: white;
              padding: 10px;
              border: 1px solid #ccc;
              box-shadow: 2px 2px 10px rgba(0,0,0,0.2);
              width: 300px;
              text-align: center;
              border-radius: 10px;
            }
            .polaroid img {
              width: 100%;
              border-radius: 10px;
            }
            .tagline {
              margin-top: 10px;
              font-size: 14px;
              color: #333;
            }
          </style>
        </head>
        <body>
          <div class="polaroid">
            <img src="${image}" />
            <div class="tagline">${tagline}</div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <button
      onClick={handlePrint}
      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
    >
      Print
    </button>
  );
};

export default PrintButton;
 