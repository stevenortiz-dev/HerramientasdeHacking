
document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 0. INTRO VIDEO (PRE-LOADER / SPLASH SCREEN)
    // ==========================================
    function initVideoIntro() {
        const container = document.getElementById('video-intro-container');
        const video = document.getElementById('intro-video');
        const skipBtn = document.getElementById('skip-intro');

        if (!container || !video) {
            document.body.classList.remove('intro-active');
            return;
        }

        let isFinalized = false;

        function finalizeIntro() {
            if (isFinalized) return;
            isFinalized = true;

            document.body.classList.remove('intro-active');
            document.body.classList.add('is-loaded');
            container.classList.add('fade-out');

            try {
                video.pause();
            } catch (e) {}

            setTimeout(() => {
                if (container && container.parentNode) {
                    container.parentNode.removeChild(container);
                }
            }, 850);
        }

        // Try playing video immediately
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch((err) => {
                console.log("[Intro] Autoplay prevented or awaiting user interaction:", err);
            });
        }

        // Skip button
        if (skipBtn) {
            skipBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                finalizeIntro();
            });
        }

        // Click anywhere on container to skip intro
        container.addEventListener('click', () => {
            finalizeIntro();
        });

        // When video finishes, finalize intro
        video.addEventListener('ended', finalizeIntro);
        video.addEventListener('error', finalizeIntro);

        // Escape or Space key skips intro
        function handleKeySkip(e) {
            if (!isFinalized && (e.key === 'Escape' || e.key === 'Enter' || e.code === 'Space')) {
                e.preventDefault();
                finalizeIntro();
                window.removeEventListener('keydown', handleKeySkip);
            }
        }
        window.addEventListener('keydown', handleKeySkip);

        // Failsafe timeout: 7 seconds maximum
        setTimeout(() => {
            if (!isFinalized) {
                finalizeIntro();
            }
        }, 7000);
    }

    initVideoIntro();

    let securityToastTimer = null;
    function showSecurityBlockMessage() {
        let toast = document.getElementById('security-toast-notification');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'security-toast-notification';
            toast.className = 'security-toast-alert';
            toast.innerHTML = `
                <div class="security-toast-icon">🛡️</div>
                <div class="security-toast-content">
                    <div class="security-toast-title">Acceso Bloqueado · Seguridad</div>
                    <div class="security-toast-message">La inspección de código y las herramientas de desarrollo están restringidas.</div>
                </div>
            `;
            document.body.appendChild(toast);
        }

        toast.classList.remove('show');
        void toast.offsetWidth;
        toast.classList.add('show');

        if (securityToastTimer) clearTimeout(securityToastTimer);
        securityToastTimer = setTimeout(() => {
            toast.classList.remove('show');
        }, 2800);
    }

    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showSecurityBlockMessage();
        return false;
    }, true);

    window.addEventListener('keydown', (e) => {
        if (e.key === 'F12' || e.keyCode === 123) {
            e.preventDefault();
            e.stopPropagation();
            showSecurityBlockMessage();
            return false;
        }

        if ((e.ctrlKey || e.metaKey) && (e.shiftKey || e.altKey) && (
            e.key === 'I' || e.key === 'i' || e.keyCode === 73 ||
            e.key === 'J' || e.key === 'j' || e.keyCode === 74 ||
            e.key === 'C' || e.key === 'c' || e.keyCode === 67
        )) {
            e.preventDefault();
            e.stopPropagation();
            showSecurityBlockMessage();
            return false;
        }

        if ((e.ctrlKey || e.metaKey) && (
            e.key === 'u' || e.key === 'U' || e.keyCode === 85 ||
            e.key === 's' || e.key === 'S' || e.keyCode === 83
        )) {
            e.preventDefault();
            e.stopPropagation();
            showSecurityBlockMessage();
            return false;
        }
    }, true);

    const codeCanvas = document.getElementById('hacker-code-canvas');
    if (codeCanvas) {
        const ctx = codeCanvas.getContext('2d');
        let width = codeCanvas.width = window.innerWidth;
        let height = codeCanvas.height = window.innerHeight;

        const CYBER_CODE_TOKENS = [
            '0x7ffeefbff610', 'nmap -sS -p- 192.168.1.1', 'bettercap arp.spoof on',
            'wireshark -k -i eth0', 'eth0 promisc', 'POST /auth/login.php HTTP/1.1',
            'TLSv1.3 Handshake', 'AES_256_GCM_SHA384', 'SYN/ACK seq=1042 win=65535',
            'DAI: arp inspection passed', 'DHCP snooping active', 'CVE-2023-38408 CRITICAL',
            'pcap_open_live(eth0, 65535, 1)', 'iptables -A FORWARD -j DROP',
            '00 50 56 c0 00 08 45 00', '48 89 e5 48 83 ec 10', 'xor eax, eax; ret',
            'port 22 open (SSH)', 'port 443 open (TLS)', 'port 80 open (HTTP)',
            'RFC 826 ARP Protocol', 'MAC AA:BB:CC:11:22:33', 'MAC DE:AD:BE:EF:00:10'
        ];

        const CHARS = '0123456789ABCDEFabcdef!@#$%^&*()_+-=[]{}|;:<>?~/\\~';
        const fontSize = 13;
        const colWidth = 22;
        let columns = Math.floor(width / colWidth);
        let drops = [];
        let colTokens = [];
        let colSpeeds = [];

        function initColumns() {
            width = codeCanvas.width = window.innerWidth;
            height = codeCanvas.height = window.innerHeight;
            columns = Math.floor(width / colWidth);
            drops = [];
            colTokens = [];
            colSpeeds = [];
            for (let i = 0; i < columns; i++) {
                drops[i] = Math.floor(Math.random() * (height / fontSize));
                colTokens[i] = CYBER_CODE_TOKENS[Math.floor(Math.random() * CYBER_CODE_TOKENS.length)];
                colSpeeds[i] = 0.8 + (i % 3) * 0.2;
            }
        }

        initColumns();
        window.addEventListener('resize', initColumns);

        function drawAmbientStreams() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
            ctx.fillRect(0, 0, width, height);

            ctx.font = `${fontSize}px 'SF Mono', 'SFMono-Regular', Consolas, monospace`;

            for (let i = 0; i < columns; i++) {
                const yPos = drops[i] * fontSize;

                if (yPos > 0 && yPos < height + 30) {
                    let char;
                    if (Math.random() > 0.45) {
                        char = colTokens[i].charAt(Math.floor(drops[i]) % colTokens[i].length);
                    } else {
                        char = CHARS.charAt(Math.floor(Math.random() * CHARS.length));
                    }

                    const rand = Math.random();
                    if (rand > 0.92) {
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                    } else if (rand > 0.82) {
                        ctx.fillStyle = 'rgba(56, 189, 248, 0.55)';
                    } else if (rand > 0.72) {
                        ctx.fillStyle = 'rgba(52, 211, 153, 0.45)';
                    } else {
                        ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
                    }

                    ctx.fillText(char, i * colWidth, yPos);
                }

                if (drops[i] * fontSize > height && Math.random() > 0.96) {
                    drops[i] = 0;
                    colTokens[i] = CYBER_CODE_TOKENS[Math.floor(Math.random() * CYBER_CODE_TOKENS.length)];
                }
                drops[i] += colSpeeds[i];
            }
        }

        for (let step = 0; step < 25; step++) {
            drawAmbientStreams();
        }

        setInterval(drawAmbientStreams, 42);
    }

    const SLIDES = [
        { id: 'inicio', title: 'Portada Oficial' },
        { id: 'comparativa', title: 'Tres Vectores' },
        { id: 'nmap', title: 'Nmap Scanner' },
        { id: 'wireshark', title: 'Wireshark Inspección' },
        { id: 'bettercap', title: 'Bettercap MITM' },
        { id: 'conclusiones', title: 'Conclusiones Defensivas' },
        { id: 'demostracion', title: 'Demostración de Nmap' }
    ];

    const slideCounterText = document.getElementById('slide-counter-text');
    const sectionElements = SLIDES.map(s => document.getElementById(s.id)).filter(Boolean);

    function getCurrentSlideIndex() {
        const scrollMid = window.scrollY + window.innerHeight * 0.45;
        for (let i = sectionElements.length - 1; i >= 0; i--) {
            if (scrollMid >= sectionElements[i].offsetTop) {
                return i;
            }
        }
        return 0;
    }

    function updatePresentationState() {
        const currentIdx = getCurrentSlideIndex();
        const currentSlide = SLIDES[currentIdx] || SLIDES[0];

        if (slideCounterText) {
            const num = String(currentIdx + 1).padStart(2, '0');
            const total = String(SLIDES.length).padStart(2, '0');
            slideCounterText.textContent = `${num} / ${total} · ${currentSlide.title}`;
        }
    }

    window.addEventListener('scroll', updatePresentationState, { passive: true });
    updatePresentationState();

    function navigateToSlide(index) {
        if (index >= 0 && index < sectionElements.length) {
            sectionElements[index].scrollIntoView({ behavior: 'smooth' });
        }
    }

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => { });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen().catch(() => { });
            }
        }
    }

    document.addEventListener('keydown', (e) => {
        if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

        const currentIdx = getCurrentSlideIndex();

        switch (e.key) {
            case 'ArrowDown':
            case 'ArrowRight':
            case ' ':
            case 'PageDown':
                e.preventDefault();
                navigateToSlide(Math.min(sectionElements.length - 1, currentIdx + 1));
                break;

            case 'ArrowUp':
            case 'ArrowLeft':
            case 'PageUp':
                e.preventDefault();
                navigateToSlide(Math.max(0, currentIdx - 1));
                break;

            case 'Home':
                e.preventDefault();
                navigateToSlide(0);
                break;

            case 'End':
                e.preventDefault();
                navigateToSlide(sectionElements.length - 1);
                break;

            case 'f':
            case 'F':
                e.preventDefault();
                toggleFullscreen();
                break;
        }
    });

    const nmapTargetSelect = document.getElementById('nmap-target-select');
    const nmapTypeSelect = document.getElementById('nmap-type-select');
    const nmapRunBtn = document.getElementById('nmap-run-btn');
    const nmapProgressContainer = document.getElementById('nmap-progress-meter') || document.getElementById('nmap-progress-bar-container');
    const nmapProgressFill = document.getElementById('nmap-progress-fill');
    const nmapProgressLabel = document.getElementById('nmap-progress-label');
    const nmapProgressPercent = document.getElementById('nmap-progress-percent');
    const nmapOutput = document.getElementById('nmap-terminal-output');

    const NMAP_TARGET_DATA = {
        'gateway': {
            ip: '192.168.1.1',
            hostname: 'gateway.lab',
            latency: '0.00038s',
            ports: [
                { port: '22/tcp', state: 'open', service: 'ssh', version: 'OpenSSH 9.2p1 Debian (protocol 2.0)' },
                { port: '53/tcp', state: 'open', service: 'domain', version: 'dnsmasq 2.89' },
                { port: '80/tcp', state: 'open', service: 'http', version: 'lighttpd 1.4.69 (Router WebGUI)' },
                { port: '443/tcp', state: 'open', service: 'ssl/https', version: 'lighttpd 1.4.69 (TLSv1.3)' }
            ],
            os: 'Linux 6.1 (OpenWrt / Embedded Gateway)',
            extraNote: 'Host responde a sondas ICMP echo request y SYN en capa 4.'
        },
        'windows': {
            ip: '192.168.1.45',
            hostname: 'DESKTOP-WIN11.lab',
            latency: '0.00045s',
            ports: [
                { port: '135/tcp', state: 'open', service: 'msrpc', version: 'Microsoft Windows RPC' },
                { port: '139/tcp', state: 'open', service: 'netbios-ssn', version: 'Microsoft Windows netbios-ssn' },
                { port: '445/tcp', state: 'open', service: 'microsoft-ds', version: 'Windows 11 SMBv2 (Workgroup: WORKGROUP)' },
                { port: '3389/tcp', state: 'open', service: 'ms-wbt-server', version: 'Microsoft Terminal Services (RDP con NLA activo)' }
            ],
            os: 'Microsoft Windows 10/11 build 22621',
            extraNote: 'MAC Address: AA:BB:CC:11:22:33 (VMware Virtual NIC).'
        },
        'server': {
            ip: '192.168.1.100',
            hostname: 'srv-database.lab',
            latency: '0.00029s',
            ports: [
                { port: '21/tcp', state: 'open', service: 'ftp', version: 'vsftpd 3.0.3 (Anonymous login allowed)' },
                { port: '80/tcp', state: 'open', service: 'http', version: 'Apache httpd 2.4.57 ((Debian))' },
                { port: '3306/tcp', state: 'open', service: 'mysql', version: 'MySQL 8.0.35 (Protocol 10)' },
                { port: '8080/tcp', state: 'open', service: 'http-proxy', version: 'Apache Tomcat 10.1.13' }
            ],
            os: 'Debian GNU/Linux 12 (bookworm)',
            extraNote: 'ALERTA: Puerto 21 permite acceso anónimo. Puerto 3306 expuesto a la red interna.'
        }
    };

    if (nmapRunBtn) {
        nmapRunBtn.addEventListener('click', () => {
            const targetKey = nmapTargetSelect.value;
            const scanType = nmapTypeSelect.value;
            const targetInfo = NMAP_TARGET_DATA[targetKey];

            nmapRunBtn.disabled = true;
            nmapRunBtn.textContent = 'Escaneando...';
            nmapProgressContainer.style.display = 'block';
            nmapOutput.innerHTML = `<span class="text-cyan">Iniciando Nmap 7.94 sobre ${targetInfo.ip} con modificador ${scanType}...</span><br>`;

            let progress = 0;
            const steps = [
                { p: 20, text: 'Enviando ARP ping y confirmando host activo...' },
                { p: 55, text: `Ejecutando sondeo de puertos (${scanType})...` },
                { p: 85, text: 'Interrogando banners de servicio e interrogación de versiones...' },
                { p: 100, text: 'Escaneo completado con éxito.' }
            ];

            let stepIdx = 0;
            const timer = setInterval(() => {
                if (stepIdx < steps.length) {
                    const step = steps[stepIdx];
                    progress = step.p;
                    nmapProgressFill.style.width = `${progress}%`;
                    nmapProgressPercent.textContent = `${progress}%`;
                    nmapProgressLabel.textContent = step.text;
                    stepIdx++;
                } else {
                    clearInterval(timer);
                    renderNmapResults(targetInfo, scanType);
                    nmapRunBtn.disabled = false;
                    nmapRunBtn.textContent = '▶ Ejecutar Escaneo';
                }
            }, 300);
        });
    }

    function renderNmapResults(target, scanType) {
        let portsTableHtml = `
            <table class="nmap-table">
                <thead>
                    <tr>
                        <th>PORT</th>
                        <th>STATE</th>
                        <th>SERVICE</th>
                        <th>VERSION</th>
                    </tr>
                </thead>
                <tbody>
        `;

        target.ports.forEach(p => {
            portsTableHtml += `
                <tr>
                    <td class="font-mono" style="color: #fff; font-weight: 600;">${p.port}</td>
                    <td><span class="port-status-${p.state}">${p.state.toUpperCase()}</span></td>
                    <td class="text-cyan">${p.service}</td>
                    <td class="text-muted">${p.version}</td>
                </tr>
            `;
        });
        portsTableHtml += `</tbody></table>`;

        const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

        const lines = [
            `<span class="text-muted">Starting Nmap 7.94 ( https://nmap.org ) at ${now} EST</span>`,
            `<span class="text-muted">Nmap scan report for </span><strong style="color: #fff;">${target.hostname} (${target.ip})</strong>`,
            `<span class="text-muted">Host is up (${target.latency} latency).</span>`,
            `<span style="color: #64748b; font-size: 0.76rem;">Not shown: 996 closed tcp ports (reset)</span>`,
            portsTableHtml,
            `<span class="text-emerald">Service Info: </span><span style="color: #ddd;">OS: ${target.os}</span>`,
            `<span style="color: #f59e0b; font-size: 0.78rem;">// ${target.extraNote}</span>`,
            `<span style="color: #4ade80;">✔ Nmap done:</span> 1 IP address (1 host up) scanned in 1.48 seconds`
        ];

        nmapOutput.innerHTML = '';
        let lineIdx = 0;

        function typeLine() {
            if (lineIdx < lines.length) {
                const div = document.createElement('div');
                if (lineIdx === 4) {
                    div.innerHTML = lines[lineIdx];
                    div.style.opacity = '0';
                    div.style.transform = 'translateY(5px)';
                    div.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    nmapOutput.appendChild(div);
                    requestAnimationFrame(() => {
                        div.style.opacity = '1';
                        div.style.transform = 'translateY(0)';
                    });
                } else {
                    div.innerHTML = lines[lineIdx];
                    div.style.opacity = '0';
                    div.style.transition = 'opacity 0.25s ease';
                    nmapOutput.appendChild(div);
                    requestAnimationFrame(() => { div.style.opacity = '1'; });
                }
                nmapOutput.scrollTop = nmapOutput.scrollHeight;
                lineIdx++;
                setTimeout(typeLine, lineIdx === 5 ? 350 : 120 + Math.random() * 100);
            }
        }
        typeLine();
    }

    const nmapCveBtn = document.getElementById('nmap-cve-btn');
    if (nmapCveBtn) {
        nmapCveBtn.addEventListener('click', () => {
            nmapCveBtn.disabled = true;
            nmapCveBtn.textContent = 'Analizando CVEs...';
            nmapProgressContainer.style.display = 'block';
            nmapProgressFill.style.width = '65%';
            nmapProgressPercent.textContent = '65%';
            nmapProgressLabel.textContent = 'Ejecutando scripts NSE (--script vuln)...';

            setTimeout(() => {
                nmapProgressFill.style.width = '100%';
                nmapProgressPercent.textContent = '100%';
                nmapProgressLabel.textContent = 'Auditoría NSE completada.';

                nmapOutput.innerHTML = `
                    <div><span class="text-muted">Starting Nmap 7.94 NSE Vulnerability Engine at srv-database.lab (192.168.1.100)</span></div>
                    <div style="color: #64748b; font-size: 0.76rem; margin: 4px 0;">NSE: 44 scripts cargados y evaluados contra la pila de servicios.</div>
                    
                    <table class="nmap-table" style="margin: 8px 0;">
                        <thead>
                            <tr>
                                <th>PORT</th>
                                <th>SERVICE</th>
                                <th>VULNERABILIDAD / CVE DETECTADO</th>
                                <th>SEVERIDAD</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="font-mono" style="color: #fff; font-weight:600;">21/tcp</td>
                                <td class="text-cyan">vsftpd 2.3.4</td>
                                <td style="color: #fca5a5;">CVE-2011-2523 (Backdoor Command Execution)</td>
                                <td><span class="tag-badge" style="color: #f43f5e; border-color: rgba(244,63,94,0.4);">CRÍTICO 9.8</span></td>
                            </tr>
                            <tr>
                                <td class="font-mono" style="color: #fff; font-weight:600;">80/tcp</td>
                                <td class="text-cyan">Apache 2.4.49</td>
                                <td style="color: #fca5a5;">CVE-2021-41773 (Path Traversal & Remote Code Exec)</td>
                                <td><span class="tag-badge" style="color: #f43f5e; border-color: rgba(244,63,94,0.4);">ALTO 7.5</span></td>
                            </tr>
                            <tr>
                                <td class="font-mono" style="color: #fff; font-weight:600;">3306/tcp</td>
                                <td class="text-cyan">MySQL 8.0</td>
                                <td style="color: #fde68a;">mysql-empty-password (Cuenta root sin contraseña)</td>
                                <td><span class="tag-badge" style="color: #f59e0b; border-color: rgba(245,158,11,0.4);">MEDIO 5.3</span></td>
                            </tr>
                        </tbody>
                    </table>

                    <div style="background: rgba(244,63,94,0.08); border-left: 3px solid #f43f5e; padding: 6px 10px; border-radius: 4px; font-size: 0.78rem; color: #fecdd3; margin-top: 6px;">
                        <strong>🛡️ Acción Defensiva Inmediata:</strong> Actualizar vsftpd a versión 3.0.5+, aplicar parche de seguridad a Apache HTTP Server y restringir acceso a MySQL ligándolo a localhost (127.0.0.1).
                    </div>
                    <div style="margin-top: 6px; color: #10b981;">✔ Nmap NSE: 3 hallazgos críticos reportados en 1.15 segundos.</div>
                `;

                nmapCveBtn.disabled = false;
                nmapCveBtn.textContent = '🛡️ Analizar CVEs (NSE)';
            }, 600);
        });
    }

    const PORT_KNOWLEDGE = {
        '21': {
            name: 'PUERTO 21/TCP · FILE TRANSFER PROTOCOL (FTP)',
            risk: 'RIESGO: CRÍTICO',
            riskColor: 'var(--rose)',
            desc: 'Transmisión de credenciales y archivos en texto plano sin cifrar. Frecuente presencia de login anónimo o servidores vulnerables a puertas traseras.',
            mitigation: 'Migrar a SFTP (SSH Port 22) o FTPS (TLS). Deshabilitar login anónimo en configuración.'
        },
        '22': {
            name: 'PUERTO 22/TCP · SECURE SHELL (SSH)',
            risk: 'RIESGO: MEDIO (FUERZA BRUTA)',
            riskColor: 'var(--amber)',
            desc: 'Canal seguro para administración remota. El vector primario es el ataque por fuerza bruta y diccionario contra cuentas privilegiadas.',
            mitigation: 'Deshabilitar PermitRootLogin, utilizar llaves Ed25519 con passphrase e instalar Fail2ban para bloqueo automático de IPs.'
        },
        '53': {
            name: 'PUERTO 53/UDP & TCP · DOMAIN NAME SYSTEM (DNS)',
            risk: 'RIESGO: ALTO (AMPLIFICACIÓN / SPOOFING)',
            riskColor: 'var(--amber)',
            desc: 'Servicio neurálgico de resolución. Si actúa como resolver recursivo abierto, puede ser abusado para ataques DDoS por amplificación o envenenamiento de caché.',
            mitigation: 'Desactivar recursión abierta hacia clientes desconocidos, habilitar DNSSEC y limitar tasa de respuestas (RRL).'
        },
        '80': {
            name: 'PUERTO 80/TCP · HYPERTEXT TRANSFER PROTOCOL (HTTP)',
            risk: 'RIESGO: ALTO (TEXTO PLANO)',
            riskColor: 'var(--rose)',
            desc: 'Tráfico web sin cifrado. Expone cookies de sesión, tokens y formularios de inicio de sesión a cualquier interceptor en Capa 2.',
            mitigation: 'Redirección obligatoria 301 a HTTPS (Puerto 443) y activación de cabeceras HSTS (HTTP Strict Transport Security).'
        },
        '443': {
            name: 'PUERTO 443/TCP · HTTP SECURE (HTTPS / TLS 1.3)',
            risk: 'RIESGO: BAJO (ESTÁNDAR SEGURO)',
            riskColor: 'var(--emerald)',
            desc: 'Cifrado asimétrico y simétrico de extremo a extremo. Los riesgos residen únicamente en configuraciones obsoletas de TLS 1.0/1.1 o certificados caducados.',
            mitigation: 'Forzar TLS 1.2 y TLS 1.3 estrictos, inhabilitar suites de cifrado débiles heredadas y utilizar certificados válidos de CA reconocidas.'
        },
        '3306': {
            name: 'PUERTO 3306/TCP · MYSQL DATABASE SERVER',
            risk: 'RIESGO: CRÍTICO (BASE DE DATOS EXPUESTA)',
            riskColor: 'var(--rose)',
            desc: 'Motor de base de datos relacional expuesto a la red. Expone esquemas de datos a inyecciones directas y ataques de fuerza bruta al usuario root.',
            mitigation: 'Vincular el servicio únicamente a la interfaz local (bind-address = 127.0.0.1) o restringir acceso por firewall y túnel SSH.'
        },
        '3389': {
            name: 'PUERTO 3389/TCP · REMOTE DESKTOP PROTOCOL (RDP)',
            risk: 'RIESGO: CRÍTICO (RCE / BLUEKEEP)',
            riskColor: 'var(--rose)',
            desc: 'Administración gráfica remota de Windows. Históricamente vulnerable a ejecución remota de código sin autenticación (BlueKeep CVE-2019-0708).',
            mitigation: 'Activar Autenticación a Nivel de Red (NLA), no exponer el puerto a Internet público y requerir conexión a través de VPN corporativa.'
        }
    };

    const portBtns = document.querySelectorAll('.port-pill-btn, .port-btn');
    const portViewName = document.getElementById('port-view-name');
    const portViewRisk = document.getElementById('port-view-risk');
    const portViewDesc = document.getElementById('port-view-desc');
    const portViewMitigation = document.getElementById('port-view-mitigation');

    portBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            portBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const port = btn.dataset.port;
            const data = PORT_KNOWLEDGE[port];
            if (data && portViewName) {
                portViewName.textContent = data.name;
                portViewRisk.textContent = data.risk;
                portViewRisk.style.color = data.riskColor;
                portViewRisk.style.borderColor = data.riskColor;
                portViewDesc.textContent = data.desc;
                portViewMitigation.textContent = data.mitigation;
            }
        });
    });

    const wsPacketRows = document.getElementById('ws-packet-rows');
    const wsDetailsTree = document.getElementById('ws-details-tree');
    const wsHexdumpView = document.getElementById('ws-hexdump-view');
    const wsCaptureToggle = document.getElementById('ws-capture-toggle');
    const wsCaptureClear = document.getElementById('ws-capture-clear');
    const wsFilterInput = document.getElementById('ws-filter-input');
    const wsApplyFilterBtn = document.getElementById('ws-apply-filter-btn');
    const wsQuickFilterBtns = document.querySelectorAll('.ws-quick-filter');

    let wsCapturing = true;
    let wsPacketCounter = 1;

    const SAMPLE_PACKETS = [
        {
            proto: 'HTTP',
            class: 'proto-http',
            src: '192.168.1.45',
            dst: '192.168.1.100',
            len: 384,
            info: 'POST /auth/login.php HTTP/1.1 (application/x-www-form-urlencoded)',
            details: `
                <div class="tree-item">▶ Frame 1: 384 bytes on wire (3072 bits), 384 bytes captured on interface eth0</div>
                <div class="tree-item">▶ Ethernet II, Src: VMware_aa:bb:cc (AA:BB:CC:11:22:33), Dst: VMware_00:50:56 (00:50:56:00:01:01)</div>
                <div class="tree-item">▶ Internet Protocol Version 4, Src: 192.168.1.45, Dst: 192.168.1.100</div>
                <div class="tree-item">▶ Transmission Control Protocol, Src Port: 52412, Dst Port: 80, Seq: 1, Ack: 1</div>
                <div class="tree-item">▼ Hypertext Transfer Protocol</div>
                <div class="tree-item-critical">
                    POST /auth/login.php HTTP/1.1<br>
                    Host: 192.168.1.100<br>
                    User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)<br>
                    Content-Type: application/x-www-form-urlencoded<br>
                    [ALERTA FORENSE]: Datos de autenticación en claro:<br>
                    <strong>username=usuario.demo&password=CyberSecPass2026!</strong>
                </div>
            `,
            hex: `
0000   00 50 56 00 01 01 aa bb  cc 11 22 33 08 00 45 00   .PV......."3..E.
0010   01 72 2a 3f 40 00 80 06  e5 4b c0 a8 01 2d c0 a8   .r*?@....K...-..
0020   01 64 cc bc 00 50 a1 44  29 b0 e8 4a 12 a0 50 18   .d...P.D)..J..P.
0030   01 f5 b4 10 00 00 50 4f  53 54 20 2f 61 75 74 68   ......<span class="hexdump-highlight">POST /auth</span>
0040   2f 6c 6f 67 69 6e 2e 70  68 70 20 48 54 54 50 2f   <span class="hexdump-highlight">/login.php HTTP/</span>
0050   31 2e 31 0d 0a 48 6f 73  74 3a 20 31 39 32 2e 31   <span class="hexdump-highlight">1.1..Host: 192.1</span>
0060   36 38 2e 31 2e 31 30 30  0d 0a 0d 0a 75 73 65 72   <span class="hexdump-highlight">68.1.100....user</span>
0070   6e 61 6d 65 3d 75 73 75  61 72 69 6f 2e 64 65 6d   <span class="hexdump-highlight">name=usuario.dem</span>
0080   6f 26 70 61 73 73 77 6f  72 64 3d 43 79 62 65 72   <span class="hexdump-highlight">o&password=Cyber</span>
0090   53 65 63 50 61 73 73 32  30 32 36 21              <span class="hexdump-highlight">SecPass2026!</span>
            `
        },
        {
            proto: 'TLSv1.3',
            class: 'proto-tls',
            src: '192.168.1.45',
            dst: '142.250.190.46',
            len: 1240,
            info: 'Application Data Protocol: Hypertext Transfer Protocol with Privacy (Encrypted Data)',
            details: `
                <div class="tree-item">▶ Frame 2: 1240 bytes on wire, 1240 bytes captured on interface eth0</div>
                <div class="tree-item">▶ Ethernet II, Src: AA:BB:CC:11:22:33, Dst: 00:50:56:00:01:01</div>
                <div class="tree-item">▶ Internet Protocol Version 4, Src: 192.168.1.45, Dst: 142.250.190.46</div>
                <div class="tree-item">▶ Transmission Control Protocol, Src Port: 54102, Dst Port: 443</div>
                <div class="tree-item">▼ Transport Layer Security (TLSv1.3)</div>
                <div class="tree-item-secure">
                    TLSv1.3 Record Layer: Application Data Protocol: http-over-tls<br>
                    Opaque Type: Application Data (23)<br>
                    Version: TLS 1.2 (0x0303) [Compatibility mode]<br>
                    Length: 1184 bytes<br>
                    Encrypted Application Data: 8f 4a 2b 91 e0 12 d4 ...<br>
                    [PROTECCIÓN CRIPTOGRÁFICA]: Cifrado simétrico AES-256-GCM. Contenido inaccesible al auditor o atacante sin la llave de sesión.
                </div>
            `,
            hex: `
0000   00 50 56 00 01 01 aa bb  cc 11 22 33 08 00 45 00   .PV......."3..E.
0010   04 d8 a1 f2 40 00 80 06  6e 10 c0 a8 01 2d 8e fa   ....@...n....-..
0020   be 2e d3 56 01 bb f8 19  40 12 8a 22 14 5a 50 18   ...V....@..".ZP.
0030   02 00 9a b1 00 00 17 03  03 04 a0 8f 4a 2b 91 e0   ............J+..
0040   12 d4 7c 99 b3 0a ff 2e  8d 14 55 90 28 a4 61 bb   ..|.......U.(.a.
0050   // [DATOS CIFRADOS INDESCIFRABLES POR WIRESHARK SIN SSLKEYLOG]
            `
        },
        {
            proto: 'ARP',
            class: 'proto-arp',
            src: '192.168.1.10',
            dst: '192.168.1.45',
            len: 42,
            info: '192.168.1.1 is at de:ad:be:ef:00:10 (Gratuitous ARP Reply - ALERTA SPOOFING)',
            details: `
                <div class="tree-item">▶ Frame 3: 42 bytes on wire (Ethernet + ARP payload)</div>
                <div class="tree-item">▶ Ethernet II, Src: de:ad:be:ef:00:10, Dst: aa:bb:cc:11:22:33</div>
                <div class="tree-item">▼ Address Resolution Protocol (reply)</div>
                <div class="tree-item-critical">
                    Hardware type: Ethernet (1)<br>
                    Protocol type: IPv4 (0x0800)<br>
                    Opcode: reply (2)<br>
                    Sender MAC address: de:ad:be:ef:00:10 (MAC Atacante Kali)<br>
                    Sender IP address: 192.168.1.1 (IP suplantada del Router)<br>
                    Target MAC address: aa:bb:cc:11:22:33 (Víctima Windows)<br>
                    Target IP address: 192.168.1.45<br>
                    [ALERTA EXPERTA WIRESHARK]: Duplicate IP address detected for 192.168.1.1!
                </div>
            `,
            hex: `
0000   aa bb cc 11 22 33 de ad  be ef 00 10 08 06 00 01   ...."3..........
0010   08 00 06 04 00 02 de ad  be ef 00 10 c0 a8 01 01   ................
0020   aa bb cc 11 22 33 c0 a8  01 2d 00 00 00 00 00 00   ...."3...-......
            `
        },
        {
            proto: 'DNS',
            class: 'proto-dns',
            src: '192.168.1.45',
            dst: '192.168.1.1',
            len: 74,
            info: 'Standard query 0x2b1a A aula.infouni.edu.pe',
            details: `
                <div class="tree-item">▶ Frame 4: 74 bytes on wire</div>
                <div class="tree-item">▶ Ethernet II, Src: AA:BB:CC:11:22:33, Dst: 00:50:56:00:01:01</div>
                <div class="tree-item">▶ Internet Protocol Version 4, Src: 192.168.1.45, Dst: 192.168.1.1</div>
                <div class="tree-item">▶ User Datagram Protocol, Src Port: 58210, Dst Port: 53</div>
                <div class="tree-item">▼ Domain Name System (query)</div>
                <div class="tree-item">
                    Transaction ID: 0x2b1a<br>
                    Flags: 0x0100 Standard query<br>
                    Questions: 1<br>
                    Query: aula.infouni.edu.pe: type A, class IN
                </div>
            `,
            hex: `
0000   00 50 56 00 01 01 aa bb  cc 11 22 33 08 00 45 00   .PV......."3..E.
0010   00 4a 4f 12 00 00 80 11  92 a1 c0 a8 01 2d c0 a8   .JO........-..
0020   01 01 e3 62 00 35 00 36  1c 2f 2b 1a 01 00 00 01   ...b.5.6./+.....
0030   00 00 00 00 00 00 04 61  75 6c 61 06 73 65 6e 61   .......aula.sena
0040   74 69 03 65 64 75 02 70  65 00 00 01 00 01         ti.edu.pe.....
            `
        }
    ];

    function addPacketRow(packet) {
        if (!wsPacketRows) return;
        const tr = document.createElement('tr');
        tr.className = `packet-row ${packet.class}`;
        const timeOffset = (wsPacketCounter * 0.28).toFixed(3);

        tr.innerHTML = `
            <td>${wsPacketCounter}</td>
            <td>${timeOffset}</td>
            <td>${packet.src}</td>
            <td>${packet.dst}</td>
            <td><strong>${packet.proto}</strong></td>
            <td>${packet.len}</td>
            <td style="overflow: hidden; text-overflow: ellipsis;">${packet.info}</td>
        `;

        tr.addEventListener('click', () => {
            document.querySelectorAll('.packet-row').forEach(r => r.classList.remove('selected'));
            tr.classList.add('selected');
            selectPacket(packet);
        });

        wsPacketRows.appendChild(tr);
        wsPacketCounter++;

        if (wsPacketRows.childElementCount > 30) {
            wsPacketRows.removeChild(wsPacketRows.firstChild);
        }

        const listContainer = document.querySelector('.wireshark-packet-list');
        if (listContainer) {
            listContainer.scrollTop = listContainer.scrollHeight;
        }
    }

    function selectPacket(packet) {
        if (wsDetailsTree) wsDetailsTree.innerHTML = packet.details;
        if (wsHexdumpView) wsHexdumpView.innerHTML = `<pre style="font-family: inherit; margin: 0;">${packet.hex}</pre>`;
    }

    SAMPLE_PACKETS.forEach(p => addPacketRow(p));
    selectPacket(SAMPLE_PACKETS[0]);

    setInterval(() => {
        if (wsCapturing) {
            const randomPacket = SAMPLE_PACKETS[Math.floor(Math.random() * SAMPLE_PACKETS.length)];
            addPacketRow(randomPacket);
        }
    }, 1800);

    if (wsCaptureToggle) {
        wsCaptureToggle.addEventListener('click', () => {
            wsCapturing = !wsCapturing;
            wsCaptureToggle.textContent = wsCapturing ? '⏹ Pausar Flujo' : '▶ Reanudar Flujo';
            wsCaptureToggle.style.color = wsCapturing ? 'var(--emerald)' : 'var(--text-muted)';
        });
    }

    if (wsCaptureClear) {
        wsCaptureClear.addEventListener('click', () => {
            if (wsPacketRows) wsPacketRows.innerHTML = '';
            wsPacketCounter = 1;
        });
    }

    wsQuickFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            if (wsFilterInput) {
                if (filter === 'all') wsFilterInput.value = '';
                else if (filter === 'http') wsFilterInput.value = 'http';
                else if (filter === 'tls') wsFilterInput.value = 'tls';
                else if (filter === 'arp') wsFilterInput.value = 'arp';
            }
            applyWiresharkFilter();
        });
    });

    if (wsApplyFilterBtn) {
        wsApplyFilterBtn.addEventListener('click', applyWiresharkFilter);
    }

    function applyWiresharkFilter() {
        const query = wsFilterInput ? wsFilterInput.value.toLowerCase().trim() : '';
        const rows = document.querySelectorAll('.packet-row');
        rows.forEach(row => {
            if (!query) {
                row.style.display = '';
            } else {
                const text = row.textContent.toLowerCase();
                if (text.includes(query)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            }
        });
    }

    const bcToggleSpoofBtn = document.getElementById('bc-toggle-spoof-btn');
    const bcSendTrafficBtn = document.getElementById('bc-send-traffic-btn');
    const bcDnsSpoofBtn = document.getElementById('bc-dns-spoof-btn');
    const bcVictimCacheBadge = document.getElementById('bc-victim-cache-badge');
    const bcFlowIndicator = document.getElementById('bc-flow-indicator');
    const bcFlowSubIndicator = document.getElementById('bc-flow-sub-indicator');
    const bcRouteBadge = document.getElementById('bc-route-badge');
    const bcAttackerCard = document.getElementById('bc-attacker-card');
    const bcAttackerStatus = document.getElementById('bc-attacker-status');
    const bcTopologyContainer = document.getElementById('bc-topology-container');
    const bcEventFeed = document.getElementById('bc-event-feed');

    let bcSpoofActive = false;

    function appendBettercapLog(text, color = '#cbd5e1', playSound = true) {
        if (!bcEventFeed) return;
        const div = document.createElement('div');
        div.style.color = color;
        div.style.margin = '3px 0';
        div.style.opacity = '0';
        div.style.transform = 'translateX(-4px)';
        div.style.transition = 'opacity 0.2s ease, transform 0.2s ease';

        const time = new Date().toTimeString().split(' ')[0];
        div.innerHTML = `<span style="color: #64748b; font-size: 0.74rem;">[${time}]</span> ${text}`;
        bcEventFeed.appendChild(div);

        requestAnimationFrame(() => {
            div.style.opacity = '1';
            div.style.transform = 'translateX(0)';
        });

        if (playSound && typeof playKeystrokeSound === 'function') {
            playKeystrokeSound(1050, 0.025);
        }

        const screen = document.getElementById('bettercap-terminal-screen');
        if (screen) screen.scrollTop = screen.scrollHeight;
    }

    if (bcToggleSpoofBtn) {
        bcToggleSpoofBtn.addEventListener('click', () => {
            bcSpoofActive = !bcSpoofActive;

            if (bcSpoofActive) {
                bcToggleSpoofBtn.textContent = '⏹ Detener ARP Spoofing';
                bcToggleSpoofBtn.classList.remove('danger');
                bcToggleSpoofBtn.style.borderColor = 'var(--text-muted)';
                bcToggleSpoofBtn.style.color = '#fff';

                if (bcTopologyContainer) bcTopologyContainer.classList.add('mitm-active');

                if (bcRouteBadge) {
                    bcRouteBadge.textContent = 'RUTA MITM INTERCEPTADA';
                    bcRouteBadge.style.color = 'var(--rose)';
                    bcRouteBadge.style.borderColor = 'rgba(244,63,94,0.4)';
                }

                if (bcVictimCacheBadge) {
                    bcVictimCacheBadge.textContent = '¡ARP ENVENENADA!';
                    bcVictimCacheBadge.style.color = 'var(--rose)';
                    bcVictimCacheBadge.style.borderColor = 'rgba(244,63,94,0.4)';
                }

                if (bcFlowIndicator) {
                    bcFlowIndicator.innerHTML = `🔻 [DESVIADO] Víctima ──▶ Kali Linux (Copia de Paquetes)`;
                }

                if (bcFlowSubIndicator) {
                    bcFlowSubIndicator.innerHTML = `🔻 [REMITIDO] Kali Linux ──▶ Gateway (Reenvío Transparente)`;
                }

                if (bcAttackerCard) bcAttackerCard.classList.add('active');
                if (bcAttackerStatus) {
                    bcAttackerStatus.textContent = 'INTERCEPTANDO';
                    bcAttackerStatus.style.color = 'var(--rose)';
                    bcAttackerStatus.style.borderColor = 'var(--rose)';
                }

                const spoofLogs = [
                    { t: `<span class="bettercap-prompt" style="color: #f43f5e; font-weight:700;">bettercap &gt;&gt;</span> set arp.spoof.targets 192.168.1.45`, c: '#ffffff', d: 50 },
                    { t: `<span class="bettercap-prompt" style="color: #f43f5e; font-weight:700;">bettercap &gt;&gt;</span> arp.spoof on; net.sniff on`, c: '#ffffff', d: 250 },
                    { t: `[sys.log] [INFO] arp.spoof módulo iniciado. Hilo de inyección activo en eth0`, c: '#38bdf8', d: 500 },
                    { t: `[arp.spoof] [ENVIANDO] 2 tramas gratuitous ARP forjadas (MAC víctima y router envenenadas)`, c: '#f59e0b', d: 750 },
                    { t: `[net.sniff] [ACTIVO] Modo promiscuo habilitado en eth0. Inspeccionando tráfico en tránsito...`, c: '#10b981', d: 1000 }
                ];

                spoofLogs.forEach(item => {
                    setTimeout(() => appendBettercapLog(item.t, item.c), item.d);
                });

            } else {
                bcToggleSpoofBtn.textContent = '▶ Activar ARP Spoofing';
                bcToggleSpoofBtn.classList.add('danger');
                bcToggleSpoofBtn.style.borderColor = '';
                bcToggleSpoofBtn.style.color = '';

                if (bcTopologyContainer) bcTopologyContainer.classList.remove('mitm-active');

                if (bcRouteBadge) {
                    bcRouteBadge.textContent = 'Ruta Directa';
                    bcRouteBadge.style.color = 'var(--emerald)';
                    bcRouteBadge.style.borderColor = 'rgba(16,185,129,0.3)';
                }

                if (bcVictimCacheBadge) {
                    bcVictimCacheBadge.textContent = 'ARP Limpio';
                    bcVictimCacheBadge.style.color = 'var(--emerald)';
                    bcVictimCacheBadge.style.borderColor = 'rgba(16,185,129,0.3)';
                }

                if (bcFlowIndicator) {
                    bcFlowIndicator.innerHTML = `↕ Tráfico Directo Legítimo (Bypass Atacante)`;
                }

                if (bcFlowSubIndicator) {
                    bcFlowSubIndicator.innerHTML = `Enlace de Reenvío hacia Gateway`;
                }

                if (bcAttackerCard) bcAttackerCard.classList.remove('active');
                if (bcAttackerStatus) {
                    bcAttackerStatus.textContent = 'Inactivo';
                    bcAttackerStatus.style.color = 'var(--text-tertiary)';
                    bcAttackerStatus.style.borderColor = 'rgba(255,255,255,0.1)';
                }

                const restoreLogs = [
                    { t: `<span class="bettercap-prompt" style="color: #f43f5e; font-weight:700;">bettercap &gt;&gt;</span> arp.spoof off`, c: '#ffffff', d: 50 },
                    { t: `[sys.log] [INFO] Restaurando tablas ARP originales de 192.168.1.45 y 192.168.1.1...`, c: '#94a3b8', d: 250 },
                    { t: `[sys.log] [INFO] Sesión MITM finalizada limpiamente. Cachés restauradas.`, c: '#10b981', d: 500 }
                ];

                restoreLogs.forEach(item => {
                    setTimeout(() => appendBettercapLog(item.t, item.c), item.d);
                });
            }
        });
    }

    if (bcSendTrafficBtn) {
        bcSendTrafficBtn.addEventListener('click', () => {
            if (!bcSpoofActive) {
                appendBettercapLog(`[aviso] El tráfico viaja directo entre Víctima y Gateway. Kali no ve las tramas privadas. Activa primero "▶ Activar ARP Spoofing".`, '#f59e0b');
                return;
            }

            const events = [
                {
                    req: `[net.sniff] [TRANSMISIÓN] 192.168.1.45:51940 solicita resolución DNS para "portal.infouni.edu.pe"`,
                    resp: `[net.sniff] [DNS] Consulta capturada en Kali -&gt; Respuesta remitida: 104.18.22.41`,
                    color: '#7dd3fc'
                },
                {
                    req: `[net.sniff] [TRANSMISIÓN] 192.168.1.45 envía solicitud HTTP POST hacia http://portal.lab/login.php`,
                    resp: `[net.sniff] [HTTP-CREDENTIALS] ¡CREDENCIALES CAPTURADAS EN TEXTO CLARO!<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── usuario: <strong style="color:#fff;">estudiante_auditor</strong><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── password: <strong style="color: #ff4d6d;">InfoUniClaveSegura2026!</strong>`,
                    color: '#ff6b6b'
                },
                {
                    req: `[net.sniff] [TRANSMISIÓN] 192.168.1.45 establece conexión TLS 1.3 con banco.com:443`,
                    resp: `[net.sniff] [TLS] Handshake interceptado: SNI="banco.com". Carga útil encriptada (AES-256-GCM protegida).`,
                    color: '#86efac'
                }
            ];

            const chosen = events[Math.floor(Math.random() * events.length)];

            appendBettercapLog(chosen.req, '#94a3b8');
            setTimeout(() => {
                appendBettercapLog(chosen.resp, chosen.color);
            }, 320);
        });
    }

    if (bcDnsSpoofBtn) {
        bcDnsSpoofBtn.addEventListener('click', () => {
            const dnsLogs = [
                { t: `<span class="bettercap-prompt" style="color: #c084fc; font-weight:700;">bettercap &gt;&gt;</span> set dns.spoof.domains portal.infouni.edu.pe, intranet.lab`, c: '#ffffff', d: 50 },
                { t: `<span class="bettercap-prompt" style="color: #c084fc; font-weight:700;">bettercap &gt;&gt;</span> set dns.spoof.address 192.168.1.10`, c: '#ffffff', d: 250 },
                { t: `<span class="bettercap-prompt" style="color: #c084fc; font-weight:700;">bettercap &gt;&gt;</span> dns.spoof on`, c: '#ffffff', d: 450 },
                { t: `[dns.spoof] [ACTIVO] Respuestas falsificadas configuradas hacia 192.168.1.10 (Kali)`, c: '#c084fc', d: 700 },
                { t: `[net.sniff] [DNS-ENGAÑO] Víctima solicita "portal.infouni.edu.pe" -&gt; INYECCIÓN FALSA: 192.168.1.10 (Servidor Phishing de Demostración)`, c: '#f43f5e', d: 950 }
            ];

            dnsLogs.forEach(item => {
                setTimeout(() => appendBettercapLog(item.t, item.c), item.d);
            });
        });
    }

    const NOTES_CONTENT = {
        '1': `Buenos días, profesor y compañeros. Hoy nuestro equipo presentará tres herramientas de análisis y hacking de redes: Nmap, Wireshark y Bettercap. 

Veremos qué hace cada una, cómo se relaciona con los ataques y qué medidas permiten reducir los riesgos. 
Usaremos Kali Linux como entorno de auditoría. Las pruebas se plantean únicamente en un laboratorio autorizado. 

Integrantes del proyecto: Justin Siesquen, Milton Chupillon, Steven Ortiz y Manuel Gutarra.
Fuentes oficiales: https://www.kali.org/tools/`,

        '2': `El reconocimiento permite localizar equipos y servicios. El análisis de paquetes ayuda a comprender las comunicaciones y los fallos. Las pruebas de interceptación evalúan si alguien podría colocarse entre dos participantes. 

Las herramientas se complementan, pero tienen funciones diferentes:
• Nmap no demuestra por sí solo que un sistema sea vulnerable.
• Wireshark observa el tráfico disponible en su punto de captura.
• Bettercap permite realizar pruebas activas de suplantación en Capa 2.

El alcance de una auditoría debe establecerse antes de comenzar.
Fuentes oficiales: https://nmap.org | https://www.wireshark.org | https://www.bettercap.org`,

        '3': `Nmap envía sondas y analiza las respuestas. Puede descubrir equipos, examinar puertos y reconocer servicios. 

Un puerto abierto indica que una aplicación escucha conexiones. Un puerto filtrado significa que un filtro u otro obstáculo impide conocer su estado con certeza. 

En el ejemplo, 22 y 80 son los puertos habituales de SSH y HTTP, aunque un servicio puede usar un puerto distinto. Identificar una versión ayuda a priorizar revisiones, pero requiere corroboración. Nmap también dispone de scripts (NSE) para comprobaciones específicas.`,

        '4': `Nmap suele intervenir en la fase de reconocimiento. Por ejemplo, una persona puede descubrir un servicio remoto expuesto y después investigar si tiene fallos conocidos. 

El escaneo por sí solo no implica acceso al equipo ni explotación exitosa. Como defensores, podemos usar el mismo inventario para retirar servicios innecesarios y restringir quién puede acceder. 

Un firewall reduce la exposición cuando está correctamente configurado, pero no sustituye las actualizaciones. Los sistemas de detección pueden alertar sobre patrones de exploración. Conclusión: Nmap ayuda a conocer la superficie de ataque.`,

        '5': `Wireshark presenta los detalles de cada paquete y permite filtrar por dirección, protocolo u otros campos. Se utiliza en diagnóstico, aprendizaje e investigación de incidentes. 

Puede abrir archivos de captura para revisarlos después. La visibilidad depende de la interfaz y del lugar desde el que capturamos. En una red conmutada no vemos automáticamente todo el tráfico entre otros equipos. 

Wireshark tampoco bloquea ataques ni actúa como un sistema automático de detección de intrusiones.`,

        '6': `Sniffing significa capturar y analizar tráfico. Puede ser una actividad legítima de diagnóstico o una captura maliciosa si se realiza sin autorización. 

Con HTTP, el contenido puede resultar legible para quien tenga visibilidad del flujo. HTTPS protege el contenido si el certificado se valida correctamente. 

Wireshark no descifra HTTPS de forma automática. La descodificación de protocolos tampoco equivale a romper un cifrado. Para reducir la exposición utilizamos HTTPS, SSH y controles de acceso. Conclusión: Wireshark permite observar y comprender evidencias de lo que ocurre en la red.`,

        '7': `Bettercap agrupa módulos para auditar redes. La prueba elegida utiliza el módulo de suplantación ARP. 

ARP permite encontrar una dirección física a partir de una IPv4 dentro de la red local. Un atacante puede enviar respuestas falsas para que un equipo asocie una dirección legítima con la MAC del atacante. De ese modo, las tramas destinadas al participante real llegan primero al intermediario. 

Es una prueba local y requiere condiciones apropiadas de conectividad. Conclusión: Bettercap ayuda a comprobar si una red permite desviar comunicaciones mediante suplantación.`,

        '8': `El desvío de tráfico puede permitir leer mensajes no cifrados o alterar peticiones. La falta de autenticación en ARP facilita este tipo de prueba en redes locales no protegidas. 

Como mitigación, el cifrado de extremo a extremo (como HTTPS) protege los datos aun si el paquete es interceptado. 

En redes gestionadas se pueden aplicar funciones de seguridad en conmutadores, como Dynamic ARP Inspection (DAI), y asociar tablas ARP estáticas en equipos críticos. Conclusión: La protección frente a la suplantación requiere medidas en la red local y cifrado en las aplicaciones.`,

        '9': `Buenos días profesor y compañeros. Pasamos a la fase de demostración práctica en vivo con Nmap en Kali Linux.

En esta grabación realizada en nuestro entorno de pruebas autorizado:
1. Comprobamos la conectividad y ejecutamos un barrido de red para identificar hosts activos en el segmento 192.168.1.0/24.
2. Lanzamos un escaneo SYN Stealth (-sS) sobre los puertos objetivo, reduciendo la huella en los logs de auditoría.
3. Analizamos las versiones exactas de los servicios con el modificador -sV y scripts NSE básicos para detectar posibles vectores de exposición.
4. Concluimos con las medidas de defensa: cierre de puertos innecesarios y configuración restrictiva en el firewall perimetral.`,

        '10': `Para cerrar: Nmap localiza la superficie expuesta, Wireshark permite inspeccionar el tráfico y Bettercap evalúa la resistencia a la suplantación. 

La seguridad no depende de una sola medida: combinar cifrado, segmentación y monitorización ofrece una protección más sólida. 

Agradecemos su atención y quedamos a disposición para responder sus preguntas.`
    };

    const notesOverlay = document.getElementById('notes-modal-overlay');
    const openNotesBtn = document.getElementById('open-notes-modal-btn');
    const closeNotesBtn = document.getElementById('close-notes-modal-btn');
    const modalTopicSelect = document.getElementById('modal-topic-select');
    const modalNotesContent = document.getElementById('modal-notes-content');

    function toggleNotesModal(show) {
        if (!notesOverlay) return;
        if (show) {
            notesOverlay.classList.add('active');
            updateModalNotes();
        } else {
            notesOverlay.classList.remove('active');
        }
    }

    function updateModalNotes() {
        if (!modalNotesContent || !modalTopicSelect) return;
        const val = modalTopicSelect.value;
        modalNotesContent.textContent = NOTES_CONTENT[val] || 'Sin notas disponibles.';
    }

    const wsFollowStreamBtn = document.getElementById('ws-follow-stream-btn');
    const tcpStreamOverlay = document.getElementById('tcp-stream-modal-overlay');
    const closeTcpStreamBtn = document.getElementById('close-tcp-stream-btn');
    const closeTcpStreamBtnBottom = document.getElementById('close-tcp-stream-btn-bottom');

    function toggleTcpStreamModal(show) {
        if (!tcpStreamOverlay) return;
        if (show) {
            tcpStreamOverlay.classList.add('active');
        } else {
            tcpStreamOverlay.classList.remove('active');
        }
    }

    if (wsFollowStreamBtn) wsFollowStreamBtn.addEventListener('click', () => toggleTcpStreamModal(true));
    if (closeTcpStreamBtn) closeTcpStreamBtn.addEventListener('click', () => toggleTcpStreamModal(false));
    if (closeTcpStreamBtnBottom) closeTcpStreamBtnBottom.addEventListener('click', () => toggleTcpStreamModal(false));

    if (tcpStreamOverlay) {
        tcpStreamOverlay.addEventListener('click', (e) => {
            if (e.target === tcpStreamOverlay) toggleTcpStreamModal(false);
        });
    }

    if (openNotesBtn) openNotesBtn.addEventListener('click', () => toggleNotesModal(true));
    if (closeNotesBtn) closeNotesBtn.addEventListener('click', () => toggleNotesModal(false));
    if (modalTopicSelect) modalTopicSelect.addEventListener('change', updateModalNotes);

    if (notesOverlay) {
        notesOverlay.addEventListener('click', (e) => {
            if (e.target === notesOverlay) toggleNotesModal(false);
        });
    }

    document.addEventListener('keydown', (e) => {
        if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
        if (e.key === 'n' || e.key === 'N') {
            e.preventDefault();
            toggleNotesModal(!notesOverlay.classList.contains('active'));
        } else if (e.key === 'Escape') {
            toggleNotesModal(false);
            toggleTcpStreamModal(false);
        }
    });

    updateModalNotes();

    const revealElements = document.querySelectorAll(
        '.section-label, .section-heading, .section-summary, ' +
        '.interactive-simulation-frame, .port-explorer-panel, ' +
        '.tools-grid-3col, .lab-timeline-container, .conclusion-tiles-grid, ' +
        '.hero-meta-pill, .hero-description, .hero-author-card, .hero-actions-flex'
    );

    revealElements.forEach(el => el.classList.add('reveal-element'));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    const heroTitle = document.querySelector('.hero-main-title');
    if (heroTitle) {
        heroTitle.innerHTML = '';
        heroTitle.style.visibility = 'visible';

        const part1 = 'Herramientas de ';
        const part2 = 'análisis y hacking';
        const part3 = ' de redes';

        const spanPart1 = document.createTextNode('');
        const spanPart2 = document.createElement('span');
        const spanPart3 = document.createTextNode('');
        const cursor = document.createElement('span');
        cursor.classList.add('hero-typing-cursor');

        heroTitle.appendChild(spanPart1);
        heroTitle.appendChild(spanPart2);
        heroTitle.appendChild(spanPart3);
        heroTitle.appendChild(cursor);

        let p1Idx = 0, p2Idx = 0, p3Idx = 0;

        function typeHero() {
            if (p1Idx < part1.length) {
                spanPart1.nodeValue += part1[p1Idx++];
                setTimeout(typeHero, 30 + Math.random() * 25);
            } else if (p2Idx < part2.length) {
                spanPart2.textContent += part2[p2Idx++];
                setTimeout(typeHero, 35 + Math.random() * 30);
            } else if (p3Idx < part3.length) {
                spanPart3.nodeValue += part3[p3Idx++];
                setTimeout(typeHero, 30 + Math.random() * 25);
            } else {
                setTimeout(() => {
                    cursor.style.transition = 'opacity 0.8s ease';
                    cursor.style.opacity = '0';
                    setTimeout(() => cursor.remove(), 800);
                }, 4000);
            }
        }

        setTimeout(typeHero, 280);
    }

    function ensureTerminalCursor(containerId) {
        const el = document.getElementById(containerId);
        if (!el) return;
        let cur = el.querySelector('.terminal-cursor');
        if (!cur) {
            cur = document.createElement('span');
            cur.className = 'terminal-cursor';
            el.appendChild(cur);
        } else {
            el.appendChild(cur);
        }
    }

    ensureTerminalCursor('nmap-terminal-output');
    ensureTerminalCursor('bettercap-terminal-screen');

    ['nmap-terminal-output', 'bettercap-terminal-screen'].forEach(id => {
        const target = document.getElementById(id);
        if (target) {
            const observer = new MutationObserver(() => {
                setTimeout(() => ensureTerminalCursor(id), 30);
            });
            observer.observe(target, { childList: true, subtree: true });
        }
    });

    let audioCtx = null;

    function playKeystrokeSound(pitch = 950, vol = 0.028) {
        try {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(pitch + (Math.random() * 160 - 80), audioCtx.currentTime);

            gain.gain.setValueAtTime(vol, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.045);

            osc.start(audioCtx.currentTime);
            osc.stop(audioCtx.currentTime + 0.045);
        } catch (e) {
        }
    }

    /* =============================================
       NMAP CYBER VIDEO PLAYER & CINEMA MODE
       ============================================= */
    const nmapDemoVideo = document.getElementById('nmap-demo-video');
    const nmapPlayerContainer = document.getElementById('nmap-player-container');
    const nmapVideoViewport = document.getElementById('nmap-video-viewport');
    const nmapBigPlayBtn = document.getElementById('nmap-big-play-btn');
    const nmapVideoControls = document.getElementById('nmap-video-controls');

    const ctrlPlayPauseBtn = document.getElementById('ctrl-play-pause-btn');
    const ctrlIconPlay = document.getElementById('ctrl-icon-play');
    const ctrlIconPause = document.getElementById('ctrl-icon-pause');

    const ctrlRewindBtn = document.getElementById('ctrl-rewind-btn');
    const ctrlForwardBtn = document.getElementById('ctrl-forward-btn');

    const ctrlMuteBtn = document.getElementById('ctrl-mute-btn');
    const volIconHigh = document.getElementById('vol-icon-high');
    const volIconMute = document.getElementById('vol-icon-mute');
    const ctrlVolumeSlider = document.getElementById('ctrl-volume-slider');

    const ctrlCurrentTime = document.getElementById('ctrl-current-time');
    const ctrlDurationTime = document.getElementById('ctrl-duration-time');

    const ctrlSpeedBtn = document.getElementById('ctrl-speed-btn');
    const ctrlCinemaBtn = document.getElementById('ctrl-cinema-btn');
    const btnOpenCinemaTop = document.getElementById('btn-open-cinema-top');
    const ctrlFullscreenBtn = document.getElementById('ctrl-fullscreen-btn');
    const fsIconEnter = document.getElementById('fs-icon-enter');
    const fsIconExit = document.getElementById('fs-icon-exit');

    const cyberScrubberWrap = document.getElementById('cyber-scrubber-wrap');
    const cyberScrubberTrack = document.getElementById('cyber-scrubber-track');
    const scrubberBufferBar = document.getElementById('scrubber-buffer-bar');
    const scrubberProgressBar = document.getElementById('scrubber-progress-bar');
    const scrubberHandle = document.getElementById('scrubber-handle');
    const scrubberTooltip = document.getElementById('scrubber-tooltip');

    const cinemaModalOverlay = document.getElementById('cinema-modal-overlay');
    const cinemaBodyViewport = document.getElementById('cinema-body-viewport');
    const closeCinemaModalBtn = document.getElementById('close-cinema-modal-btn');
    const closeCinemaBottomBtn = document.getElementById('close-cinema-bottom-btn');

    const chapterPillBtns = document.querySelectorAll('.chapter-pill-btn:not(.finale-pill-btn)');
    const nmapGotoDemoBtn = document.getElementById('nmap-goto-demo-btn');

    // Grand Finale elements
    const finaleTransitionOverlay = document.getElementById('finale-transition-overlay');
    const finaleOutroOverlay = document.getElementById('finale-outro-overlay');
    const btnToggleVideoMode = document.getElementById('btn-toggle-video-mode');
    const cinemaModeToggleBtn = document.getElementById('cinema-toggle-mode-btn');
    const chapterFinalePill = document.getElementById('chapter-finale-pill');
    const btnReplayFinale = document.getElementById('btn-replay-finale');
    const btnReturnNmapDemo = document.getElementById('btn-return-nmap-demo');
    const btnSkipToFinale = document.getElementById('btn-skip-to-finale');
    const btnCancelTransition = document.getElementById('btn-cancel-transition');
    const finaleCountdownNum = document.getElementById('finale-countdown-num');
    const finaleLoaderBar = document.getElementById('finale-loader-bar');
    const nmapWindowLabel = document.getElementById('nmap-window-label');
    const nmapBadgeStatus = document.getElementById('nmap-badge-status');
    const nmapBadgeRes = document.getElementById('nmap-badge-res');
    const cinemaTitleLabel = document.getElementById('cinema-title-label');
    const cinemaBadgeStatus = document.getElementById('cinema-badge-status');
    const demoChaptersBar = document.getElementById('demo-chapters-bar') || document.querySelector('.demo-chapters-bar');

    if (nmapDemoVideo && nmapVideoViewport) {
        let isCinemaActive = false;
        let isScrubbing = false;
        let idleTimer = null;
        const PLAYBACK_SPEEDS = [1.0, 1.25, 1.5, 2.0, 0.75];
        let currentSpeedIndex = 0;

        // ---- Grand Finale State ----
        const FINALE_VIDEO_SRCS = ['assets/video-pepem.mp4', 'video pepem.mp4'];
        let isFinaleMode = false;   // true when showing "video pepem"
        let finaleTriggeredOnce = false;

        function setFinaleMode(enable) {
            isFinaleMode = enable;

            // Update video source
            nmapDemoVideo.pause();
            nmapDemoVideo.currentTime = 0;
            if (ctrlDurationTime) ctrlDurationTime.textContent = '--:--';
            if (ctrlCurrentTime) ctrlCurrentTime.textContent = '00:00';
            if (scrubberProgressBar) scrubberProgressBar.style.width = '0%';
            if (scrubberHandle) scrubberHandle.style.left = '0%';

            if (enable) {
                // Switch to finale video
                nmapDemoVideo.innerHTML = '';
                FINALE_VIDEO_SRCS.forEach(s => {
                    const src = document.createElement('source');
                    src.src = s;
                    src.type = 'video/mp4';
                    nmapDemoVideo.appendChild(src);
                });
                nmapDemoVideo.load();

                // Update titlebar UI
                if (nmapWindowLabel) nmapWindowLabel.textContent = '🔥 gran-final.mp4 · Video Pepem';
                if (nmapBadgeStatus) {
                    nmapBadgeStatus.innerHTML = '<span class="rec-pulsing-dot" style="background:#f59e0b;box-shadow:0 0 8px #f59e0b"></span> GRAN FINAL';
                    nmapBadgeStatus.style.background = 'rgba(245,158,11,0.15)';
                    nmapBadgeStatus.style.borderColor = 'rgba(245,158,11,0.4)';
                    nmapBadgeStatus.style.color = '#fbbf24';
                }
                if (nmapBadgeRes) nmapBadgeRes.textContent = '🏆 EPILOGO';
                if (cinemaTitleLabel) cinemaTitleLabel.textContent = '🔥 Gran Final del Laboratorio · Video Pepem';
                if (cinemaBadgeStatus) {
                    cinemaBadgeStatus.innerHTML = '<span class="rec-pulsing-dot" style="background:#f59e0b;box-shadow:0 0 8px #f59e0b"></span> GRAN FINAL';
                    cinemaBadgeStatus.style.background = 'rgba(245,158,11,0.15)';
                    cinemaBadgeStatus.style.borderColor = 'rgba(245,158,11,0.4)';
                    cinemaBadgeStatus.style.color = '#fbbf24';
                }
                if (chapterFinalePill) chapterFinalePill.classList.add('active');

                // Toggle buttons
                const toggleLabel = '⏮ Ver Demo Nmap';
                if (btnToggleVideoMode) { btnToggleVideoMode.textContent = toggleLabel; btnToggleVideoMode.title = 'Volver a Demo Nmap'; }
                if (cinemaModeToggleBtn) { cinemaModeToggleBtn.textContent = toggleLabel; cinemaModeToggleBtn.title = 'Volver a Demo Nmap'; }

                // Hide chapters bar for the final video
                if (demoChaptersBar) demoChaptersBar.classList.add('is-hidden');

                // Hide outro if visible
                if (finaleOutroOverlay) finaleOutroOverlay.style.display = 'none';

                nmapDemoVideo.play().catch(() => {});
            } else {
                // Restore chapters bar for Nmap demo
                if (demoChaptersBar) demoChaptersBar.classList.remove('is-hidden');

                // Switch back to Nmap demo
                nmapDemoVideo.innerHTML = '';
                const s1 = document.createElement('source');
                s1.src = 'assets/demo-nmap.mp4'; s1.type = 'video/mp4';
                const s2 = document.createElement('source');
                s2.src = 'DEMO NMAP.mp4'; s2.type = 'video/mp4';
                nmapDemoVideo.appendChild(s1);
                nmapDemoVideo.appendChild(s2);
                nmapDemoVideo.load();

                // Restore titlebar
                if (nmapWindowLabel) nmapWindowLabel.textContent = 'kali@auditor:~/lab# ./demo-nmap.mp4';
                if (nmapBadgeStatus) {
                    nmapBadgeStatus.innerHTML = '<span class="rec-pulsing-dot"></span> LIVE DEMO';
                    nmapBadgeStatus.style.background = 'rgba(239,68,68,0.15)';
                    nmapBadgeStatus.style.borderColor = 'rgba(239,68,68,0.35)';
                    nmapBadgeStatus.style.color = '#f87171';
                }
                if (nmapBadgeRes) nmapBadgeRes.textContent = '1080p FHD';
                if (cinemaTitleLabel) cinemaTitleLabel.textContent = 'Demostración en Vivo: Nmap en Kali Linux';
                if (cinemaBadgeStatus) {
                    cinemaBadgeStatus.innerHTML = '<span class="rec-pulsing-dot"></span> LIVE REC';
                    cinemaBadgeStatus.style.background = '';
                    cinemaBadgeStatus.style.borderColor = '';
                    cinemaBadgeStatus.style.color = '';
                }
                if (chapterFinalePill) chapterFinalePill.classList.remove('active');

                const toggleLabel = '🔥 Ver Gran Final';
                if (btnToggleVideoMode) { btnToggleVideoMode.textContent = toggleLabel; btnToggleVideoMode.title = 'Alternar entre Demo Nmap y Gran Final'; }
                if (cinemaModeToggleBtn) { cinemaModeToggleBtn.textContent = toggleLabel; cinemaModeToggleBtn.title = 'Alternar entre Demo Nmap y Gran Final'; }

                // Hide overlays
                cancelFinaleTransition();
                if (finaleOutroOverlay) finaleOutroOverlay.style.display = 'none';
            }
        }

        let finaleTransitionTimer = null;
        let finaleCountdownInterval = null;

        function cancelFinaleTransition() {
            if (finaleTransitionTimer) {
                clearTimeout(finaleTransitionTimer);
                finaleTransitionTimer = null;
            }
            if (finaleCountdownInterval) {
                clearInterval(finaleCountdownInterval);
                finaleCountdownInterval = null;
            }
            if (finaleTransitionOverlay) {
                finaleTransitionOverlay.style.display = 'none';
            }
            if (finaleLoaderBar) {
                finaleLoaderBar.style.transition = 'none';
                finaleLoaderBar.style.width = '0%';
            }
            if (!isFinaleMode && demoChaptersBar) {
                demoChaptersBar.classList.remove('is-hidden');
            }
        }

        function triggerFinaleSequence() {
            // Cancel any prior transition
            cancelFinaleTransition();

            // Once Nmap demo finishes, immediately hide the chapters bar
            if (demoChaptersBar) demoChaptersBar.classList.add('is-hidden');

            if (!finaleTransitionOverlay) {
                setFinaleMode(true);
                return;
            }

            // Display HUD overlay
            finaleTransitionOverlay.style.display = 'flex';

            const TOTAL_DURATION_SEC = 6; // 6 seconds duration for full readability and cinematic impact
            let remainingSec = TOTAL_DURATION_SEC;

            if (finaleCountdownNum) {
                finaleCountdownNum.textContent = `${remainingSec}s`;
            }

            // Animate progress bar smoothly over the 6 seconds
            if (finaleLoaderBar) {
                finaleLoaderBar.style.transition = 'none';
                finaleLoaderBar.style.width = '0%';
                void finaleLoaderBar.offsetWidth; // force browser layout recalculation
                finaleLoaderBar.style.transition = `width ${TOTAL_DURATION_SEC}s linear`;
                finaleLoaderBar.style.width = '100%';
            }

            // Countdown ticker updating every second
            finaleCountdownInterval = setInterval(() => {
                remainingSec -= 1;
                if (remainingSec >= 0 && finaleCountdownNum) {
                    finaleCountdownNum.textContent = `${remainingSec}s`;
                }
                if (remainingSec <= 0) {
                    clearInterval(finaleCountdownInterval);
                    finaleCountdownInterval = null;
                }
            }, 1000);

            // Once 6s elapsed, transition smoothly to the Grand Finale video
            finaleTransitionTimer = setTimeout(() => {
                cancelFinaleTransition();
                setFinaleMode(true);
            }, TOTAL_DURATION_SEC * 1000);
        }

        function formatVideoTime(seconds) {
            if (isNaN(seconds) || !isFinite(seconds)) return '00:00';
            const s = Math.floor(seconds);
            const m = Math.floor(s / 60);
            const remSec = s % 60;
            return `${m < 10 ? '0' : ''}${m}:${remSec < 10 ? '0' : ''}${remSec}`;
        }

        function togglePlay() {
            if (nmapDemoVideo.paused || nmapDemoVideo.ended) {
                nmapDemoVideo.play().catch(() => {});
            } else {
                nmapDemoVideo.pause();
            }
        }

        function syncPlayState(playing) {
            if (playing) {
                if (ctrlIconPlay) ctrlIconPlay.style.display = 'none';
                if (ctrlIconPause) ctrlIconPause.style.display = 'block';
                if (nmapBigPlayBtn) nmapBigPlayBtn.classList.add('playing');
                nmapVideoViewport.classList.add('is-playing');
                resetIdleTimer();
            } else {
                if (ctrlIconPlay) ctrlIconPlay.style.display = 'block';
                if (ctrlIconPause) ctrlIconPause.style.display = 'none';
                if (nmapBigPlayBtn) nmapBigPlayBtn.classList.remove('playing');
                nmapVideoViewport.classList.remove('is-playing');
                nmapVideoViewport.classList.remove('user-idle');
                if (idleTimer) clearTimeout(idleTimer);
            }
        }

        function updateProgress() {
            if (isScrubbing) return;
            const cur = nmapDemoVideo.currentTime || 0;
            const dur = nmapDemoVideo.duration || 0;

            if (ctrlCurrentTime) ctrlCurrentTime.textContent = formatVideoTime(cur);

            if (dur > 0) {
                const pct = (cur / dur) * 100;
                if (scrubberProgressBar) scrubberProgressBar.style.width = `${pct}%`;
                if (scrubberHandle) scrubberHandle.style.left = `${pct}%`;
            }

            // Update chapter pill active status
            chapterPillBtns.forEach((btn, idx) => {
                const btnTime = parseFloat(btn.dataset.time || '0');
                const nextBtn = chapterPillBtns[idx + 1];
                const nextTime = nextBtn ? parseFloat(nextBtn.dataset.time || '9999') : Infinity;
                if (cur >= btnTime && cur < nextTime) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }

        function updateBuffer() {
            if (!scrubberBufferBar || !nmapDemoVideo.buffered.length || !nmapDemoVideo.duration) return;
            try {
                const lastBuffered = nmapDemoVideo.buffered.end(nmapDemoVideo.buffered.length - 1);
                const pct = (lastBuffered / nmapDemoVideo.duration) * 100;
                scrubberBufferBar.style.width = `${Math.min(100, pct)}%`;
            } catch (e) {}
        }

        function seekFromEvent(e) {
            if (!cyberScrubberTrack || !nmapDemoVideo.duration) return;
            const rect = cyberScrubberTrack.getBoundingClientRect();
            const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            nmapDemoVideo.currentTime = pos * nmapDemoVideo.duration;
            if (scrubberProgressBar) scrubberProgressBar.style.width = `${pos * 100}%`;
            if (scrubberHandle) scrubberHandle.style.left = `${pos * 100}%`;
            if (ctrlCurrentTime) ctrlCurrentTime.textContent = formatVideoTime(nmapDemoVideo.currentTime);
        }

        function resetIdleTimer() {
            nmapVideoViewport.classList.remove('user-idle');
            if (idleTimer) clearTimeout(idleTimer);
            if (!nmapDemoVideo.paused && !nmapDemoVideo.ended) {
                idleTimer = setTimeout(() => {
                    nmapVideoViewport.classList.add('user-idle');
                }, 2500);
            }
        }

        // Toggle Cinema Mode
        function toggleCinemaMode(open) {
            if (!cinemaModalOverlay || !cinemaBodyViewport || !nmapPlayerContainer) return;
            isCinemaActive = (open !== undefined) ? open : !isCinemaActive;

            if (isCinemaActive) {
                cinemaBodyViewport.appendChild(nmapVideoViewport);
                cinemaModalOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            } else {
                const chaptersBar = nmapPlayerContainer.querySelector('.demo-chapters-bar');
                if (chaptersBar) {
                    nmapPlayerContainer.insertBefore(nmapVideoViewport, chaptersBar);
                } else {
                    nmapPlayerContainer.appendChild(nmapVideoViewport);
                }
                cinemaModalOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        }

        // Toggle Fullscreen
        function toggleFullscreen() {
            const isFs = document.fullscreenElement || document.webkitFullscreenElement;
            if (isFs) {
                if (document.exitFullscreen) document.exitFullscreen();
                else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
            } else {
                const target = nmapVideoViewport;
                if (target.requestFullscreen) target.requestFullscreen();
                else if (target.webkitRequestFullscreen) target.webkitRequestFullscreen();
            }
        }

        function syncFullscreenIcons() {
            const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement);
            if (fsIconEnter && fsIconExit) {
                fsIconEnter.style.display = isFs ? 'none' : 'block';
                fsIconExit.style.display = isFs ? 'block' : 'none';
            }
        }

        // Event Listeners
        nmapDemoVideo.addEventListener('play', () => syncPlayState(true));
        nmapDemoVideo.addEventListener('pause', () => syncPlayState(false));
        nmapDemoVideo.addEventListener('ended', () => {
            syncPlayState(false);
            if (!isFinaleMode && !finaleTriggeredOnce) {
                // Nmap demo just finished → auto-trigger Gran Final
                finaleTriggeredOnce = true;
                triggerFinaleSequence();
            } else if (isFinaleMode) {
                // Gran Final video finished → show Outro overlay
                if (finaleOutroOverlay) finaleOutroOverlay.style.display = 'flex';
            }
        });
        nmapDemoVideo.addEventListener('timeupdate', updateProgress);
        nmapDemoVideo.addEventListener('progress', updateBuffer);
        nmapDemoVideo.addEventListener('loadedmetadata', () => {
            if (ctrlDurationTime) ctrlDurationTime.textContent = formatVideoTime(nmapDemoVideo.duration);
        });

        if (nmapBigPlayBtn) nmapBigPlayBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            togglePlay();
        });

        if (ctrlPlayPauseBtn) ctrlPlayPauseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            togglePlay();
        });

        nmapVideoViewport.addEventListener('click', (e) => {
            if (e.target.closest('#nmap-video-controls') || e.target.closest('#nmap-big-play-btn')) return;
            if (e.target.closest('#finale-transition-overlay') || e.target.closest('#finale-outro-overlay')) return;
            togglePlay();
        });

        if (ctrlRewindBtn) ctrlRewindBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            nmapDemoVideo.currentTime = Math.max(0, (nmapDemoVideo.currentTime || 0) - 10);
        });

        if (ctrlForwardBtn) ctrlForwardBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const dur = nmapDemoVideo.duration || Infinity;
            nmapDemoVideo.currentTime = Math.min(dur, (nmapDemoVideo.currentTime || 0) + 10);
        });

        // Volume controls
        if (ctrlVolumeSlider) {
            ctrlVolumeSlider.addEventListener('input', () => {
                nmapDemoVideo.volume = parseFloat(ctrlVolumeSlider.value);
                nmapDemoVideo.muted = (nmapDemoVideo.volume === 0);
                if (volIconHigh && volIconMute) {
                    volIconHigh.style.display = nmapDemoVideo.muted ? 'none' : 'block';
                    volIconMute.style.display = nmapDemoVideo.muted ? 'block' : 'none';
                }
            });
        }

        if (ctrlMuteBtn) {
            ctrlMuteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                nmapDemoVideo.muted = !nmapDemoVideo.muted;
                if (volIconHigh && volIconMute) {
                    volIconHigh.style.display = nmapDemoVideo.muted ? 'none' : 'block';
                    volIconMute.style.display = nmapDemoVideo.muted ? 'block' : 'none';
                }
                if (ctrlVolumeSlider && !nmapDemoVideo.muted && nmapDemoVideo.volume === 0) {
                    nmapDemoVideo.volume = 0.5;
                    ctrlVolumeSlider.value = 0.5;
                }
            });
        }

        // Speed toggle
        if (ctrlSpeedBtn) {
            ctrlSpeedBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                currentSpeedIndex = (currentSpeedIndex + 1) % PLAYBACK_SPEEDS.length;
                const spd = PLAYBACK_SPEEDS[currentSpeedIndex];
                nmapDemoVideo.playbackRate = spd;
                ctrlSpeedBtn.textContent = `${spd.toFixed(1)}x`;
            });
        }

        // Scrubber events
        if (cyberScrubberWrap) {
            cyberScrubberWrap.addEventListener('mousedown', (e) => {
                isScrubbing = true;
                seekFromEvent(e);
            });

            cyberScrubberWrap.addEventListener('mousemove', (e) => {
                if (!scrubberTooltip || !cyberScrubberTrack || !nmapDemoVideo.duration) return;
                const rect = cyberScrubberTrack.getBoundingClientRect();
                const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                const previewSec = pos * nmapDemoVideo.duration;
                scrubberTooltip.textContent = formatVideoTime(previewSec);
                scrubberTooltip.style.left = `${pos * 100}%`;
                if (isScrubbing) seekFromEvent(e);
            });

            window.addEventListener('mouseup', () => {
                if (isScrubbing) {
                    isScrubbing = false;
                }
            });
        }

        // Idle detection on viewport
        nmapVideoViewport.addEventListener('mousemove', resetIdleTimer);
        nmapVideoViewport.addEventListener('mouseenter', resetIdleTimer);
        nmapVideoViewport.addEventListener('mouseleave', () => {
            if (!nmapDemoVideo.paused && !nmapDemoVideo.ended) {
                nmapVideoViewport.classList.add('user-idle');
            }
        });

        // Cinema Mode controls
        if (ctrlCinemaBtn) ctrlCinemaBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleCinemaMode(true);
        });
        if (btnOpenCinemaTop) btnOpenCinemaTop.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleCinemaMode(true);
        });
        if (closeCinemaModalBtn) closeCinemaModalBtn.addEventListener('click', () => toggleCinemaMode(false));
        if (closeCinemaBottomBtn) closeCinemaBottomBtn.addEventListener('click', () => toggleCinemaMode(false));

        if (cinemaModalOverlay) {
            cinemaModalOverlay.addEventListener('click', (e) => {
                if (e.target === cinemaModalOverlay) toggleCinemaMode(false);
            });
        }

        // Fullscreen toggle
        if (ctrlFullscreenBtn) ctrlFullscreenBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFullscreen();
        });
        document.addEventListener('fullscreenchange', syncFullscreenIcons);
        document.addEventListener('webkitfullscreenchange', syncFullscreenIcons);

        // Chapter pills (nmap chapters)
        chapterPillBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (isFinaleMode) {
                    // Return to nmap demo first
                    setFinaleMode(false);
                    finaleTriggeredOnce = false;
                    setTimeout(() => {
                        const targetSec = parseFloat(btn.dataset.time || '0');
                        nmapDemoVideo.currentTime = targetSec;
                        nmapDemoVideo.play().catch(() => {});
                    }, 150);
                } else {
                    const targetSec = parseFloat(btn.dataset.time || '0');
                    nmapDemoVideo.currentTime = targetSec;
                    nmapDemoVideo.play().catch(() => {});
                }
            });
        });

        // Grand Finale chapter pill
        if (chapterFinalePill) {
            chapterFinalePill.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!isFinaleMode) {
                    triggerFinaleSequence();
                } else {
                    // Already in finale mode, replay from start
                    if (finaleOutroOverlay) finaleOutroOverlay.style.display = 'none';
                    nmapDemoVideo.currentTime = 0;
                    nmapDemoVideo.play().catch(() => {});
                }
            });
        }

        // Toggle video mode buttons (both in titlebar and cinema header)
        [btnToggleVideoMode, cinemaModeToggleBtn].forEach(btn => {
            if (!btn) return;
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!isFinaleMode) {
                    triggerFinaleSequence();
                } else {
                    setFinaleMode(false);
                    finaleTriggeredOnce = false;
                }
            });
        });

        // Outro overlay action buttons
        if (btnReplayFinale) {
            btnReplayFinale.addEventListener('click', (e) => {
                e.stopPropagation();
                if (finaleOutroOverlay) finaleOutroOverlay.style.display = 'none';
                nmapDemoVideo.currentTime = 0;
                nmapDemoVideo.play().catch(() => {});
            });
        }
        if (btnReturnNmapDemo) {
            btnReturnNmapDemo.addEventListener('click', (e) => {
                e.stopPropagation();
                cancelFinaleTransition();
                setFinaleMode(false);
                finaleTriggeredOnce = false;
                if (demoChaptersBar) demoChaptersBar.classList.remove('is-hidden');
            });
        }

        // Transition HUD action buttons
        if (btnSkipToFinale) {
            btnSkipToFinale.addEventListener('click', (e) => {
                e.stopPropagation();
                cancelFinaleTransition();
                setFinaleMode(true);
            });
        }

        if (btnCancelTransition) {
            btnCancelTransition.addEventListener('click', (e) => {
                e.stopPropagation();
                cancelFinaleTransition();
                finaleTriggeredOnce = false;
                setFinaleMode(false);
                if (demoChaptersBar) demoChaptersBar.classList.remove('is-hidden');
                nmapDemoVideo.currentTime = 0;
                nmapDemoVideo.play().catch(() => {});
            });
        }

        // Shortcut button in #nmap section
        if (nmapGotoDemoBtn) {
            nmapGotoDemoBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const demoSection = document.getElementById('demostracion');
                if (demoSection) {
                    demoSection.scrollIntoView({ behavior: 'smooth' });
                    setTimeout(() => {
                        nmapDemoVideo.play().catch(() => {});
                    }, 600);
                }
            });
        }

        // Keyboard hotkeys
        window.addEventListener('keydown', (e) => {
            const isEditing = ['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement?.tagName);
            if (isEditing) return;

            // Esc closes cinema mode
            if (e.key === 'Escape' && isCinemaActive) {
                toggleCinemaMode(false);
                return;
            }

            const isHovered = nmapVideoViewport.matches(':hover') || isCinemaActive;
            if (!isHovered) return;

            if (e.key === ' ' || e.code === 'Space') {
                e.preventDefault();
                togglePlay();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                nmapDemoVideo.currentTime = Math.max(0, (nmapDemoVideo.currentTime || 0) - 5);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                const dur = nmapDemoVideo.duration || Infinity;
                nmapDemoVideo.currentTime = Math.min(dur, (nmapDemoVideo.currentTime || 0) + 5);
            } else if (e.key === 'f' || e.key === 'F') {
                e.preventDefault();
                toggleFullscreen();
            } else if (e.key === 'm' || e.key === 'M') {
                e.preventDefault();
                if (ctrlMuteBtn) ctrlMuteBtn.click();
            }
        });
    }

    document.querySelectorAll('.btn-tool-action, .btn-solid-blue, .btn-outline-subtle, .port-pill-btn, .wireshark-action-btn').forEach(btn => {
        btn.addEventListener('click', () => playKeystrokeSound(900, 0.035));
    });

    // ==========================================
    // CARDS SCROLL REVEAL & STAGGER ANIMATION
    // ==========================================
    function initCardAnimations() {
        const cards = document.querySelectorAll('.tool-executive-card, .hero-author-card, .topo-endpoint');
        if (!('IntersectionObserver' in window)) {
            cards.forEach(c => c.classList.add('is-revealed'));
            return;
        }

        cards.forEach((card, index) => {
            card.classList.add('reveal-card');
            const delay = (index % 3) * 0.1;
            card.style.transitionDelay = `${delay}s`;
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        cards.forEach(card => observer.observe(card));
    }
    initCardAnimations();

});
