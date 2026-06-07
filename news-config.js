/**
 * UDS TLC SRC Network Configuration Config Engine
 * Modify URLs below to update backend databases smoothly.
 */

const SRC_CONFIG = {
    // Copy/Paste your completed Google Apps Script Deployment URL here below:
    GOOGLE_SHEET_WEBAPP_URL: "https://script.google.com/macros/s/AKfycbybOFykWtq9Jnb7o0t5yX1AJxjjMQu5oBp0XRFjsHFMzVj6iTKMdYdbUgEjL274t2tTmg/exec",
    
    // Centralized access links
    STUDENT_PORTAL_URL: "https://portal.uds.edu.gh",

    // Native offline fallback articles with picture parameters
    OFFLINE_FALLBACK_NEWS: [
        {
            title: "Trimester Field Work Preparation Assessment Protocols",
            date: "June 05, 2026",
            content: "The SRC has coordinated structural equipment allocations to ensure clean resource access for field preparation initiatives across regional networks.",
            imageUrl: "https://via.placeholder.com/600x400?text=UDS+Field+Practical+Program"
        },
        {
            title: "General Assembly Constitution Ratification Summits",
            date: "May 28, 2026",
            content: "The latest constitutional adjustments have been finalized and bound safely inside the PDF distribution channels available across our digital dashboards.",
            imageUrl: "https://via.placeholder.com/600x400?text=SRC+General+Assembly"
        }
    ]
};

// Map configuration links onto existing UI elements natively
document.addEventListener("DOMContentLoaded", () => {
    const individualLinks = [document.getElementById('drawerPortalBtn'), document.getElementById('footerPortalBtn')];
    individualLinks.forEach(element => {
        if(element) element.href = SRC_CONFIG.STUDENT_PORTAL_URL;
    });
});
