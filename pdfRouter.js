const express = require('express');
const { readFileSync } = require('fs');
const puppeteer = require('puppeteer');
const router = express.Router();

router.post('/generate-pdf', async (req, res) => {
    try {
        const user = req.body.user;
        const employer = req.body.employer;

        const htmlContent = readFileSync('awdT2.html', 'utf8');
        const finalHtml = replacePlaceholders(htmlContent, user, employer);

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Set the content of the page to the final HTML
        await page.setContent(finalHtml);

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

function replacePlaceholders(htmlContent, user, employer) {
    // Replace placeholders in the HTML content
    // (The rest of your code remains unchanged)
}

module.exports = router;
