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
                lastRealPing = rawVisitorPing; // Store for real-time ping updates
                
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

    // --- 13. LUCKY WHEEL SYSTEM ---
    const wheelCanvas = document.getElementById('wheel-canvas');
    const wheelSpinBtn = document.getElementById('wheel-spin-btn');
    const spinUsername = document.getElementById('spin-username');
    const spinCheckBtn = document.getElementById('spin-check-btn');
    const spinStatusMessage = document.getElementById('spin-status-message');

    if (wheelCanvas) {
        const ctx = wheelCanvas.getContext('2d');
        const slices = [
            { text: "5,000$", value: 5000, color: "#ff3366" },
            { text: "1,000$", value: 1000, color: "#9933ff" },
            { text: "2,000$", value: 2000, color: "#00ffff" },
            { text: "1,500$", value: 1500, color: "#3366ff" },
            { text: "3,000$", value: 3000, color: "#ff9900" },
            { text: "2,500$", value: 2500, color: "#33cc33" }
        ];
        
        let startAngle = 0;
        const numSlices = slices.length;
        const sliceAngle = (2 * Math.PI) / numSlices;
        
        // Draw the wheel
        const drawWheel = (currentAngle = 0) => {
            const size = wheelCanvas.width;
            const center = size / 2;
            const radius = center - 10;
            
            ctx.clearRect(0, 0, size, size);
            
            // Draw Slices
            for (let i = 0; i < numSlices; i++) {
                const angle = currentAngle + i * sliceAngle;
                
                // Draw arc slice
                ctx.beginPath();
                ctx.moveTo(center, center);
                ctx.arc(center, center, radius, angle, angle + sliceAngle);
                ctx.closePath();
                ctx.fillStyle = slices[i].color;
                ctx.fill();
                
                // Add a subtle border to slices
                ctx.strokeStyle = "rgba(11, 12, 16, 0.5)";
                ctx.lineWidth = 3;
                ctx.stroke();
                
                // Draw text
                ctx.save();
                ctx.translate(center, center);
                ctx.rotate(angle + sliceAngle / 2);
                ctx.textAlign = "right";
                ctx.fillStyle = "#ffffff";
                // Add shadow text
                ctx.shadowColor = "rgba(0,0,0,0.8)";
                ctx.shadowBlur = 6;
                ctx.font = "bold 20px 'Outfit', sans-serif";
                ctx.fillText(slices[i].text, radius - 30, 8);
                ctx.restore();
            }
            
            // Draw outer neon border
            ctx.beginPath();
            ctx.arc(center, center, radius, 0, 2 * Math.PI);
            ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
            ctx.lineWidth = 8;
            ctx.stroke();
            
            // Draw center cap
            ctx.beginPath();
            ctx.arc(center, center, 28, 0, 2 * Math.PI);
            ctx.fillStyle = "#0b0c10";
            ctx.fill();
            ctx.strokeStyle = "#8a2be2";
            ctx.lineWidth = 4;
            ctx.stroke();
            
            // Neon glow inside center
            ctx.beginPath();
            ctx.arc(center, center, 8, 0, 2 * Math.PI);
            ctx.fillStyle = "#00e5ff";
            ctx.fill();
        };
        
        // Initial draw
        drawWheel(0);
        
        // Dynamic API URL state
        let apiBaseUrl = "";
        const tunnelKey = "imduongp_smp_6bc0b48d";
        
        // Retrieve the current active Cloudflare tunnel URL from KVDB
        const fetchTunnelUrl = async () => {
            try {
                const res = await fetch(`https://kvdb.io/${tunnelKey}/tunnel_url`, { cache: 'no-store' });
                if (res.ok) {
                    apiBaseUrl = (await res.text()).trim();
                    console.log("KVDB Tunnel API URL retrieved successfully: " + apiBaseUrl);
                } else {
                    console.warn("KVDB tunnel URL read returned status " + res.status);
                }
            } catch (err) {
                console.error("Failed to read dynamic tunnel URL: ", err);
            }
        };
        
        // Fetch tunnel URL on startup
        fetchTunnelUrl();
        // Periodically refresh tunnel URL every 60 seconds in case server restarted
        setInterval(fetchTunnelUrl, 60000);
        
        let isSpinning = false;
        
        // Spin verification
        const checkSpinStatus = async () => {
            const username = spinUsername.value.trim();
            if (!username) {
                showSpinMessage("Vui lòng nhập tên nhân vật!", "error");
                return false;
            }
            
            if (!apiBaseUrl) {
                showSpinMessage("Đang kết nối tới server game... Vui lòng thử lại sau vài giây.", "loading");
                await fetchTunnelUrl();
                if (!apiBaseUrl) {
                    showSpinMessage("Không thể kết nối tới server. Vui lòng đảm bảo Server Minecraft đang chạy!", "error");
                    return false;
                }
            }
            
            showSpinMessage("Đang kiểm tra dữ liệu...", "loading");
            spinCheckBtn.disabled = true;
            
            try {
                const res = await fetch(`${apiBaseUrl}/api/status?username=${encodeURIComponent(username)}`, { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();
                    if (data.success) {
                        if (data.canSpin) {
                            showSpinMessage("Hợp lệ! Bạn có 1 lượt quay hôm nay. Bấm QUAY!", "success");
                            wheelSpinBtn.disabled = false;
                            return true;
                        } else {
                            showSpinMessage("Tài khoản này đã nhận quà hôm nay rồi! Hãy quay lại sau 00:00.", "error");
                            wheelSpinBtn.disabled = true;
                            return false;
                        }
                    } else {
                        showSpinMessage(data.message || "Lỗi kiểm tra trạng thái.", "error");
                        return false;
                    }
                } else {
                    showSpinMessage("Server phản hồi lỗi. Vui lòng thử lại.", "error");
                    return false;
                }
            } catch (err) {
                console.error(err);
                showSpinMessage("Lỗi kết nối tới server. Hãy chắc chắn server game đang ONLINE!", "error");
                return false;
            } finally {
                spinCheckBtn.disabled = false;
            }
        };
        
        // Helper to show message
        const showSpinMessage = (msg, type) => {
            spinStatusMessage.className = "spin-status-message " + type;
            spinStatusMessage.textContent = msg;
        };
        
        spinCheckBtn.addEventListener('click', checkSpinStatus);
        
        // CSS / JS Confetti Effect
        const triggerConfetti = () => {
            const confettiCount = 100;
            const colors = ['#ff3366', '#9933ff', '#00ffff', '#33cc33', '#ff9900', '#3366ff'];
            
            for (let i = 0; i < confettiCount; i++) {
                const div = document.createElement('div');
                div.className = 'confetti-particle';
                div.style.position = 'fixed';
                div.style.width = Math.random() * 8 + 5 + 'px';
                div.style.height = Math.random() * 12 + 6 + 'px';
                div.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                div.style.left = Math.random() * 100 + 'vw';
                div.style.top = '-10px';
                div.style.zIndex = '9999';
                div.style.opacity = Math.random() * 0.7 + 0.3;
                div.style.borderRadius = '2px';
                div.style.transform = `rotate(${Math.random() * 360}deg)`;
                
                document.body.appendChild(div);
                
                // Animate
                const duration = Math.random() * 3 + 2; // 2s to 5s
                const startLeft = parseFloat(div.style.left);
                const drift = (Math.random() - 0.5) * 20; // horizontal drift
                
                div.animate([
                    { top: '-10px', left: `${startLeft}vw`, transform: `rotate(0deg)` },
                    { top: '105vh', left: `${startLeft + drift}vw`, transform: `rotate(${Math.random() * 720}deg)` }
                ], {
                    duration: duration * 1000,
                    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                });
                
                setTimeout(() => {
                    div.remove();
                }, duration * 1000);
            }
        };
        
        // Spin trigger
        wheelSpinBtn.addEventListener('click', async () => {
            if (isSpinning) return;
            
            const username = spinUsername.value.trim();
            if (!username) return;
            
            isSpinning = true;
            wheelSpinBtn.disabled = true;
            spinUsername.disabled = true;
            spinCheckBtn.disabled = true;
            showSpinMessage("Đang quay...", "loading");
            
            try {
                const res = await fetch(`${apiBaseUrl}/api/claim`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: username }),
                    cache: 'no-store'
                });
                
                if (res.ok) {
                    const data = await res.json();
                    if (data.success) {
                        const rewardValue = data.reward;
                        // Find index of reward
                        const targetIndex = slices.findIndex(s => s.value === rewardValue);
                        if (targetIndex === -1) {
                            showSpinMessage("Có lỗi xảy ra khi xác định phần thưởng.", "error");
                            resetSpinState();
                            return;
                        }
                        
                        // Spin animation parameters
                        // Canvas coordinates: 0 is on the right (3 o'clock position).
                        // Pointer is at the top (12 o'clock position).
                        // To land on a slice at the top pointer, the slice's angle must rotate to 12 o'clock (1.5 * Math.PI).
                        // Formula: Pointer_Angle - (TargetSliceCenter)
                        const pointerAngle = 1.5 * Math.PI;
                        const sliceCenter = targetIndex * sliceAngle + sliceAngle / 2;
                        const targetRot = pointerAngle - sliceCenter;
                        
                        // We spin e.g. 6 full rotations plus target angle
                        const currentStart = startAngle % (2 * Math.PI);
                        const totalSpinsAngle = 6 * 2 * Math.PI + (targetRot - currentStart);
                        const duration = 4500; // 4.5 seconds
                        const startTime = performance.now();
                        
                        const animateWheel = (timestamp) => {
                            const elapsed = timestamp - startTime;
                            const progress = Math.min(elapsed / duration, 1);
                            
                            // Cubic ease-out formula
                            const easeProgress = 1 - Math.pow(1 - progress, 4);
                            const currentAngle = currentStart + totalSpinsAngle * easeProgress;
                            startAngle = currentAngle;
                            
                            drawWheel(currentAngle);
                            
                            if (progress < 1) {
                                requestAnimationFrame(animateWheel);
                            } else {
                                // Spin ended
                                showSpinMessage(`Chúc mừng ${data.username}! Bạn đã nhận được ${rewardValue.toLocaleString()}$ trực tiếp in-game!`, "success");
                                triggerConfetti();
                                isSpinning = false;
                                spinUsername.disabled = false;
                                spinCheckBtn.disabled = false;
                            }
                        };
                        
                        requestAnimationFrame(animateWheel);
                    } else {
                        showSpinMessage(data.message || "Lỗi khi quay thưởng.", "error");
                        resetSpinState();
                    }
                } else {
                    showSpinMessage("Lỗi hệ thống khi quay thưởng. Thử lại sau.", "error");
                    resetSpinState();
                }
            } catch (err) {
                console.error(err);
                showSpinMessage("Lỗi kết nối tới game server. Hãy chắc chắn server đang bật!", "error");
                resetSpinState();
            }
        });
        
        const resetSpinState = () => {
            isSpinning = false;
            wheelSpinBtn.disabled = false;
            spinUsername.disabled = false;
            spinCheckBtn.disabled = false;
        };
    }
});

