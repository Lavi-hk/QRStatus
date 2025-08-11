import QRCode from "qrcode";

export async function generateQRCode(data: string): Promise<string> {
  try {
    return await QRCode.toDataURL(data, {
      width: 256,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw new Error("Failed to generate QR code");
  }
}

export function downloadQRCode(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

export function printQRCode(dataUrl: string) {
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Faculty QR Code</title>
          <style>
            body { 
              margin: 0; 
              padding: 20px; 
              text-align: center; 
              font-family: Arial, sans-serif; 
            }
            img { 
              max-width: 100%; 
              height: auto; 
            }
            .header {
              margin-bottom: 20px;
              font-size: 18px;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="header">Faculty Availability QR Code</div>
          <img src="${dataUrl}" alt="QR Code" />
          <p>Scan this code to check faculty availability</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }
}
