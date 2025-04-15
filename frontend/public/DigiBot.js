(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const auth = urlParams.get("auth");
  if (!auth) return;

  fetch(`http://localhost:8000/auth?auth=${auth}`)
    .then((res) => res.json())
    .then((data) => {
   
      localStorage.setItem("userRole", data.user_type);
      localStorage.setItem("userId", data.user_id);
      localStorage.setItem("companyId", data.company_id);    
      localStorage.setItem("companyName", data.company_name); 

   
      const existingIframe = document.getElementById("digibot-iframe");
      const existingLauncher = document.getElementById("digibot-launcher");
      if (existingIframe) existingIframe.remove();
      if (existingLauncher) existingLauncher.remove();
      
      const iframe = document.createElement("iframe");
      iframe.id = "digibot-iframe";
      iframe.src = data.chatbot_url;
   


     // iframe.style.height = "auto";
    //iframe.style.minHeight = "740px";    
    
    //  iframe.style.width = "100%";  
     // iframe.style.maxWidth = "600px"; 


     // Responsive Screen
      iframe.style.width = "95vw"; 
      iframe.style.maxWidth = "600px";
      iframe.style.height = "80vh"; 
      iframe.style.maxHeight = "90vh";
        
        
      iframe.style.position = "fixed";
      iframe.style.bottom = "90px";  
      iframe.style.right = "20px";
      iframe.style.border = "none";
      iframe.style.borderRadius = "20px";
      iframe.style.zIndex = "9999";   


      iframe.style.display = "none";


      document.body.appendChild(iframe);
           
      window.addEventListener("message", (event) => {
        if (
          event.data?.digibotHeight &&
          iframe &&
          iframe.style.display !== "none"
        ) {
          iframe.style.height = `${event.data.digibotHeight + 40}px`; // Add some buffer
          console.log("✅ Adjusted iframe height to", iframe.style.height);
        }
      });

      iframe.onload = () => {
        console.log("✅ iframe loaded, sending USER_INFO");
        iframe.contentWindow.postMessage(
          {
            type: "USER_INFO",
            payload: {
              userId: data.user_id,
              userRole: data.user_type,
              companyId: data.company_id,     // ✅ New
              companyName: data.company_name, // ✅ New
            },
          },
          "*"
        );
      };


      const launcher = document.createElement("button");
      launcher.id = "digibot-launcher";
      launcher.innerText = "💬";
      launcher.style.position = "fixed";
      launcher.style.bottom = "20px";
      launcher.style.right = "20px";
      launcher.style.width = "50px";
      launcher.style.height = "50px";
      launcher.style.borderRadius = "50%";
      
      
    
      launcher.style.fontSize = "24px";
      launcher.style.cursor = "pointer";
      launcher.style.zIndex = "9999";

      launcher.style.backgroundColor = "#fff";
      launcher.style.border = "1px solid #ddd";
      launcher.style.boxShadow = "0px 8px 20px rgba(0,0,0,0.15)";
      launcher.style.color = "#1976d2";
      launcher.style.fontWeight = "bold";


      launcher.onclick = () => {
        iframe.style.display =
          iframe.style.display === "none" ? "block" : "none";
      };

      document.body.appendChild(launcher);

      

     
    });
})();
