console.log("script.js loaded");

(function () {
    emailjs.init("qrMTz1dNIxyYFVshx");
})();

document.getElementById("contact-form").addEventListener("submit", function (e) {
    e.preventDefault();
    console.log("Form submitted");

    emailjs.sendForm(
        "service_nf4458o",
        "template_3nrqwe",
        this
    ).then(function () {
        alert("Message sent successfully!");
        document.getElementById("contact-form").reset();
    }, function (error) {
        alert("Failed to send message. Please try again.");
        console.log(error);
    });
});
