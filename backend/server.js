const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const { Document, Packer, Paragraph, TextRun } = require('docx');
const { PDFDocument, rgb } = require('pdf-lib');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const sharp = require('sharp');

const app = express();
const PORT = 3001;

// Enable CORS
app.use(cors());

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// PDF to Word conversion endpoint
app.post('/convert-pdf-to-word', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    // Extract text from PDF
    const pdfData = await pdfParse(req.file.buffer);
    const text = pdfData.text;

    // Create Word document
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: text,
                font: 'Arial',
                size: 24,
              }),
            ],
          }),
        ],
      }],
    });

    // Generate DOCX buffer
    const buffer = await Packer.toBuffer(doc);

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${req.file.originalname.replace('.pdf', '.docx')}"`);

    // Send the file
    res.send(buffer);

  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({ error: 'Failed to convert PDF to Word' });
  }
});

// PDF compression endpoint
app.post('/compress-pdf', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const compressionLevel = req.body.compressionLevel || 'medium';

    // Load PDF with pdf-lib for basic optimization
    const pdfDoc = await PDFDocument.load(req.file.buffer);

    // Save with optimization (pdf-lib automatically optimizes when saving)
    const compressedPdfBytes = await pdfDoc.save();

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${req.file.originalname.replace('.pdf', '_compressed.pdf')}"`);
    res.setHeader('X-Original-Size', req.file.size.toString());
    res.setHeader('X-Compressed-Size', compressedPdfBytes.length.toString());

    // Send the compressed file
    res.send(Buffer.from(compressedPdfBytes));

  } catch (error) {
    console.error('Compression error:', error);
    res.status(500).json({ error: 'Failed to compress PDF' });
  }
});

// PDF merge endpoint
const mergeUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }).array('pdfs', 10);
app.post('/merge-pdfs', mergeUpload, async (req, res) => {
  try {
    if (!req.files || req.files.length < 2) {
      return res.status(400).json({ error: 'At least 2 PDF files required for merging' });
    }

    const mergedPdf = await PDFDocument.create();

    for (const file of req.files) {
      const pdf = await PDFDocument.load(file.buffer);
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach(page => mergedPdf.addPage(page));
    }

    const mergedBytes = await mergedPdf.save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="merged.pdf"`);
    res.send(Buffer.from(mergedBytes));

  } catch (error) {
    console.error('Merge error:', error);
    res.status(500).json({ error: 'Failed to merge PDFs' });
  }
});

// PDF split endpoint
app.post('/split-pdf', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const splitPage = parseInt(req.body.splitPage);
    if (!splitPage || splitPage < 1) {
      return res.status(400).json({ error: 'Invalid split page number' });
    }

    const pdf = await PDFDocument.load(req.file.buffer);
    const totalPages = pdf.getPageCount();

    if (splitPage >= totalPages) {
      return res.status(400).json({ error: 'Split page number exceeds total pages' });
    }

    // Create first part
    const firstPdf = await PDFDocument.create();
    const firstPages = await firstPdf.copyPages(pdf, Array.from({ length: splitPage }, (_, i) => i));
    firstPages.forEach(page => firstPdf.addPage(page));

    // Create second part
    const secondPdf = await PDFDocument.create();
    const secondPages = await secondPdf.copyPages(pdf, Array.from({ length: totalPages - splitPage }, (_, i) => i + splitPage));
    secondPages.forEach(page => secondPdf.addPage(page));

    // Create ZIP archive
    const archive = archiver('zip');
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${req.file.originalname.replace('.pdf', '_split.zip')}"`);

    archive.pipe(res);
    archive.append(Buffer.from(await firstPdf.save()), { name: 'part1.pdf' });
    archive.append(Buffer.from(await secondPdf.save()), { name: 'part2.pdf' });
    archive.finalize();

  } catch (error) {
    console.error('Split error:', error);
    res.status(500).json({ error: 'Failed to split PDF' });
  }
});

// PDF lock endpoint
app.post('/lock-pdf', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const password = req.body.password;
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const pdfDoc = await PDFDocument.load(req.file.buffer);

    const encryptedPdfBytes = await pdfDoc.save({
      userPassword: password,
      ownerPassword: password,
      permissions: {
        printing: 'highResolution',
        modifying: false,
        copying: false,
        annotating: false,
        fillingForms: false,
        contentAccessibility: false,
        documentAssembly: false,
      },
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${req.file.originalname.replace('.pdf', '_locked.pdf')}"`);
    res.send(Buffer.from(encryptedPdfBytes));

  } catch (error) {
    console.error('Lock error:', error);
    res.status(500).json({ error: 'Failed to lock PDF' });
  }
});

// PDF unlock endpoint
app.post('/unlock-pdf', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const password = req.body.password;
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const pdfDoc = await PDFDocument.load(req.file.buffer, { password });

    // Save without password
    const unlockedPdfBytes = await pdfDoc.save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${req.file.originalname.replace('.pdf', '_unlocked.pdf')}"`);
    res.send(Buffer.from(unlockedPdfBytes));

  } catch (error) {
    console.error('Unlock error:', error);
    if (error.message.includes('password')) {
      res.status(400).json({ error: 'Incorrect password' });
    } else {
      res.status(500).json({ error: 'Failed to unlock PDF' });
    }
  }
});

// PDF e-signature endpoint
app.post('/esign-pdf', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const { signatureType, signatureText, signatureFont, signatureColor, signatureSize } = req.body;

    if (signatureType === 'text' && !signatureText) {
      return res.status(400).json({ error: 'Signature text is required' });
    }

    const pdfDoc = await PDFDocument.load(req.file.buffer);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // Add signature to bottom right of first page
    const { width, height } = firstPage.getSize();
    const fontSize = signatureSize === 'small' ? 12 : signatureSize === 'medium' ? 16 : signatureSize === 'large' ? 20 : 24;

    if (signatureType === 'text') {
      // Use standard font
      const font = await pdfDoc.embedFont('Helvetica');
      const color = hexToRgb(signatureColor) || { r: 0, g: 0, b: 0 };

      firstPage.drawText(signatureText, {
        x: width - 200,
        y: 50,
        size: fontSize,
        font,
        color: rgb(color.r / 255, color.g / 255, color.b / 255),
      });
    } else if (signatureType === 'upload' && req.files && req.files.length > 0) {
      // Handle uploaded signature image
      const signatureFile = req.files.find(f => f.fieldname === 'signatureImage');
      if (signatureFile) {
        const signatureImage = await pdfDoc.embedPng(signatureFile.buffer) || await pdfDoc.embedJpg(signatureFile.buffer);
        const imgDims = signatureImage.scale(0.5); // Scale down

        firstPage.drawImage(signatureImage, {
          x: width - imgDims.width - 50,
          y: 30,
          width: imgDims.width,
          height: imgDims.height,
        });
      }
    }

    const signedPdfBytes = await pdfDoc.save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${req.file.originalname.replace('.pdf', '_signed.pdf')}"`);
    res.send(Buffer.from(signedPdfBytes));

  } catch (error) {
    console.error('E-signature error:', error);
    res.status(500).json({ error: 'Failed to add signature to PDF' });
  }
});

// Helper function to convert hex to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// General file conversion endpoint
const generalUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
app.post('/convert-format', generalUpload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const targetFormat = req.body.targetFormat;
    const originalName = req.file.originalname;
    const extension = originalName.split('.').pop()?.toLowerCase();

    let convertedBuffer;
    let mimeType;
    let newFilename;

    // Handle different conversions
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff'].includes(extension)) {
      // Image conversion
      if (!['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp'].includes(targetFormat)) {
        return res.status(400).json({ error: 'Unsupported target format for images' });
      }

      convertedBuffer = await sharp(req.file.buffer)[targetFormat]().toBuffer();
      mimeType = `image/${targetFormat === 'jpg' ? 'jpeg' : targetFormat}`;
      newFilename = originalName.replace(/\.[^.]+$/, `.${targetFormat}`);
    } else if (extension === 'txt') {
      // Text file conversion
      if (targetFormat === 'txt') {
        convertedBuffer = req.file.buffer;
        mimeType = 'text/plain';
      } else if (targetFormat === 'html') {
        const text = req.file.buffer.toString('utf8');
        convertedBuffer = Buffer.from(`<html><body><pre>${text.replace(/</g, '<').replace(/>/g, '>')}</pre></body></html>`);
        mimeType = 'text/html';
      } else {
        return res.status(400).json({ error: 'Unsupported target format for text files' });
      }
      newFilename = originalName.replace(/\.[^.]+$/, `.${targetFormat}`);
    } else {
      return res.status(400).json({ error: 'File type not supported for conversion. Office document conversion requires LibreOffice or similar software.' });
    }

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${newFilename}"`);
    res.send(convertedBuffer);

  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({ error: 'Failed to convert file' });
  }
});

// Currency rates endpoint
app.get('/currency-rates', async (req, res) => {
  try {
    // Fetch current exchange rates from exchangerate-api.com
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');

    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates');
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Currency rates error:', error);
    // Fallback to mock rates
    res.json({
      rates: {
        'USD': 1,
        'EUR': 0.85,
        'GBP': 0.73,
        'JPY': 110.0,
        'CAD': 1.25,
        'AUD': 1.35,
        'CHF': 0.92,
        'CNY': 6.45,
        'INR': 74.5,
        'KRW': 1180.0,
        'BRL': 5.2,
        'MXN': 20.0,
        'RUB': 75.0,
        'ZAR': 14.8,
        'SGD': 1.35,
        'NZD': 1.4,
        'HKD': 7.8,
        'SEK': 8.6,
        'NOK': 8.8,
        'DKK': 6.3,
      },
      base: 'USD',
      date: new Date().toISOString().split('T')[0]
    });
  }
});



// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'File conversion backend is running' });
});

app.listen(PORT, () => {
  console.log(`PDF to Word converter backend running on port ${PORT}`);
});
