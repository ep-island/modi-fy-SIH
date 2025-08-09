
(function() {
    'use strict';
    
    let autoMode = true; 
    const normal = 'https://www.sih.gov.in/img/people/3.jpg'; 
    const mitronUrl = chrome.runtime.getURL('img/modiji.png'); 
    
    
    function findTargetImage() {
        return document.querySelector("#one > div:nth-child(1) > div > div > div > div.org-sih-hard-img > img");
    }
    
    
    function replaceImg(imgElement) {
        if (imgElement) {
            imgElement.src = mitronUrl;
            imgElement.style.objectFit = 'contain';
            imgElement.style.border = "2px solid rgb(231 156 10)";
        }
    }
    
    
    function restoreImg(imgElement) {
        if (imgElement) {
            imgElement.src = normal;
        }
    }
    
    
    function setupHoverEffect(imgElement) {
        if (!imgElement) return;
        
        imgElement.addEventListener('mouseover', () => {
            imgElement.src = mitronUrl;
            imgElement.style.objectFit = 'contain';
            imgElement.style.border = "2px solid rgb(231 156 10)";
        });
        
        imgElement.addEventListener('mouseout', () => {
            imgElement.style.border = "2px solid rgb(19, 118, 143)";
            imgElement.src = normal;
        });
    }
    
    
    function init() {
        const targetImg = findTargetImage();
        
        if (!targetImg) {
            console.log('Target image not found');
            return;
        }
        
        
        chrome.storage.local.get(['mode'], function(result) {
            autoMode = result.mode !== 'hover'; 
            
            if (autoMode) {
                replaceImg(targetImg);
            } else {
                setupHoverEffect(targetImg);
            }
        });
        
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action === 'changeMode') {
                autoMode = request.mode === 'auto';
                
                
                const newImg = targetImg.cloneNode(true);
                targetImg.parentNode.replaceChild(newImg, targetImg);
                
                if (autoMode) {
                    replaceImg(newImg);
                } else {
                    restoreImg(newImg);
                    setupHoverEffect(newImg);
                }
                
                sendResponse({success: true});
            }
        });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    setTimeout(init, 2000);
})();