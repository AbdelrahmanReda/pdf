const express = require('express');
const { readFileSync } = require('fs');
const puppeteer = require('puppeteer');
const router = express.Router();

router.post('/generate-pdf', async (req, res) => {
    try {
        const htmlContent = req.body.html;
        const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox']})
        const page = await browser.newPage();
        // Set the content of the page to the final HTML
        await page.setContent(htmlContent);
        // Generate PDF
        const pdfBuffer = await page.pdf();
        // Close the browser
        await browser.close();
        // Send the PDF as a download
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=generated.pdf'
        );
        res.setHeader('Content-Type', 'application/pdf');
        res.send(pdfBuffer);
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: 'Error occurred while generating PDF',
            error: error,
        });
    }
});



module.exports = router;
