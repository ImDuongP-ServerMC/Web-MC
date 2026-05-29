/* 
   ImDuongP SMP - Ultra-Premium Client-Side Interactivity
   Features: Real-time Telemetry, Minecraft MOTD Color Code Parser,
   Spring-physics Custom Cyber Cursor with Interactive Hover States,
   Floating Space Particles, IntersectionObserver Elastic Scroll Pop-ups,
   and 3D holographic card hover physics
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
    
    // Visitor ping elements
    const visitorPingValue = document.getElementById('visitor-ping');
    const visitorPingBadge = document.getElementById('ping-badge');
    const pingIconPulse = document.getElementById('ping-icon-pulse');
    
    let isServerOnline = false;

    // --- 1. SPRING PHYSICS CUSTOM NEON CURSOR ---
    const cursorDot = document.getElementById('cursor-dot');
    const cursorCircle = document.getElementById('cursor-circle');
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let hasMoved = false;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Show cursor elements on first move
        if (!hasMoved) {
            cursorDot.style.opacity = '1';
            cursorCircle.style.opacity = '1';
            cursorX = mouseX;
            cursorY = mouseY;
            hasMoved = true;
        }
        
        // Snaps the inner glow dot instantly
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    });

    document.addEventListener('mouseleave', () => {
        cursorDot.style.opacity = '0';
        cursorCircle.style.opacity = '0';
        hasMoved = false;
    });

    // Silky smooth spring interpolation (lerp) for the outer trailing circle
    const updateCursorCircle = () => {
        if (hasMoved) {
            const dx = mouseX - cursorX;
            const dy = mouseY - cursorY;
            
            // 0.22 represents the stiffness/delay of the trailing effect (increased speed by ~1.45x)
            cursorX += dx * 0.22;
            cursorY += dy * 0.22;
            
            cursorCircle.style.left = `${cursorX}px`;
            cursorCircle.style.top = `${cursorY}px`;
        }
        
        requestAnimationFrame(updateCursorCircle);
    };
    updateCursorCircle();

    // Trigger hover visual expansions on all interactive/hoverable items
    const attachHoverStates = () => {
        const hoverables = document.querySelectorAll('a, button, .ip-box, .interactive-card, .timeline-item');
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorCircle.classList.add('hover');
                cursorDot.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursorCircle.classList.remove('hover');
                cursorDot.classList.remove('hover');
            });
        });
    };
    attachHoverStates();

    // Trigger click state
    document.addEventListener('mousedown', () => {
        cursorCircle.classList.add('click');
    });
    document.addEventListener('mouseup', () => {
        cursorCircle.classList.remove('click');
    });


    // --- 2. DYNAMIC MOUSE GLOW GLIMMER ---
    const cursorGlow = document.getElementById('cursor-glow');
    
    document.addEventListener('mousemove', (e) => {
        if (cursorGlow.style.opacity === '0' || !cursorGlow.style.opacity) {
            cursorGlow.style.opacity = '1';
        }
        cursorGlow.style.left = `${e.clientX}px`;
        cursorGlow.style.top = `${e.clientY}px`;
    });

    document.addEventListener('mouseleave', () => {
        cursorGlow.style.opacity = '0';
    });


    // --- 3. FLOATING CYBER-PARTICLES BACKGROUND ---
    const particlesContainer = document.getElementById('particles-container');
    const particleCount = 25;
    const particles = [];

    const createParticles = () => {
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 5 + 3; // 3px to 8px
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            const speedX = (Math.random() - 0.5) * 0.4;
            const speedY = (Math.random() - 0.5) * 0.4 - 0.2; // slight upward drift
            const opacity = Math.random() * 0.4 + 0.15;
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.opacity = opacity;
            
            particlesContainer.appendChild(particle);
            
            particles.push({
                element: particle,
                x,
                y,
                speedX,
                speedY,
                size,
                opacity
            });
        }
    };

    const animateParticles = () => {
        particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;
            
            if (p.x < -p.size) p.x = window.innerWidth;
            if (p.x > window.innerWidth) p.x = -p.size;
            if (p.y < -p.size) p.y = window.innerHeight;
            if (p.y > window.innerHeight) p.y = -p.size;
            
            p.element.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
        });
        
        requestAnimationFrame(animateParticles);
    };

    if (particlesContainer) {
        createParticles();
        animateParticles();
    }


    // --- 4. INTERACTIVE 3D HOLOGRAPHIC TILT EFFECT ON CARDS ---
    const interactiveCards = document.querySelectorAll('.interactive-card');
    
    interactiveCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((centerY - y) / centerY) * 10;
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });


    // --- 5. ELASTIC SCROLL POP-UP OBSERVER ---
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });


    // --- 6. MINECRAFT COLOR CODE PARSER ---
    const parseMinecraftMOTD = (motdText) => {
        if (!motdText) return "Chào mừng bạn đến với ImDuongP SMP!";
        
        const mcColors = {
            '0': '#000000',
            '1': '#0000AA',
            '2': '#00AA00',
            '3': '#00AAAA',
            '4': '#AA0000',
            '5': '#AA00AA',
            '6': '#FFAA00',
            '7': '#AAAAAA',
            '8': '#555555',
            '9': '#5555FF',
            'a': '#55FF55',
            'b': '#55FFFF',
            'c': '#FF5555',
            'd': '#FF55FF',
            'e': '#FFFF55',
            'f': '#FFFFFF'
        };
        
        let htmlResult = "";
        let currentSpans = 0;
        let isBold = false;
        
        for (let i = 0; i < motdText.length; i++) {
            if (motdText[i] === '§' && i + 1 < motdText.length) {
                const code = motdText[i + 1].toLowerCase();
                i++;
                
                if (mcColors[code]) {
                    while (currentSpans > 0) {
                        htmlResult += "</span>";
                        currentSpans--;
                    }
                    
                    const glowShadow = `text-shadow: 0 0 10px ${mcColors[code]}88;`;
                    htmlResult += `<span style="color: ${mcColors[code]}; ${glowShadow}">`;
                    currentSpans++;
                } else if (code === 'l') {
                    htmlResult += `<span style="font-weight: 800; filter: brightness(1.2);">`;
                    currentSpans++;
                    isBold = true;
                } else if (code === 'r') {
                    while (currentSpans > 0) {
                        htmlResult += "</span>";
                        currentSpans--;
                    }
                    isBold = false;
                }
            } else {
                htmlResult += motdText[i];
            }
        }
        
        while (currentSpans > 0) {
            htmlResult += "</span>";
            currentSpans--;
        }
        
        return htmlResult;
    };


    // --- 7. COPY TO CLIPBOARD LOGIC ---
    const copyIpToClipboard = () => {
        navigator.clipboard.writeText(ipAddressText).then(() => {
            copiedPopup.classList.add('show');
            
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


    // --- 8. NAVBAR SCROLL EFFECT ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbarContainer.classList.add('scrolled');
        } else {
            navbarContainer.classList.remove('scrolled');
        }
        
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


    // --- 9. MOBILE MENU TOGGLE ---
    navBurger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navBurger.classList.toggle('toggle');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navBurger.classList.remove('toggle');
        });
    });


    // --- 10. REAL-TIME SERVER TELEMETRY & VISITOR PING (mcstatus.io API) ---
    const fetchServerTelemetry = async () => {
        console.log(`Pinging Minecraft server: ${ipAddressText}...`);
        
        const startTime = performance.now();
        
        try {
            // Primary API: mcstatus.io
            let response = await fetch(`https://api.mcstatus.io/v2/status/java/${ipAddressText}`, {
                cache: 'no-store',
                headers: { 'Accept': 'application/json' }
            });
            const endTime = performance.now();
            const rawVisitorPing = Math.round(endTime - startTime);
            
            let data;
            if (response.ok) {
                data = await response.json();
            }
            
            // Fallback API: mcsrvstat.us (if primary fails or returns offline)
            if (!data || !data.online) {
                console.log('Primary API failed or returned offline, trying fallback...');
                try {
                    const fallbackResponse = await fetch(`https://api.mcsrvstat.us/3/${ipAddressText}`, {
                        cache: 'no-store'
                    });
                    if (fallbackResponse.ok) {
                        const fallbackData = await fallbackResponse.json();
                        if (fallbackData.online) {
                            // Normalize fallback data to match mcstatus.io format
                            data = {
                                online: true,
                                players: {
                                    online: fallbackData.players?.online || 0,
                                    max: fallbackData.players?.max || 20,
                                    list: fallbackData.players?.list ? fallbackData.players.list.map(p => ({
                                        name_clean: typeof p === 'string' ? p : (p.name || 'Unknown'),
                                        uuid: typeof p === 'string' ? '' : (p.uuid || '')
                                    })) : []
                                },
                                motd: {
                                    raw: fallbackData.motd?.raw ? fallbackData.motd.raw.join('\n') : '',
                                    clean: fallbackData.motd?.clean ? fallbackData.motd.clean.join(' ') : 'A Minecraft Server'
                                }
                            };
                        }
                    }
                } catch (fbErr) {
                    console.warn('Fallback API also failed:', fbErr);
                }
            }

            if (data && data.online) {
                isServerOnline = true;
                
                serverStatus.textContent = "ONLINE";
                serverStatus.classList.remove('loading', 'offline');
                serverStatus.style.color = 'var(--color-secondary)';
                cardStatusIcon.className = "card-icon status-icon-pulse online";
                
                // mcstatus.io returns motd as { raw, clean, html }
                if (data.motd && data.motd.raw) {
                    serverMotd.innerHTML = parseMinecraftMOTD(data.motd.raw);
                } else if (data.motd && data.motd.clean) {
                    serverMotd.textContent = data.motd.clean;
                } else {
                    serverMotd.textContent = "Chào mừng bạn đến với ImDuongP SMP!";
                }
                
                const currentPlayers = data.players.online;
                const maxPlayers = data.players.max;
                playerCount.innerHTML = `${currentPlayers} <span style="color: var(--text-muted); font-size: 1.25rem; font-weight: 500; margin-left: 6px;">/ ${maxPlayers}</span>`;
                
                const percent = maxPlayers > 0 ? (currentPlayers / maxPlayers) * 100 : 0;
                playerProgress.style.width = `${percent}%`;
                playerPeak.textContent = "Đã sẵn sàng kết nối. Vào chơi ngay!";
                
                updateVisitorPingDisplay(rawVisitorPing);
                
                playerList.innerHTML = '';
                // mcstatus.io returns players.list as array of { uuid, name_raw, name_clean, name_html }
                if (data.players.list && data.players.list.length > 0) {
                    data.players.list.forEach(player => {
                        const playerName = player.name_clean || player.name_raw || 'Unknown';
                        const playerUuid = player.uuid || '';
                        const playerTag = document.createElement('div');
                        playerTag.className = 'player-tag';
                        playerTag.innerHTML = `
                            <img src="https://minotar.net/avatar/${playerUuid || playerName}/32" alt="${playerName}" onerror="this.src='https://minotar.net/avatar/Steve/32'">
                            <span>${playerName}</span>
                        `;
                        playerList.appendChild(playerTag);
                    });
                } else {
                    if (currentPlayers > 0) {
                        playerList.innerHTML = `
                            <div class="empty-placeholder" style="text-align:center; color:var(--text-muted); width:100%; font-family:var(--font-mono); padding:15px 0; font-size:0.95rem;">
                                <i class="fa-solid fa-user-secret" style="color: var(--color-primary); margin-right: 8px;"></i> 
                                Đang có <strong>${currentPlayers}</strong> người chơi trực tuyến ẩn danh.
                            </div>
                        `;
                    } else {
                        playerList.innerHTML = `
                            <div class="empty-placeholder" style="text-align:center; color:var(--text-muted); width:100%; font-family:var(--font-mono); padding:15px 0; font-size:0.95rem;">
                                <i class="fa-solid fa-face-smile" style="color: var(--color-accent); margin-right: 8px;"></i> 
                                Hiện chưa có ai tham gia. Hãy là người đầu tiên!
                            </div>
                        `;
                    }
                }
                
                // Re-bind hover event listeners to newly injected dynamic elements
                attachHoverStates();
                
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
        
        visitorPingValue.textContent = "---";
        visitorPingBadge.className = "tps-badge";
        visitorPingBadge.style.background = 'rgba(255, 51, 102, 0.1)';
        visitorPingBadge.style.color = '#ff3366';
        visitorPingBadge.style.borderColor = 'rgba(255, 51, 102, 0.2)';
        visitorPingBadge.innerHTML = `<i class="fa-solid fa-xmark"></i> Mất Kết Nối`;
        pingIconPulse.className = "card-icon ping-icon offline";
        
        playerList.innerHTML = `
            <div class="empty-placeholder" style="text-align:center; color:#ff3366; width:100%; font-family:var(--font-mono); padding:15px 0; font-size:0.95rem;">
                <i class="fa-solid fa-circle-exclamation" style="margin-right: 8px;"></i> 
                Không thể lấy dữ liệu. Máy chủ hiện đang ngoại tuyến.
            </div>
        `;
        
        footerPulse.className = "pulse-indicator-small offline";
        footerStatusText.textContent = `Server Status: OFFLINE`;
    };

    // --- 11. REAL-TIME PING SYSTEM (updates every 1 second) ---
    let lastRealPing = 0;
    let pingHistory = [];
    
    const doRealPing = async () => {
        if (!isServerOnline) return;
        try {
            const startTime = performance.now();
            await fetch(`https://api.mcstatus.io/v2/status/java/${ipAddressText}`, {
                cache: 'no-store',
                headers: { 'Accept': 'application/json' }
            });
            const endTime = performance.now();
            lastRealPing = Math.round(endTime - startTime);
            pingHistory.push(lastRealPing);
            if (pingHistory.length > 10) pingHistory.shift();
        } catch (err) {
            // Silently fail
        }
    };
    
    const updatePingLive = () => {
        if (!isServerOnline || lastRealPing === 0) return;
        // Small natural fluctuation around last real ping (±8%)
        const jitter = Math.round((Math.random() - 0.5) * lastRealPing * 0.16);
        const displayPing = Math.max(1, lastRealPing + jitter);
        updateVisitorPingDisplay(displayPing);
    };

    // --- 12. TPS SIMULATION / TELEMETRY DECORATOR ---
    const startTpsTelemetry = () => {
        setInterval(() => {
            if (isServerOnline) {
                const randomFluctuation = (Math.random() * 0.08);
                const tps = (20.00 - randomFluctuation).toFixed(2);
                serverTps.textContent = tps;
                
                const tpsBadge = document.querySelector('.tps-badge');
                if (tpsBadge) {
                    tpsBadge.className = "tps-badge green";
                    tpsBadge.style = "";
                    tpsBadge.innerHTML = `<i class="fa-solid fa-shield-halved"></i> Tuyệt vời`;
                }
            }
        }, 3000);
    };

    // --- INITIALIZE & ATTACH POLLERS ---
    fetchServerTelemetry();
    startTpsTelemetry();
    
    // Full telemetry refresh every 30 seconds
    setInterval(fetchServerTelemetry, 30000);
    
    // Real API ping every 5 seconds
    setInterval(doRealPing, 5000);
    
    // Visual ping update every 1 second (smooth live feel)
    setInterval(updatePingLive, 1000);
});
