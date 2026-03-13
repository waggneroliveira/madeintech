// registrar plugin
gsap.registerPlugin(ScrollTrigger);

// ===== INICIALIZAÇÃO =====
window.addEventListener('load', init);

function init() {
    initThreeNetwork();
    initBenefitsScroll();
    initAboutScroll();

    // força recalculo dos pins
    ScrollTrigger.refresh();
}

// ===== THREE.JS - REDE DE PARTÍCULAS =====
function initThreeNetwork() {

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    document
        .getElementById('network-canvas')
        .appendChild(renderer.domElement);


    // ===== CONFIGURAÇÕES =====

    const particlesCount = 800;

    const particlesGeometry = new THREE.BufferGeometry();

    const particlesPositions = new Float32Array(particlesCount * 3);
    const particlesColors = new Float32Array(particlesCount * 3);


    // ===== CRIAÇÃO DAS PARTÍCULAS =====

    for (let i = 0; i < particlesCount; i++) {

        const radius = 12;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);

        particlesPositions[i * 3] = Math.sin(phi) * Math.cos(theta) * radius;
        particlesPositions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * radius;
        particlesPositions[i * 3 + 2] = Math.cos(phi) * radius;

        // branco suave
        particlesColors[i * 3] = 0.85;
        particlesColors[i * 3 + 1] = 0.85;
        particlesColors[i * 3 + 2] = 0.85;
    }

    particlesGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(particlesPositions, 3)
    );

    particlesGeometry.setAttribute(
        'color',
        new THREE.BufferAttribute(particlesColors, 3)
    );


    // ===== MATERIAL =====

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });


    // ===== PARTICLES =====

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);

    particles.position.x = 6;

    scene.add(particles);


    // ===== CONEXÕES =====

    const connectionGeometry = new THREE.BufferGeometry();
    const connectionPositions = [];

    for (let i = 0; i < particlesCount; i++) {

        for (let j = i + 1; j < particlesCount; j++) {

            const dist = Math.sqrt(
                Math.pow(particlesPositions[i * 3] - particlesPositions[j * 3], 2) +
                Math.pow(particlesPositions[i * 3 + 1] - particlesPositions[j * 3 + 1], 2) +
                Math.pow(particlesPositions[i * 3 + 2] - particlesPositions[j * 3 + 2], 2)
            );

            if (dist < 5 && Math.random() < 0.02) {

                connectionPositions.push(
                    particlesPositions[i * 3],
                    particlesPositions[i * 3 + 1],
                    particlesPositions[i * 3 + 2],

                    particlesPositions[j * 3],
                    particlesPositions[j * 3 + 1],
                    particlesPositions[j * 3 + 2]
                );
            }
        }
    }

    connectionGeometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(connectionPositions, 3)
    );

    const connectionMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.15
    });


    const connections = new THREE.LineSegments(
        connectionGeometry,
        connectionMaterial
    );

    connections.position.x = 6;

    scene.add(connections);


    camera.position.z = 20;


    // ===== MOUSE =====

    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (event) => {

        mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (event.clientY / window.innerHeight - 0.5) * 2;

    });


    // ===== ANIMAÇÃO =====

    let time = 0;

    function animate() {

        requestAnimationFrame(animate);

        time += 0.001;

        particles.rotation.y += 0.0005 + mouseX * 0.0002;
        particles.rotation.x += mouseY * 0.0002;

        connections.rotation.y += 0.0005 + mouseX * 0.0002;
        connections.rotation.x += mouseY * 0.0002;


        const positions = particles.geometry.attributes.position.array;

        for (let i = 0; i < positions.length; i += 3) {

            const wave = Math.sin(time + positions[i] * 0.5) * 0.02;

            positions[i + 1] += wave * 0.01;

        }

        particles.geometry.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
    }

    animate();


    // ===== RESPONSIVO =====

    window.addEventListener('resize', () => {

        camera.aspect = window.innerWidth / window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

    });

    
}

function initAboutScroll() {
    const section = document.querySelector(".about-section");
    const h2s = section.querySelectorAll("h2");
    const paragraphs = gsap.utils.toArray(".about-content p");
    const extras = gsap.utils.toArray(".citation, .founder-stats, .about-visual");

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=620%", // aumenta a duração para caber todos os efeitos
            scrub: 2,
            pin: true,
            refreshPriority: 1
        }
    });

    // 1º e 3º h2: zoom e desaparecem ao rolar
    tl.to(h2s[0], { scale: 5, x: -500, y: -300, opacity: 0, duration: 1, ease: "power2.in" }, 0);
    tl.to(h2s[2], { scale: 5, x: 500, y: 300, opacity: 0, duration: 1, ease: "power2.in" }, 0);

    // 2º h2 começa antes dos outros terminarem
    tl.fromTo(
        h2s[1],
        {
            opacity: 0.7,
            scale: 0,
            transformOrigin: "center center"
        },
        {
            opacity: 1,
            scale: 80,
            duration: 1.5,
            ease: "power3.in"
        },
        "-=0.9"
    );

    // background entra exatamente no final do zoom
    tl.to(section, { 
        backgroundColor: "#fff",
        duration: 0.35,
        ease: "power2.out"
    }, "<1");

    // texto continua atravessando a tela
    tl.to(h2s[1], {
        opacity: 0,
        scale: 120,
        duration: 0.6,
        ease: "power2.out"
    }, "<");

    // exibe os parágrafos **depois da troca de cor**
    tl.fromTo(paragraphs,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, stagger: 0.2, duration: 1 }
    );

    tl.fromTo(
        extras,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
        "-=0.3"
    );
}

function initBenefitsScroll() {

    const section = document.querySelector(".benefits-section");
    const cards = gsap.utils.toArray(".benefit-card");
    const title = section.querySelector(".section-header h2");

    gsap.set(cards, { y: "50vh" });

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=" + (cards.length * 800 + 900),
            scrub: 2,
            pin: true,
            anticipatePin: 1
        }
    });

    // fundo aparece suavemente
    tl.to(section, {
        backgroundColor: "rgba(0,0,0,0.47)",
        duration: 1
    });

    // título
    tl.from(title, {
        opacity: 0,
        y: 50,
        duration: 1
    });

    cards.forEach((card) => {

        tl.to(card, { y: 0, duration: 1.2 });

        // tl.to({}, { duration: 1 });

        tl.to(card, { y: "-135vh", duration: 1.5 });

    });

}


