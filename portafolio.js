document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       ANIMACIONES DE ENTRADA
    ========================== */

    const elementos = document.querySelectorAll(
        ".sobre-mi-contenido, .experiencia-contenido, .proyectos-contenido"
    );

    elementos.forEach((elemento) => {

        elemento.style.opacity = "0";

        elemento.style.transform = "translateY(30px)";

        elemento.style.transition =
            "opacity 0.8s ease, transform 0.8s ease";

    });

    const observer = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.style.opacity = "1";

                    entry.target.style.transform =
                        "translateY(0)";

                    observer.unobserve(entry.target);

                }

            });

        },
        {
            threshold: 0.15
        }
    );

    elementos.forEach((elemento) => {
        observer.observe(elemento);
    });


    /* =========================
       MENÚ
    ========================== */

    const menuBoton =
        document.getElementById("menu-boton");

    const menu =
        document.getElementById("menu");

    menuBoton.addEventListener("click", () => {

        menu.classList.toggle("abierto");

        menuBoton.classList.toggle("abierto");

    });

    const enlacesMenu =
        document.querySelectorAll(".menu a");

    enlacesMenu.forEach((enlace) => {

        enlace.addEventListener("click", () => {

            menu.classList.remove("abierto");

            menuBoton.classList.remove("abierto");

        });

    });


    /* =========================
       CAMBIO DE IDIOMA
    ========================== */

    const esBtn =
        document.getElementById("es-btn");

    const enBtn =
        document.getElementById("en-btn");

    function cambiarIdioma(idioma) {

        const elementosTraducibles =
            document.querySelectorAll("[data-es][data-en]");

        elementosTraducibles.forEach((elemento) => {

            elemento.textContent =
                elemento.dataset[idioma];

        });

        document.documentElement.lang =
            idioma === "es" ? "es" : "en";


        if (idioma === "es") {

            esBtn.classList.add("idioma-activo");

            enBtn.classList.remove("idioma-activo");

        } else {

            enBtn.classList.add("idioma-activo");

            esBtn.classList.remove("idioma-activo");

        }

    }

    esBtn.addEventListener("click", () => {
        cambiarIdioma("es");
    });

    enBtn.addEventListener("click", () => {
        cambiarIdioma("en");
    });


    /* =========================
       CARRUSEL EXPERIENCIA
    ========================== */

    const track =
        document.getElementById("experiencia-track");

    const anterior =
        document.getElementById("anterior");

    const siguiente =
        document.getElementById("siguiente");

    const indicadores =
        document.querySelectorAll(".indicador");


    /*
        IMPORTANTE:

        Las tarjetas originales son:

        1. DAM
        2. INECO
        3. Velvet
        4. Tajamar

        Añadimos:

        [Tajamar CLON]
        [DAM]
        [INECO]
        [Velvet]
        [Tajamar]
        [DAM CLON]

        Empezamos en la primera tarjeta REAL,
        es decir, en la posición 1.
    */


    let tarjetas =
        Array.from(
            document.querySelectorAll(".experiencia-card")
        );


    /* =========================
       CREAR CLONES
    ========================== */

    const primeraTarjeta =
        tarjetas[0].cloneNode(true);

    const ultimaTarjeta =
        tarjetas[tarjetas.length - 1].cloneNode(true);


    primeraTarjeta.classList.add(
        "experiencia-clon-primera"
    );

    ultimaTarjeta.classList.add(
        "experiencia-clon-ultima"
    );


    track.appendChild(primeraTarjeta);

    track.insertBefore(
        ultimaTarjeta,
        track.firstChild
    );


    /* Actualizamos la lista incluyendo clones */

    tarjetas =
        Array.from(
            document.querySelectorAll(".experiencia-card")
        );


    /*
        Ahora tenemos:

        índice 0 = clon Tajamar
        índice 1 = DAM
        índice 2 = INECO
        índice 3 = Velvet
        índice 4 = Tajamar
        índice 5 = clon DAM
    */

    let indiceActual = 1;

    let temporizador;


    /* =========================
       POSICIÓN INICIAL
    ========================== */

    track.style.transition = "none";

    track.style.transform =
        "translateX(-100%)";


    actualizarIndicadores();


    /* =========================
       ACTUALIZAR INDICADORES
    ========================== */

    function actualizarIndicadores() {

        let indicadorActivo;

        /*
            Convertimos el índice del clon/carrusel
            al índice real:

            1 → 0
            2 → 1
            3 → 2
            4 → 3
        */

        if (indiceActual === 0) {

            indicadorActivo =
                tarjetas.length - 3;

        } else if (
            indiceActual === tarjetas.length - 1
        ) {

            indicadorActivo = 0;

        } else {

            indicadorActivo =
                indiceActual - 1;

        }


        indicadores.forEach((indicador, i) => {

            indicador.classList.toggle(
                "activo",
                i === indicadorActivo
            );

        });

    }


    /* =========================
       MOVER CARRUSEL
    ========================== */

    function moverCarrusel() {

        track.style.transition =
            "transform 0.7s ease";

        track.style.transform =
            `translateX(-${indiceActual * 100}%)`;

        actualizarIndicadores();

    }


    /* =========================
       SIGUIENTE
       
       1 → 2 → 3 → 4 → 1
    ========================== */

    function siguienteExperiencia() {

        indiceActual++;

        moverCarrusel();

        reiniciarTemporizador();

    }


    /* =========================
       ANTERIOR

       1 → 4 → 3 → 2 → 1
    ========================== */

    function anteriorExperiencia() {

        indiceActual--;

        moverCarrusel();

        reiniciarTemporizador();

    }


    /* =========================
       TRANSICIÓN INFINITA
    ========================== */

    track.addEventListener(
        "transitionend",
        () => {

            /*
                Si hemos llegado al CLON DE DAM:

                Tajamar → clon DAM

                hacemos un salto invisible
                hasta DAM REAL.
            */

            if (
                tarjetas[indiceActual].classList.contains(
                    "experiencia-clon-primera"
                )
            ) {

                indiceActual = 1;

                track.style.transition = "none";

                track.style.transform =
                    "translateX(-100%)";

                actualizarIndicadores();

            }


            /*
                Si hemos llegado al CLON DE TAJAMAR:

                DAM → clon Tajamar

                hacemos un salto invisible
                hasta Tajamar REAL.
            */

            if (
                tarjetas[indiceActual].classList.contains(
                    "experiencia-clon-ultima"
                )
            ) {

                indiceActual =
                    tarjetas.length - 2;

                track.style.transition = "none";

                track.style.transform =
                    `translateX(-${indiceActual * 100}%)`;

                actualizarIndicadores();

            }

        }
    );


    /* =========================
       BOTÓN SIGUIENTE
    ========================== */

    siguiente.addEventListener(
        "click",
        () => {

            siguienteExperiencia();

        }
    );


    /* =========================
       BOTÓN ANTERIOR
    ========================== */

    anterior.addEventListener(
        "click",
        () => {

            anteriorExperiencia();

        }
    );


    /* =========================
       INDICADORES
    ========================== */

    indicadores.forEach((indicador) => {

        indicador.addEventListener(
            "click",
            () => {

                /*
                    El indicador 0 corresponde
                    a la tarjeta real en índice 1.

                    El indicador 1 → índice 2.

                    etc.
                */

                const indice =
                    Number(
                        indicador.dataset.index
                    );

                indiceActual =
                    indice + 1;


                track.style.transition =
                    "transform 0.7s ease";


                track.style.transform =
                    `translateX(-${indiceActual * 100}%)`;


                actualizarIndicadores();

                reiniciarTemporizador();

            }
        );

    });


    /* =========================
       AUTOPLAY
       
       18 SEGUNDOS
    ========================== */

    function reiniciarTemporizador() {

        clearInterval(temporizador);

        temporizador =
            setInterval(() => {

                indiceActual++;

                moverCarrusel();

            }, 18000);

    }


    reiniciarTemporizador();


    /* =========================
       PAUSAR AL PASAR EL RATÓN
    ========================== */

    const carrusel =
        document.querySelector(
            ".experiencia-carrusel"
        );


    carrusel.addEventListener(
        "mouseenter",
        () => {

            clearInterval(temporizador);

        }
    );


    /* =========================
       REANUDAR AL SALIR
    ========================== */

    carrusel.addEventListener(
        "mouseleave",
        () => {

            reiniciarTemporizador();

        }
    );

});