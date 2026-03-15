// registrar plugin
gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.config({
    limitCallbacks: true
});


// ===== THREE.JS - REDE DE PARTÍCULAS =====
function initThreeNetwork(isMobile = false) {

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !isMobile,
        powerPreference: "high-performance"
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setClearColor(0x000000, 0);

    document
        .getElementById('network-canvas')
        .appendChild(renderer.domElement);


    const particlesCount = isMobile ? 300 : 800;

    const particlesGeometry = new THREE.BufferGeometry();

    const particlesPositions = new Float32Array(particlesCount * 3);
    const basePositions = new Float32Array(particlesCount * 3);
    const particlesColors = new Float32Array(particlesCount * 3);


    for (let i = 0; i < particlesCount; i++) {

        const radius = 12;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);

        const x = Math.sin(phi) * Math.cos(theta) * radius;
        const y = Math.sin(phi) * Math.sin(theta) * radius;
        const z = Math.cos(phi) * radius;

        particlesPositions[i * 3] = x;
        particlesPositions[i * 3 + 1] = y;
        particlesPositions[i * 3 + 2] = z;

        basePositions[i * 3] = x;
        basePositions[i * 3 + 1] = y;
        basePositions[i * 3 + 2] = z;

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


    const particlesMaterial = new THREE.PointsMaterial({
        size: isMobile ? 0.18 : 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });


    const particles = new THREE.Points(particlesGeometry, particlesMaterial);

    particles.position.x = 6;

    scene.add(particles);


    camera.position.z = 20;

    let mouseX = 0;
    let mouseY = 0;

    if (!isMobile) {

        document.addEventListener('mousemove', (event) => {

            mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (event.clientY / window.innerHeight - 0.5) * 2;

        });

    }


    let time = 0;

    function animate() {

        requestAnimationFrame(animate);

        time += 0.001;

        particles.rotation.y += 0.0005 + mouseX * 0.0002;
        particles.rotation.x += mouseY * 0.0002;

        const positions = particles.geometry.attributes.position.array;

        for (let i = 0; i < positions.length; i += 3) {

            const wave = Math.sin(time + basePositions[i] * 0.5) * 0.02;

            positions[i + 1] = basePositions[i + 1] + wave;

        }

        particles.geometry.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
    }

    animate();


    window.addEventListener('resize', () => {

        camera.aspect = window.innerWidth / window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

    });

}



// ===== ABOUT =====
function initAboutScroll(isMobile = false) {

    const section = document.querySelector(".about-section");
    const h2s = section.querySelectorAll(".about-content__title");
    const paragraphs = gsap.utils.toArray(".about-content p");
    const extras = gsap.utils.toArray(".citation, .founder-stats, .about-visual");

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: "top top",
            end: isMobile ? "+=200%" : "+=620%",
            scrub: isMobile ? false : 2,
            pin: !isMobile,
            anticipatePin: 1,
            invalidateOnRefresh: true
        }
    });

    tl.to(h2s[0], { scale: 5, x: -800, y: -800, opacity: 0, duration: 1, ease: "power4.in" }, 0);
    tl.to(h2s[2], { scale: 5, x: 800, y: 800, opacity: 0, duration: 1, ease: "power4.in" }, 0);

    tl.fromTo(
        h2s[1],
        { opacity: 0.7, scale: 0, transformOrigin: "center center" },
        { opacity: 1, scale: isMobile ? 20 : 80, duration: 1.5, ease: "power4.in" },
        "-=0.9"
    );

    tl.to(section, { backgroundColor: "#fff", duration: 0.35, ease: "power4.out" }, "<1");

    tl.to(h2s[1], { opacity: 0, scale: isMobile ? 30 : 120, duration: 0.6, ease: "power4.out" }, "<");

    tl.fromTo(paragraphs,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, stagger: 0.2, duration: 1 }
    );

    tl.fromTo(
        extras,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
        "-=0.3"
    );
}



// ===== BENEFITS =====
function initBenefitsScroll(isMobile = false) {

    const section = document.querySelector(".benefits-section");
    const cards = gsap.utils.toArray(".benefit-card");
    const title = section.querySelector(".section-header__title");

    if (isMobile) {
        // Mobile: remover efeitos e empilhar
        gsap.set(cards, { y: 0, opacity: 1 });
        section.style.backgroundColor = ""; // mantém o fundo padrão
        title.style.opacity = 1;
        title.style.transform = "none";
        return; // não aplica animação nem ScrollTrigger
    }

    // Desktop: mantém os efeitos atuais
    gsap.set(cards, { y: "50vh" });

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=" + (cards.length * 800 + 900),
            scrub: 2,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true
        }
    });

    tl.to(section, {
        backgroundColor: "rgba(0,0,0,0.47)",
        duration: 1
    });

    tl.fromTo(
        title,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1 }
    );

    cards.forEach((card) => {
        tl.to(card, { y: 0, duration: 1.2 });
        tl.to(card, { y: "-135vh", duration: 1.5 });
    });

}



// ===== TECH =====
function initTechCarousel(isMobile = false) {

    const section = document.querySelector(".tech-section");
    const grid = document.querySelector(".tech-grid");
    const title = section.querySelector(".tech-grid__title");

    const gridWidth = grid.scrollWidth;
    const distance = gridWidth;

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: "top top",
            end: isMobile ? "+=150%" : () => `+=${section.offsetHeight + distance}`,
            scrub: !isMobile,
            pin: !isMobile,
            anticipatePin: 1,
            invalidateOnRefresh: true
        }
    });

    tl.fromTo(
        title,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1 }
    );

    if (!isMobile) {

        tl.fromTo(
            grid,
            { x: distance },
            { x: 0, ease: "none" },
            "<"
        );

    }
}

// ===== INIT RESPONSIVO =====
window.addEventListener("load", () => {

    ScrollTrigger.matchMedia({

        "(min-width: 1024px)": function () {

            initThreeNetwork(false);
            initAboutScroll(false);
            initBenefitsScroll(false);
            initTechCarousel(false);

        },

        "(max-width: 1023px)": function () {

            initThreeNetwork(true);
            initAboutScroll(true);
            initBenefitsScroll(true);
            initTechCarousel(true);

        }

    });

    ScrollTrigger.refresh();

});