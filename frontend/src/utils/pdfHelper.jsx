
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL


export const generatePdfAndSendMail = async (myImage, selectedImage,modifiedImages, setShowLoader, setMessage, setError, email, role = '' ) => {
        setShowLoader(true);

        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const margin = 15;
        let yPos = 10;
    
        try {
            const logoBase64 = await getBase64Image(myImage);
            pdf.addImage(logoBase64, "PNG", (pdfWidth - 30) / 2, yPos, 50, 15);
            yPos += 25;
        } catch (error) {
            console.error("Error loading logo:", error);
        }
    
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(14);
        pdf.setTextColor("#062538");
        pdf.text("Product Details", pdfWidth / 2, yPos, { align: "center" });
        yPos += 10;
        let tableData
        if (role){
            console.log("role", role)
            console.log("selectedImage", selectedImage)
             tableData = selectedImage?.engraving_details?.engraving_lines.map((line) => {
                return JSON.parse(line.product_details || "[]").map(pd => [pd.property, pd.value]);
            }).flat();
            console.log("tableData", tableData) 
        }
        else{
            console.log("selectedImage", selectedImage)
             tableData = selectedImage.map(pd => [pd.property, pd.value]);
             console.log("tableData", tableData)
        }

    
        autoTable(pdf, {
            startY: yPos,
            head: [["Property", "Value"]],
            body: tableData.length ? tableData : [["No data available", ""]],
            styles: { fontSize: 10, cellPadding: 2, textColor: "#062538" },
            headStyles: { fillColor: "#062538", textColor: "#FFFFFF", fontStyle: "bold" },
        });
    
        yPos = pdf.lastAutoTable.finalY + 15;
    
        pdf.setFontSize(14);
        pdf.text("Engraved Images", pdfWidth / 2, yPos, { align: "center" });
        yPos += 8;
    
        let imgWidth = 80;
        let imgHeight = 80;
        let imagesPerRow = 2;
        let spaceBetweenImages = 20;
        let borderWidth = 2;
        let borderColor = "#062538";
    
        let rowWidth = imagesPerRow * (imgWidth + spaceBetweenImages) - spaceBetweenImages;
        let imgX = (pdfWidth - rowWidth) / 2;
        let imgY = yPos;
    
        for (let index = 0; index < modifiedImages.length; index++) {
            try {
                const imgBase64 = await getBase64Image(modifiedImages[index]);
    
                if (imgY + imgHeight > pdfHeight - margin) {
                    pdf.addPage();
                    imgY = margin + 5;
                    imgX = (pdfWidth - rowWidth) / 2;
                    pdf.setTextColor("#062538");
                    pdf.text("Engraved Images (contd.)", margin, imgY);
                    imgY += 8;
                }
    
                pdf.setDrawColor(borderColor);
                pdf.setLineWidth(borderWidth);
                pdf.rect(imgX, imgY, imgWidth, imgHeight);
    
                pdf.addImage(imgBase64, "JPEG", imgX, imgY, imgWidth, imgHeight, "", "FAST");
    
                imgX += imgWidth + spaceBetweenImages;
    
                if ((index + 1) % imagesPerRow === 0) {
                    imgX = (pdfWidth - rowWidth) / 2;
                    imgY += imgHeight + spaceBetweenImages;
                }
            } catch (error) {
                console.error(`Error loading image ${index}:`, error);
            }
        }
    
        const pdfBlob = pdf.output("blob");
    
        await sendPdfToMail(pdfBlob, setShowLoader, setMessage, setError, email);
    };
    
    
const sendPdfToMail = async (pdfBlob, setShowLoader, setMessage, setError, email) => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("file", pdfBlob, "Product_Details.pdf");

    try {
        const response = await axios.post(`${API_BASE_URL}/send-pdf`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.status === 200) {
            setMessage("PDF sent successfully!");
            setError(null);
        } else {
            setError("Failed to send PDF via email");
            setMessage(null);
        }
    } catch (error) {
        setError("Error sending PDF. Please try again.");
        setMessage(null);
    } finally {
        setShowLoader(false);
    }
};
    
    
const getBase64Image = (url) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = url;
        img.onload = function () {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);

            resolve(canvas.toDataURL("image/png"));
        };
        img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    });
};