
document.addEventListener('DOMContentLoaded', function() {
    const autoOption = document.getElementById('autoOption');
    const hoverOption = document.getElementById('hoverOption');
    const autoRadio = document.getElementById('autoMode');
    const hoverRadio = document.getElementById('hoverMode');
    const statusDiv = document.getElementById('status');
    
    
    chrome.storage.local.get(['mode'], function(result) {
        const savedMode = result.mode || 'auto';
        if (savedMode === 'hover') {
            hoverRadio.checked = true;
            updateActiveOption('hover');
        } else {
            autoRadio.checked = true;
            updateActiveOption('auto');
        }
    });
    
    
    autoRadio.addEventListener('change', function() {
        if (this.checked) {
            changeMode('auto');
        }
    });
    
    hoverRadio.addEventListener('change', function() {
        if (this.checked) {
            changeMode('hover');
        }
    });
    
    
    autoOption.addEventListener('click', function() {
        autoRadio.checked = true;
        changeMode('auto');
    });
    
    hoverOption.addEventListener('click', function() {
        hoverRadio.checked = true;
        changeMode('hover');
    });
    
    function updateActiveOption(mode) {
        autoOption.classList.remove('active');
        hoverOption.classList.remove('active');
        
        if (mode === 'auto') {
            autoOption.classList.add('active');
        } else {
            hoverOption.classList.add('active');
        }
    }
    
    function showStatus(message, type = 'success') {
        statusDiv.textContent = message;
        statusDiv.className = `status ${type}`;
        statusDiv.style.display = 'block';
        
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 2000);
    }
    
    function changeMode(mode) {
        
        chrome.storage.local.set({mode: mode});
        
        
        updateActiveOption(mode);
        
        
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0] && tabs[0].url.includes('sih.gov.in')) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'changeMode',
                    mode: mode
                }, function(response) {
                    if (chrome.runtime.lastError) {
                        showStatus('Please refresh the page to apply changes', 'info');
                    } else if (response && response.success) {
                        showStatus(`Switched to ${mode} mode`, 'success');
                    }
                });
            } else {
                showStatus(`Mode set to ${mode}. Visit sih.gov.in to see changes.`, 'success');
            }
        });
    }
});