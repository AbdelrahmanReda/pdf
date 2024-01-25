const express = require('express');
const { readFileSync } = require('fs');
const puppeteer = require('puppeteer');
const router = express.Router();

router.post('/generate-pdf', async (req, res) => {
    try {
        const user = req.body.user;
        const employer = req.body.employer;

        const htmlContent = readFileSync('awdT2.html', 'utf8');

        console.log("htmlContent")
        const finalHtml = replacePlaceholders(htmlContent, user, employer);
        console.log("finalHtml")
        const browser = await puppeteer.launch();
        console.log("browser")
        const page = await browser.newPage();
        console.log("page")

        // Set the content of the page to the final HTML
        await page.setContent(finalHtml);
        console.log("setContent")

        // Generate PDF
        const pdfBuffer = await page.pdf();
        console.log("pdfBuffer")

        // Close the browser
        await browser.close();
        console.log("browser.close")

        // Send the PDF as a download
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=generated.pdf'
        );
        console.log("setHeader")
        res.setHeader('Content-Type', 'application/pdf');
        console.log("setHeader")
        res.send(pdfBuffer);
        console.log("send")
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
    return htmlContent
        .replace(/&lt;#1&gt;/g, user?.firstName + ' ' + user?.middleName + ' ' + user?.lastName)
        .replace(/&lt;#2&gt;/g, user?.dateOfBirth || '')
        .replace(/&lt;#3&gt;/g, user?.dayTimePhone || '')
        .replace(/&lt;#4&gt;/g, user?.email || '')
        .replace(/&lt;#5&gt;/g, user?.socialSecurityNumber || '')
        .replace(/&lt;#6&gt;/g, user?.driversLicenseNumber || '')
        .replace(/&lt;#7&gt;/g, user?.residencyType || '')
        .replace(/&lt;#8&gt;/g, user?.mortgagePayment || '')
        .replace(/&lt;#9&gt;/g, user?.address || '')
        .replace(/&lt;#11&gt;/g, user?.state || '')
        .replace(/&lt;#12&gt;/g, user?.city || '')
        .replace(/&lt;#13&gt;/g, user?.zipCode || '')
        .replace(/&lt;#22&gt;/g, '###')
        .replace(/&lt;#23&gt;/g, employer?.name || '')
        .replace(/&lt;#24&gt;/g, user?.zipCode || '')
        .replace(/&lt;#25&gt;/g, employer?.grossAnnualIncome || '')
        .replace(/&lt;#26&gt;/g, employer?.name || '')
        .replace(/&lt;#27&gt;/g, employer?.phone || '')
        .replace(/&lt;#28&gt;/g, employer?.address || '')
        .replace(/&lt;#29&gt;/g, employer?.state || '')
        .replace(/&lt;#30&gt;/g, employer?.city || '')
        .replace(/&lt;#31&gt;/g, employer?.zipCode || '');
}

module.exports = router;
