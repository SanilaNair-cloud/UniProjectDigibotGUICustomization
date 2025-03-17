<script>
  (function() {
    const userID = "123456"; // Example User ID
    const userType = "admin"; // Example User Type

    // Encrypt these values before sending (use CryptoJS or similar)
    const encryptedUserID = btoa(userID);  // Base64 Encoding (Replace with real encryption)
    const encryptedUserType = btoa(userType);

    const chatbotScript = document.createElement("script");
    chatbotScript.src = `https://digibot-server.com/digibot.js?uid=${encryptedUserID}&utype=${encryptedUserType}`;
    chatbotScript.async = true;
    document.body.appendChild(chatbotScript);
  })();


(function() {
    async function loadChatbot() {
        const urlParams = new URLSearchParams(window.location.search);
        const auth = urlParams.get("auth");

        if (!auth) {
            console.error("Authentication data missing.");
            return;
        }

        // Send encrypted CSV to the server for decryption
        const response = await fetch(`https://digibot-server.com/auth?auth=${auth}`);
        const data = await response.json();

        if (data.error) {
            console.error("Authentication failed.");
            return;
        }

        // Dynamically insert chatbot UI
        const chatbotContainer = document.createElement("div");
        chatbotContainer.id = "digibot-container";
        chatbotContainer.style.position = "fixed";
        chatbotContainer.style.bottom = "20px";
        chatbotContainer.style.right = "20px";
        chatbotContainer.style.width = "350px";
        chatbotContainer.style.height = "500px";
        chatbotContainer.style.background = "white";
        chatbotContainer.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.2)";
        chatbotContainer.innerHTML = `
            <iframe src="${data.chatbot_url}" width="100%" height="100%" style="border:none;"></iframe>
        `;

        document.body.appendChild(chatbotContainer);
    }

    loadChatbot();
    })();

</script>