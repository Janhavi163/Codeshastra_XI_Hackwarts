
//option 1
import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import { v4 as uuidv4 } from "uuid";

const MAX_IMAGES = 8;

const MyTravelWall = () => {
  const [images, setImages] = useState([]);
  const [taglines, setTaglines] = useState([]);
  const [collageTagline, setCollageTagline] = useState("");
  const [links, setLinks] = useState([]);
  const collageRef = useRef(null);
  const singleRefs = useRef({});

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > MAX_IMAGES) {
      return alert("You can only upload up to 8 images.");
    }

    const previews = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...previews]);
    setTaglines((prev) => [...prev, ...files.map(() => "")]);
  };

  const handleTaglineChange = (index, value) => {
    const updatedTaglines = [...taglines];
    updatedTaglines[index] = value;
    setTaglines(updatedTaglines);
  };

  const printElement = async (ref) => {
    if (!ref.current) return;
    const canvas = await html2canvas(ref.current);
    const imageData = canvas.toDataURL("image/png");
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
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
            <img src="${imageData}" />
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
  };

  const generateLink = (id) => {
    const simulatedLink = `${window.location.origin}/view/${id}`;
    setLinks((prev) => [...prev, { id, link: simulatedLink }]);
  };

  const getLinkById = (id) => links.find((l) => l.id === id)?.link;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">My Travel Wall</h1>

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
        className="mb-4"
      />

      {images.length <= 5 ? (
        images.map((img, i) => {
          const id = `single-${i}`;
          return (
            <div
              key={id}
              ref={(el) => (singleRefs.current[id] = el)}
              className="border p-4 rounded-xl shadow-md space-y-2"
            >
              <img
                src={img}
                alt={`Travel ${i}`}
                className="w-60 h-60 object-cover rounded-xl mx-auto"
              />
              <input
                type="text"
                placeholder="Enter a tagline"
                value={taglines[i]}
                onChange={(e) => handleTaglineChange(i, e.target.value)}
                className="w-full p-2 border rounded"
              />
              <div className="flex gap-4 mt-2">
                <button
                  className="bg-blue-500 text-white px-4 py-1 rounded"
                  onClick={() => printElement({ current: singleRefs.current[id] })}
                >
                  Print
                </button>
                <button
                  className="bg-green-500 text-white px-4 py-1 rounded"
                  onClick={() => generateLink(id)}
                >
                  Generate Link
                </button>
              </div>
              {getLinkById(id) && (
                <p className="text-sm text-blue-600 mt-1">
                  Shareable link:{" "}
                  <a
                    href={getLinkById(id)}
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                  >
                    {getLinkById(id)}
                  </a>
                </p>
              )}
            </div>
          );
        })
      ) : (
        <div
          ref={collageRef}
          className="border p-6 rounded-xl shadow-lg bg-gradient-to-br from-yellow-100 to-pink-100"
        >
          <div className="grid grid-cols-3 gap-4">
            {images.map((img, i) => (
              <div key={i} className="flex flex-col items-center">
                <img
                  src={img}
                  alt={`Travel ${i}`}
                  className="w-40 h-40 object-cover rounded-lg"
                />
                <p className="text-sm mt-1 text-gray-700">{taglines[i]}</p>
              </div>
            ))}
          </div>
          <input
            type="text"
            placeholder="Enter a tagline for collage"
            value={collageTagline}
            onChange={(e) => setCollageTagline(e.target.value)}
            className="w-full mt-4 p-2 border rounded"
          />
          <div className="text-center mt-2 text-lg font-semibold">{collageTagline}</div>
          <div className="flex gap-4 mt-4">
            <button
              className="bg-blue-500 text-white px-4 py-1 rounded"
              onClick={() => printElement(collageRef)}
            >
              Print Collage
            </button>
            <button
              className="bg-green-500 text-white px-4 py-1 rounded"
              onClick={() => generateLink("collage")}
            >
              Generate Link
            </button>
          </div>
          {getLinkById("collage") && (
            <p className="text-sm text-blue-600 mt-2">
              Shareable link:{" "}
              <a
                href={getLinkById("collage")}
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                {getLinkById("collage")}
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default MyTravelWall;
