/* 
   ImDuongP SMP - Client-Side Interactive & Telemetry Script
   Integrates with Public Minecraft API to show real-time stats
*/

document.addEventListener('DOMContentLoaded', () => {
    // --- VARIABLES & SELECTORS ---
    const ipAddressText = "wrought-whiff.gl.joinmc.link";
    const ipBox = document.getElementById('ip-box');
    const copyBtn = document.getElementById('copy-btn');
    const copiedPopup = document.getElementById('copied-popup');
    const navbarContainer = document.querySelector('.navbar-container');
    const navLinks = document.querySelectorAll('.nav-link');
    const navBurger = document.querySelector('.nav-burger');
    const navMenu = document.querySelector('.nav-menu');
    
    // Telemetry DOM elements
    const serverStatus = document.getElementById('server-status');
    const serverMotd = document.getElementById('server-motd');
    const playerCount = document.getElementById('player-count');
    const playerProgress = document.getElementById('player-progress');
    const playerPeak = document.getElementById('player-peak');
    const serverTps = document.getElementById('server-tps');
    const cardStatusIcon = document.querySelector('.status-icon-pulse');
    const playerList = document.getElementById('player-list');
    const footerStatusText = document.getElementById('footer-status-text');
    const footerPulse = document.getElementById('footer-pulse');
    
    // New visitor ping elements
    const visitorPingValue = document.getElementById('visitor-ping');
    const visitorPingBadge = document.getElementById('ping-badge');
    const pingIconPulse = document.getElementById('ping-icon-pulse');
    
    let isServerOnline = false;

    // --- 1. COPY TO CLIPBOARD LOGIC ---
    const copyIpToClipboard = () => {
        navigator.clipboard.writeText(ipAddressText).then(() => {
            // Show custom toast notification
            copiedPopup.classList.add('show');
            
            // Temporary button text update
            const originalBtnContent = copyBtn.innerHTML;
            copyBtn.innerHTML = `<i class="fa-solid fa-check"></i> Đã chép`;
            copyBtn.style.background = 'linear-gradient(135deg, #00ff7f, #00b359)';
            copyBtn.style.color = '#000';
            
            setTimeout(() => {
                copiedPopup.classList.remove('show');
                copyBtn.innerHTML = originalBtnContent;
                copyBtn.style.background = '';
                copyBtn.style.color = '';
            }, 2000);
        }).catch(err => {
            console.error('Không thể sao chép IP: ', err);
        });
    };

    ipBox.addEventListener('click', copyIpToClipboard);

    // --- 2. NAVBAR SCROLL EFFECT ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbarContainer.classList.add('scrolled');
        } else {
            navbarContainer.classList.remove('scrolled');
        }
        
        // Active link tracking on scroll
        let currentSectionId = "";
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // --- 3. MOBILE MENU TOGGLE ---
    navBurger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navBurger.classList.toggle('toggle');
    });

    // Close mobile menu on clicking any link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navBurger.classList.remove('toggle');
        });
    });

    // --- 4. REAL-TIME SERVER TELEMETRY & VISITOR PING (API PING) ---
    const fetchServerTelemetry = async () => {
        console.log(`Pinging Minecraft server: ${ipAddressText}...`);
        
        // Start high-resolution timer to measure client-to-server request delay
        const startTime = performance.now();
        
        try {
            // Fetch status data from robust public MCSrvStat API
            const response = await fetch(`https://api.mcsrvstat.us/2/${ipAddressText}`);
            
            // End timer on response
            const endTime = performance.now();
            const rawVisitorPing = Math.round(endTime - startTime);
            
            if (!response.ok) throw new Error('Mạng bị lỗi hoặc API giới hạn yêu cầu.');
            
            const data = await response.json();
            
            if (data.online) {
                isServerOnline = true;
                
                // Update online status card
                serverStatus.textContent = "ONLINE";
                serverStatus.classList.remove('loading', 'offline');
                serverStatus.style.color = 'var(--color-secondary)';
                cardStatusIcon.className = "card-icon status-icon-pulse online";
                
                // Update MOTD
                if (data.motd && data.motd.clean) {
                    serverMotd.textContent = data.motd.clean.join(' ');
                } else {
                    serverMotd.textContent = "Chào mừng bạn đến với ImDuongP SMP!";
                }
                
                // Update Player Count
                const currentPlayers = data.players.online;
                const maxPlayers = data.players.max;
                playerCount.innerHTML = `${currentPlayers} <span style="color: var(--text-muted); font-size: 1.25rem; font-weight: 500; margin-left: 6px;">/ ${maxPlayers}</span>`;
                
                // Animate progress bar
                const percent = maxPlayers > 0 ? (currentPlayers / maxPlayers) * 100 : 0;
                playerProgress.style.width = `${percent}%`;
                playerPeak.textContent = "Đã sẵn sàng kết nối. Vào chơi ngay!";
                
                // Update Visitor Ping telemetry
                updateVisitorPingDisplay(rawVisitorPing);
                
                // Display Online Player Names & Avatars
                playerList.innerHTML = ''; // clear previous
                if (data.players.list && data.players.list.length > 0) {
                    data.players.list.forEach(player => {
                        const playerTag = document.createElement('div');
                        playerTag.className = 'player-tag';
                        playerTag.innerHTML = `
                            <img src="https://minotar.net/avatar/${player}/32" alt="${player}" onerror="this.src='https://minotar.net/avatar/Steeve/32'">
                            <span>${player}</span>
                        `;
                        playerList.appendChild(playerTag);
                    });
                } else {
                    // Check if player count is more than zero but names list is hidden (query=false)
                    if (currentPlayers > 0) {
                        playerList.innerHTML = `
                            <div class="empty-placeholder" style="text-align:center; color:var(--text-muted); width:100%; font-family:var(--font-mono); padding:10px 0; font-size:0.95rem;">
                                <i class="fa-solid fa-user-secret" style="color: var(--color-primary); margin-right: 8px;"></i> 
                                Đang có <strong>${currentPlayers}</strong> người chơi trực tuyến ẩn danh.
                            </div>
                        `;
                    } else {
                        playerList.innerHTML = `
                            <div class="empty-placeholder" style="text-align:center; color:var(--text-muted); width:100%; font-family:var(--font-mono); padding:10px 0; font-size:0.95rem;">
                                <i class="fa-solid fa-face-smile" style="color: var(--color-accent); margin-right: 8px;"></i> 
                                Hiện chưa có ai tham gia. Hãy là người đầu tiên!
                            </div>
                        `;
                    }
                }
                
                // Update Footer indicator
                footerPulse.className = "pulse-indicator-small online";
                footerStatusText.textContent = `Server Status: ONLINE (${currentPlayers}/${maxPlayers})`;
                
            } else {
                handleOfflineState();
            }
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu server: ', error);
            handleOfflineState();
        }
    };

    const updateVisitorPingDisplay = (pingValue) => {
        visitorPingValue.textContent = `${pingValue} ms`;
        pingIconPulse.className = "card-icon ping-icon online";
        
        // Reset dynamic badge styling
        visitorPingBadge.className = "tps-badge";
        visitorPingBadge.style = "";
        
        if (pingValue < 80) {
            visitorPingBadge.classList.add('green');
            visitorPingBadge.innerHTML = `<i class="fa-solid fa-gauge-high"></i> Cực Tốt`;
        } else if (pingValue < 200) {
            visitorPingBadge.style.background = 'rgba(0, 229, 255, 0.1)';
            visitorPingBadge.style.color = 'var(--color-accent)';
            visitorPingBadge.style.borderColor = 'rgba(0, 229, 255, 0.2)';
            visitorPingBadge.innerHTML = `<i class="fa-solid fa-gauge"></i> Ổn Định`;
        } else {
            visitorPingBadge.style.background = 'rgba(255, 193, 7, 0.1)';
            visitorPingBadge.style.color = '#ffc107';
            visitorPingBadge.style.borderColor = 'rgba(255, 193, 7, 0.2)';
            visitorPingBadge.innerHTML = `<i class="fa-solid fa-gauge-low"></i> Trễ Cao`;
        }
    };

    const handleOfflineState = () => {
        isServerOnline = false;
        
        serverStatus.textContent = "OFFLINE";
        serverStatus.classList.remove('loading');
        serverStatus.classList.add('offline');
        serverStatus.style.color = '#ff3366';
        
        cardStatusIcon.className = "card-icon status-icon-pulse offline";
        serverMotd.textContent = "Máy chủ hiện đang bảo trì hoặc đang tắt.";
        
        playerCount.innerHTML = `0 <span style="color: var(--text-muted); font-size: 1.25rem; font-weight: 500; margin-left: 6px;">/ 0</span>`;
        playerProgress.style.width = "0%";
        playerPeak.textContent = "Vui lòng quay lại sau.";
        
        serverTps.textContent = "0.00";
        const tpsBadge = document.querySelector('.tps-badge');
        if (tpsBadge) {
            tpsBadge.className = "tps-badge";
            tpsBadge.style.background = 'rgba(255, 51, 102, 0.1)';
            tpsBadge.style.color = '#ff3366';
            tpsBadge.style.borderColor = 'rgba(255, 51, 102, 0.2)';
            tpsBadge.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Đang tắt`;
        }
        
        // Handle visitor ping offline state
        visitorPingValue.textContent = "---";
        visitorPingBadge.className = "tps-badge";
        visitorPingBadge.style.background = 'rgba(255, 51, 102, 0.1)';
        visitorPingBadge.style.color = '#ff3366';
        visitorPingBadge.style.borderColor = 'rgba(255, 51, 102, 0.2)';
        visitorPingBadge.innerHTML = `<i class="fa-solid fa-xmark"></i> Mất Kết Nối`;
        pingIconPulse.className = "card-icon ping-icon offline";
        
        // Set offline message to player list
        playerList.innerHTML = `
            <div class="empty-placeholder" style="text-align:center; color:#ff3366; width:100%; font-family:var(--font-mono); padding:10px 0; font-size:0.95rem;">
                <i class="fa-solid fa-circle-exclamation" style="margin-right: 8px;"></i> 
                Không thể lấy dữ liệu. Máy chủ hiện đang ngoại tuyến.
            </div>
        `;
        
        footerPulse.className = "pulse-indicator-small offline";
        footerStatusText.textContent = `Server Status: OFFLINE`;
    };

    // --- 5. TPS SIMULATION / TELEMETRY DECORATOR ---
    // Simulates natural micro fluctuations in TPS for aesthetic authenticity
    const startTpsTelemetry = () => {
        setInterval(() => {
            if (isServerOnline) {
                // Fluctuates slightly between 19.92 and 20.00 which is normal for highly optimized paper servers
                const randomFluctuation = (Math.random() * 0.08);
                const tps = (20.00 - randomFluctuation).toFixed(2);
                serverTps.textContent = tps;
                
                const tpsBadge = document.querySelector('.tps-badge');
                if (tpsBadge) {
                    tpsBadge.className = "tps-badge green";
                    tpsBadge.style = ""; // reset offline overrides
                    tpsBadge.innerHTML = `<i class="fa-solid fa-shield-halved"></i> Tuyệt vời`;
                }
            }
        }, 3000);
    };

    // --- INITIALIZE & ATTACH POLLERS ---
    fetchServerTelemetry();
    startTpsTelemetry();
    
    // Auto-refresh telemetry dashboard every 30 seconds
    setInterval(fetchServerTelemetry, 30000);
});
