// This file contains the main JavaScript logic for the temporary email service.
document.addEventListener('DOMContentLoaded', async () => {

    // --- Core Libraries & Global State ---
    const mailjs = new Mailjs();
    let currentAccount = null;
    let currentMessages = [];
    let isListening = false;

    // --- PWA Version Check Logic ---
    const PWA_VERSION_KEY = 'pwa_version';
    const CHECK_INTERVAL = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

    const checkPwaVersion = async () => {
        console.log("Checking PWA version...");
        try {
            const manifestRes = await fetch('./manifest.json');
            const manifest = await manifestRes.json();
            const latestVersion = manifest.version;
            const storedVersion = localStorage.getItem(PWA_VERSION_KEY);

            if (latestVersion !== storedVersion) {
                console.log(`New PWA version detected: ${latestVersion}. Old version was: ${storedVersion}.`);
                localStorage.setItem(PWA_VERSION_KEY, latestVersion);
                if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                    const cacheNames = await caches.keys();
                    await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
                    console.log('Service Worker caches cleared.');
                    window.location.reload(true);
                }
            } else {
                console.log("PWA version is up to date.");
            }
        } catch (error) {
            console.error('Failed to check or update PWA version:', error);
        }
    };
    
    // Check on page load and set interval for subsequent checks
    checkPwaVersion();
    setInterval(checkPwaVersion, CHECK_INTERVAL);

    // --- UI Elements ---
    const app = document.getElementById('app');
    const accountInfoDiv = document.getElementById('account-info');
    const currentEmailSpan = document.getElementById('current-email');
    const copyEmailBtn = document.getElementById('copy-email-btn');
    const copySucceed = document.getElementById('copy-succeed');
    const copyFailed = document.getElementById('copy-failed');
    const accountFormsDiv = document.getElementById('account-forms');
    const createRandomBtn = document.getElementById('create-random-btn');
    const usernameInput = document.getElementById('username-input');
    const passwordInput = document.getElementById('password-input');
    const domainSelect = document.getElementById('domain-select');
    const createCustomBtn = document.getElementById('create-custom-btn');
    const mailboxActionsDiv = document.getElementById('mailbox-actions');
    const refreshBtn = document.getElementById('refresh-btn');
    const refreshSpinner = document.getElementById('refresh-spinner');
    const refreshText = document.getElementById('refresh-text');
    const changeEmailBtn = document.getElementById('change-email-btn');
    const deleteBtn = document.getElementById('delete-btn');
    const inboxView = document.getElementById('inbox-view');
    const inboxList = document.getElementById('inbox-list');
    const noMessagesDiv = document.getElementById('no-messages');
    const messageView = document.getElementById('message-view');
    const backToInboxBtn = document.getElementById('back-to-inbox-btn');
    const openInWindowBtn = document.getElementById('open-in-window-btn');
    const downloadSourceBtn = document.getElementById('download-source-btn');
    const deleteMessageBtn = document.getElementById('delete-message-btn');
    const messageSubject = document.getElementById('message-subject');
    const messageFrom = document.getElementById('message-from');
    const messageTo = document.getElementById('message-to');
    const attachmentsContainer = document.getElementById('attachments-container');
    const attachmentsList = document.getElementById('attachments-list');
    const messageBodyIframe = document.getElementById('message-body');
    const loadingDiv = document.getElementById('loading');
    const modal = document.getElementById('modal');
    const modalText = document.getElementById('modal-text');
    const modalConfirmBtn = document.getElementById('modal-confirm');
    const modalCloseBtn = document.getElementById('modal-close');

    // --- IndexedDB Configuration ---
    const DB_NAME = 'temp-email-db';
    const DB_VERSION = 1;
    let db;
    const openDatabase = () => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onupgradeneeded = event => {
                db = event.target.result;
                if (!db.objectStoreNames.contains('messages')) {
                    db.createObjectStore('messages', { keyPath: 'id' });
                }
            };

            request.onsuccess = event => {
                db = event.target.result;
                resolve(db);
            };

            request.onerror = event => {
                console.error('IndexedDB error:', event.target.errorCode);
                reject(event.target.error);
            };
        });
    };

    const addMessageToDb = (message) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['messages'], 'readwrite');
            const store = transaction.objectStore('messages');
            const request = store.add(message);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    };
    
    const updateMessageInDb = (message) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['messages'], 'readwrite');
            const store = transaction.objectStore('messages');
            const request = store.put(message);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    };

    const getMessagesFromDb = () => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['messages'], 'readonly');
            const store = transaction.objectStore('messages');
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    };

    const deleteMessageFromDb = (id) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['messages'], 'readwrite');
            const store = transaction.objectStore('messages');
            const request = store.delete(id);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    };
    
    const clearMessagesDb = () => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['messages'], 'readwrite');
            const store = transaction.objectStore('messages');
            const request = store.clear();
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    // --- UI State Management Functions ---
    const showView = (view) => {
        loadingDiv.classList.add('hidden');
        accountFormsDiv.classList.add('hidden');
        mailboxActionsDiv.classList.add('hidden');
        inboxView.classList.add('hidden');
        messageView.classList.add('hidden');
        accountInfoDiv.classList.add('hidden');

        if (view === 'loading') {
            loadingDiv.classList.remove('hidden');
        } else if (view === 'account-forms') {
            accountFormsDiv.classList.remove('hidden');
        } else if (view === 'inbox') {
            accountInfoDiv.classList.remove('hidden');
            mailboxActionsDiv.classList.remove('hidden');
            inboxView.classList.remove('hidden');
        } else if (view === 'message') {
            accountInfoDiv.classList.remove('hidden');
            mailboxActionsDiv.classList.remove('hidden');
            messageView.classList.remove('hidden');
        }
    };
    
    // Custom Modal for user feedback
    const showModal = (text, isConfirm = false) => {
        modalText.textContent = text;
        modal.classList.remove('hidden');
        if (isConfirm) {
            modalConfirmBtn.classList.remove('hidden');
            return new Promise((resolve) => {
                const confirmHandler = () => {
                    modalConfirmBtn.removeEventListener('click', confirmHandler);
                    modalCloseBtn.removeEventListener('click', closeHandler);
                    modal.classList.add('hidden');
                    resolve(true);
                };
                const closeHandler = () => {
                    modalConfirmBtn.removeEventListener('click', confirmHandler);
                    modalCloseBtn.removeEventListener('click', closeHandler);
                    modal.classList.add('hidden');
                    resolve(false);
                };
                modalConfirmBtn.addEventListener('click', confirmHandler);
                modalCloseBtn.addEventListener('click', closeHandler);
            });
        } else {
            modalConfirmBtn.classList.add('hidden');
            return new Promise((resolve) => {
                const closeHandler = () => {
                    modalCloseBtn.removeEventListener('click', closeHandler);
                    modal.classList.add('hidden');
                    resolve();
                };
                modalCloseBtn.addEventListener('click', closeHandler);
            });
        }
    };
    
    // --- API & Core Logic ---
    const renderDomains = async () => {
        try {
            const res = await mailjs.getDomains();
            if (res.status) {
                domainSelect.innerHTML = ''; // Clear previous options
                res.data.forEach(domain => {
                    const option = document.createElement('option');
                    option.value = domain.domain;
                    option.textContent = `@${domain.domain}`;
                    domainSelect.appendChild(option);
                });
            } else {
                showModal('Failed to load domains.');
            }
        } catch (error) {
            console.error('Error fetching domains:', error);
            showModal('An error occurred while fetching domains.');
        }
    };

    const createAccount = async (username, password, domain) => {
        showView('loading');
        try {
            const registerRes = await mailjs.register(username + '@' + domain, password);
            if (registerRes.status) {
                const loginRes = await mailjs.login(username + '@' + domain, password);
                if (loginRes.status) {
                     currentAccount = {
                        address: username + '@' + domain,
                        password: password,
                        token: loginRes.data.token,
                        id: loginRes.data.id
                    };
                    localStorage.setItem('account', JSON.stringify(currentAccount));
                    await postLoginSetup();
                } else {
                    showModal('Login failed after registration. Please try again.');
                    showView('account-forms');
                }
            } else {
                showModal(`Registration failed: ${registerRes.message}. Please try a different username.`);
                showView('account-forms');
            }
        } catch (error) {
            console.error('Error creating account:', error);
            showModal('An error occurred while creating the account.');
            showView('account-forms');
        }
    };

    const createRandomAccount = async () => {
        showView('loading');
        try {
            const res = await mailjs.createOneAccount();
            if (res.status) {
                currentAccount = {
                    address: res.data.username,
                    password: res.data.password,
                    token: res.data.token,
                    id: res.data.id
                };
                localStorage.setItem('account', JSON.stringify(currentAccount));
                await postLoginSetup();
            } else {
                showModal('Failed to create a random account.');
                showView('account-forms');
            }
        } catch (error) {
            console.error('Error creating random account:', error);
            showModal('An error occurred while creating a random account.');
            showView('account-forms');
        }
    };

    const loginWithStoredAccount = async () => {
        showView('loading');
        const storedAccount = JSON.parse(localStorage.getItem('account'));
        if (storedAccount && storedAccount.token) {
            try {
                mailjs.token = storedAccount.token;
                mailjs.id = storedAccount.id;
                const loginRes = await mailjs.loginWithToken(storedAccount.token);
                if (loginRes.status) {
                    currentAccount = storedAccount;
                    await postLoginSetup();
                } else {
                    // Token expired or invalid, fall back to forms
                    showModal('Your session has expired. Please create a new email.');
                    localStorage.removeItem('account');
                    showView('account-forms');
                }
            } catch (error) {
                console.error('Error logging in with token:', error);
                showModal('An error occurred. Please create a new email.');
                localStorage.removeItem('account');
                showView('account-forms');
            }
        }else if (storedAccount && storedAccount.address && storedAccount.password ) {
            try {
                const loginRes = await mailjs.login(storedAccount.address, storedAccount.password);
                if (loginRes.status) {
                    loginRes.data = loginRes.data || {};
                    loginRes.data.address = storedAccount.address;
                    loginRes.data.password = storedAccount.password;
                    currentAccount = loginRes.data;
                    mailjs.token = currentAccount.token || null;
                    mailjs.id = currentAccount.id || null;
                    await postLoginSetup();
                } else {
                    // Token expired or invalid, fall back to forms
                    showModal('Your stored credential are wrong! Please create a new email.');
                    localStorage.removeItem('account');
                    showView('account-forms');
                }
            } catch (error) {
                console.error('Error logging in with token:', error);
                showModal('An error occurred. Please create a new email.');
                localStorage.removeItem('account');
                showView('account-forms');
            }
        } else {
            createRandomBtn.click();
            //showView('account-forms');
        }
    };

    const postLoginSetup = async () => {
        currentEmailSpan.textContent = currentAccount.address;
        await refreshInbox();
        setupEventListeners();
        showView('inbox');
    };

    const setupEventListeners = () => {
        if (!isListening) {
            if (Notification.permission !== 'granted') {
                Notification.requestPermission();
            }
             // Event listener for new messages
            mailjs.on('arrive', async (message) => {
                console.log('New message arrived:', message);
                // Fetch the full message to get all details before storing
                const fullMessageRes = await mailjs.getMessage(message.id);
                if(fullMessageRes.status) {
                    await addMessageToDb(fullMessageRes.data);
                    await renderInboxFromDb();
                    if (Notification.permission === 'granted') {
                        new Notification(`New Email from ${fullMessageRes.data.from.name || fullMessageRes.data.from.address}`, {
                            body: fullMessageRes.data.subject,
                            icon: 'https://placehold.co/192x192/1e293b/a5b4fc?text=T'
                        });
                    }
                }
            });
            isListening = true;
        }
    };
    
    const stopEventListeners = () => {
        if (isListening) {
            mailjs.off();
            isListening = false;
        }
    };

    const refreshInbox = async () => {
        refreshSpinner.classList.remove('hidden');
        refreshText.textContent = 'Refreshing...';
        
        try {
            // First, render existing messages from IndexedDB for a quick update
            await renderInboxFromDb();
            
            const apiRes = await mailjs.getMessages();
            const apiMessages = apiRes.status ? apiRes.data : [];
            
            // Fetch messages from DB to compare
            const dbMessages = await getMessagesFromDb();
            const dbMessageIds = new Set(dbMessages.map(m => m.id));

            // Find new messages from API that are not in the DB
            const newMessages = apiMessages.filter(msg => !dbMessageIds.has(msg.id));

            // Fetch full details for each new message and add to DB
            for (const newMessage of newMessages) {
                const fullMessageRes = await mailjs.getMessage(newMessage.id);
                if (fullMessageRes.status) {
                    await addMessageToDb(fullMessageRes.data);
                }
            }
            
            // Re-render the inbox with all messages from the DB
            await renderInboxFromDb();

        } catch (error) {
            console.error('Error refreshing inbox:', error);
            showModal('An error occurred while refreshing the inbox.');
        } finally {
            refreshSpinner.classList.add('hidden');
            refreshText.textContent = 'Refresh Inbox';
        }
    };
    
    const renderInboxFromDb = async () => {
        inboxList.innerHTML = '';
        currentMessages = await getMessagesFromDb();
        if (currentMessages.length > 0) {
            noMessagesDiv.classList.add('hidden');
            // Sort messages by date descending
            currentMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            currentMessages.forEach(message => {
                const messageDiv = document.createElement('div');
                const isSeen = message.seen;
                const hasAttachments = message.hasAttachments;
                const isFlagged = message.flagged;
                messageDiv.className = `p-4 rounded-xl shadow-md cursor-pointer transition-colors border-l-4 ${isSeen ? 'bg-gray-700 text-gray-400 hover:bg-gray-600 border-gray-500' : 'bg-indigo-600 text-white hover:bg-indigo-500 border-indigo-400'}`;
                messageDiv.innerHTML = `
                    <div class="flex justify-between items-center">
                        <h4 class="font-bold text-lg truncate">${message.subject || '(no subject)'}</h4>
                        <div class="flex-shrink-0 flex items-center space-x-2">
                            ${isFlagged ? `<svg class="w-4 h-4 text-yellow-400" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 5.5l-5 5-5-5"></path><path d="M21 16V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z"></path></svg>` : ''}
                            ${!isSeen ? '<span class="text-sm text-yellow-300 font-semibold mr-2">New</span>' : ''}
                            ${hasAttachments ? `<svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 5.5l-5 5-5-5"></path><path d="M21 16V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z"></path></svg>` : ''}
                        </div>
                    </div>
                    <p class="text-sm mt-1">From: ${message.from.name || message.from.address}</p>
                    <p class="text-xs mt-1 truncate">${message.intro || 'No preview available.'}</p>
                `;
                messageDiv.onclick = () => viewMessage(message.id);
                inboxList.appendChild(messageDiv);
            });
        } else {
            noMessagesDiv.classList.remove('hidden');
        }
    };

    const viewMessage = async (messageId) => {
        showView('loading');
        try {
            // Get message from IndexedDB
            let message = currentMessages.find(msg => msg.id === messageId);
            if (!message) {
                showModal('Message not found in local cache. Trying to fetch from server...');
                const res = await mailjs.getMessage(messageId);
                if (res.status) {
                    message = res.data;
                    await updateMessageInDb(message);
                } else {
                    showModal('Failed to retrieve message.');
                    showView('inbox');
                    return;
                }
            }
            
            messageSubject.textContent = message.subject || '(no subject)';
            messageFrom.textContent = `${message.from.name || ''} <${message.from.address}>`.trim();
            messageTo.textContent = message.to.map(t => `<${t.address}>`).join(', ');

            // Safely render HTML body in an iframe
            const iframeDoc = messageBodyIframe.contentDocument || messageBodyIframe.contentWindow.document;
            iframeDoc.open();
            iframeDoc.write(message.html ? message.html.join('') : `<pre>${message.text}</pre>`);
            iframeDoc.close();

            // Handle attachments
            if (message.hasAttachments && message.attachments && message.attachments.length > 0) {
                attachmentsContainer.classList.remove('hidden');
                attachmentsList.innerHTML = '';
                message.attachments.forEach(attachment => {
                    const attachmentLink = document.createElement('a');
                    attachmentLink.href = attachment.downloadUrl;
                    attachmentLink.className = 'px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded-lg text-xs transition-colors';
                    attachmentLink.textContent = attachment.filename;
                    attachmentLink.download = attachment.filename;
                    attachmentsList.appendChild(attachmentLink);
                });
            } else {
                attachmentsContainer.classList.add('hidden');
            }

            // Mark message as seen
            if (!message.seen) {
                await mailjs.setMessageSeen(messageId, true);
                message.seen = true;
                await updateMessageInDb(message);
                await renderInboxFromDb();
            }

            // Bind actions
            openInWindowBtn.onclick = () => openMessageInNewWindow(message);
            downloadSourceBtn.onclick = () => downloadMessageSource(messageId);
            deleteMessageBtn.onclick = () => deleteMessage(messageId);
            showView('message');
        } catch (error) {
            console.error('Error viewing message:', error);
            showModal('An error occurred while viewing the message.');
            showView('inbox');
        }
    };
    
    const openMessageInNewWindow = (message) => {
        const win = window.open('', '_blank');
        const doc = win.document;
        doc.open();
        doc.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${message.subject || 'Email'}</title>
                <style>body{font-family: sans-serif; margin: 20px;}</style>
            </head>
            <body>
                <h1>${message.subject || '(no subject)'}</h1>
                <p><strong>From:</strong> ${message.from.name || ''} &lt;${message.from.address}&gt;</p>
                <p><strong>To:</strong> ${message.to.map(t => `&lt;${t.address}&gt;`).join(', ')}</p>
                <hr>
                ${message.html ? message.html.join('') : `<pre>${message.text}</pre>`}
            </body>
            </html>
        `);
        doc.close();
    };

    const downloadMessageSource = async (messageId) => {
        try {
            const res = await mailjs.getSource(messageId);
            if (res.status) {
                const blob = new Blob([res.data], { type: 'message/rfc822' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `email_${messageId}.eml`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } else {
                showModal('Failed to download message source.');
            }
        } catch (error) {
            console.error('Error downloading source:', error);
            showModal('An error occurred while downloading the source.');
        }
    };

    const deleteMessage = async (messageId) => {
        const confirmed = await showModal('Are you sure you want to delete this message?', true);
        if (confirmed) {
            showView('loading');
            try {
                const res = await mailjs.deleteMessage(messageId);
                if (res.status) {
                    await deleteMessageFromDb(messageId);
                    showModal('Message deleted successfully.');
                    await renderInboxFromDb();
                    showView('inbox');
                } else {
                    showModal('Failed to delete message.');
                    showView('message');
                }
            } catch (error) {
                console.error('Error deleting message:', error);
                showModal('An error occurred while deleting the message.');
                showView('message');
            }
        }
    };

    const deleteAccount = async () => {
        const confirmed = await showModal('Are you sure you want to delete your account? This action cannot be undone.', true);
        if (confirmed) {
            showView('loading');
            try {
                const res = await mailjs.deleteMe();
                if (res.status) {
                    currentAccount = null;
                    localStorage.removeItem('account');
                    await clearMessagesDb();
                    stopEventListeners();
                    inboxList.innerHTML = '';
                    showModal('Account deleted successfully.');
                    showView('account-forms');
                } else {
                    showModal('Failed to delete account.');
                    showView('inbox');
                }
            } catch (error) {
                console.error('Error deleting account:', error);
                showModal('An error occurred while deleting the account.');
                showView('inbox');
            }
        }
    };

    // --- Event Listeners for UI Actions ---
    createRandomBtn.addEventListener('click', createRandomAccount);
    createCustomBtn.addEventListener('click', () => {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        const domain = domainSelect.value;
        if (username && password) {
            createAccount(username, password, domain);
        } else {
            showModal('Please enter a username and password.');
        }
    });
    copyEmailBtn.addEventListener('click', () => {
        if (currentAccount && currentAccount.address) {
            try {
                navigator.clipboard.writeText(currentAccount.address).then(() => {
                    //showModal('Email address copied to clipboard!');
                    copySucceed.classList.remove('hidden');
                    setTimeout(()=>{copySucceed.classList.add('hidden');},1500);
                }).catch(err => {
                    const tempInput = document.createElement('input');
                    tempInput.value = currentAccount.address;
                    document.body.appendChild(tempInput);
                    tempInput.select();
                    document.execCommand('copy');
                    document.body.removeChild(tempInput);
                    //showModal('Email address copied to clipboard!');
                    copySucceed.classList.remove('hidden');
                    setTimeout(()=>{copySucceed.classList.add('hidden');},1500);
                });
            } catch (error) {
                //showModal('Failed to copy. Please copy manually.');
                copyFailed.classList.remove('hidden');
                setTimeout(()=>{copyFailed.classList.add('hidden');},2500);
            }
        }
    });
    refreshBtn.addEventListener('click', refreshInbox);
    changeEmailBtn.addEventListener('click', () => {
        showModal('This will create a new random email and delete the current one. Are you sure?', true).then(confirmed => {
            if (confirmed) {
                deleteAccount().then(() => {
                    createRandomAccount();
                });
            }
        });
    });
    deleteBtn.addEventListener('click', deleteAccount);
    backToInboxBtn.addEventListener('click', () => showView('inbox'));
    
    // --- Initial Setup ---
    await openDatabase();
    renderDomains();
    loginWithStoredAccount();
});
