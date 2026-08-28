document.addEventListener("DOMContentLoaded", function () {

  function initStoryCards() {

    const cards = document.querySelectorAll(
      "#story-panels .story-card"
    );

    const mobileTabs = document.querySelectorAll(
      ".story-tab-mobile"
    );

    const mobilePanels = document.querySelectorAll(
      ".story-panel-mobile"
    );


    /* =========================================================
       CONFIG
    ========================================================= */

    const DEFAULT_CARD = 0;

    /*
      Expanded card
      7 parts wide
    */
    const ACTIVE_FLEX = "7 0 0%";

    /*
      Closed cards
      1 part wide
    */
    const CLOSED_FLEX = "1 0 0%";


    /* =========================================================
       GET CARD
    ========================================================= */

    function getCard(index) {

      return Array.from(cards).find(
        card =>
          parseInt(card.dataset.card, 10) === index
      );

    }


    /* =========================================================
       SET ACTIVE CARD
    ========================================================= */

    function setActive(index) {

      /*
        Safety:
        If invalid index is passed,
        always return to original state.
      */

      const activeCard = getCard(index);

      if (!activeCard) {
        index = DEFAULT_CARD;
      }


      /* =======================================================
         DESKTOP CARDS
      ======================================================= */

      cards.forEach((card) => {

        const cardIndex =
          parseInt(card.dataset.card, 10);

        const isActive =
          cardIndex === index;


        /* -----------------------------------------------------
           RESET FLEX FIRST

           This prevents the cards from temporarily becoming
           four equal-width cards when switching states.
        ----------------------------------------------------- */

        card.style.flex = "0 0 0%";


        /* -----------------------------------------------------
           STATE CLASSES
        ----------------------------------------------------- */

        card.classList.remove(
          "open",
          "closed"
        );

        card.classList.add(
          isActive
            ? "open"
            : "closed"
        );


        /* -----------------------------------------------------
           APPLY FINAL FLEX
        ----------------------------------------------------- */

        if (isActive) {

          card.style.flex = ACTIVE_FLEX;

        } else {

          card.style.flex = CLOSED_FLEX;

        }


        /* -----------------------------------------------------
           ACCESSIBILITY
        ----------------------------------------------------- */

        card.setAttribute(
          "aria-selected",
          isActive ? "true" : "false"
        );

        card.setAttribute(
          "aria-expanded",
          isActive ? "true" : "false"
        );


        /* =====================================================
           ACTIVE CONTENT
        ===================================================== */

        const activeContent =
          card.querySelector(
            ".story-card-active"
          );


        const collapsedContent =
          card.querySelector(
            ".story-card-collapsed"
          );


        /* -----------------------------------------------------
           ACTIVE CONTENT
        ----------------------------------------------------- */

        if (activeContent) {

          if (isActive) {

            activeContent.classList.remove(
              "hidden"
            );

            activeContent.classList.add(
              "flex"
            );

          } else {

            activeContent.classList.add(
              "hidden"
            );

            activeContent.classList.remove(
              "flex"
            );

          }

        }


        /* -----------------------------------------------------
           COLLAPSED CONTENT
        ----------------------------------------------------- */

        if (collapsedContent) {

          if (isActive) {

            /*
              Active card:
              collapsed vertical tab remains visible
              because your CSS positions it on the left.
            */

            collapsedContent.classList.remove(
              "hidden"
            );

            collapsedContent.classList.add(
              "flex"
            );

          } else {

            /*
              Closed cards:
              only collapsed vertical content.
            */

            collapsedContent.classList.remove(
              "hidden"
            );

            collapsedContent.classList.add(
              "flex"
            );

          }

        }

      });


      /* =======================================================
         FORCE LAYOUT RECALCULATION

         Prevents browser from leaving cards in an equal-width
         intermediate state.
      ======================================================= */

      void document.querySelector(
        "#story-panels"
      )?.offsetWidth;


      /* =======================================================
         MOBILE TABS
      ======================================================= */

      mobileTabs.forEach((tab) => {

        const isActive =
          tab.dataset.card === String(index);


        tab.classList.toggle(
          "is-active",
          isActive
        );


        tab.setAttribute(
          "aria-selected",
          isActive
            ? "true"
            : "false"
        );

      });


      /* =======================================================
         MOBILE PANELS
      ======================================================= */

      mobilePanels.forEach((panel) => {

        const isActive =
          panel.dataset.card === String(index);


        panel.classList.toggle(
          "hidden",
          !isActive
        );

      });

    }


    /* =========================================================
       TOGGLE CARD
    ========================================================= */

    function toggleCard(index) {

      const clickedCard =
        getCard(index);


      if (!clickedCard) {
        return;
      }


      const isAlreadyOpen =
        clickedCard.classList.contains(
          "open"
        );


      /* =======================================================
         CLICK ACTIVE CARD

         Return to ORIGINAL layout:

         01 = expanded
         02 = closed
         03 = closed
         04 = closed
      ======================================================= */

      if (isAlreadyOpen) {

        setActive(
          DEFAULT_CARD
        );

        return;
      }


      /* =======================================================
         CLICK CLOSED CARD

         Open that card.
      ======================================================= */

      setActive(index);

    }


    /* =========================================================
       DESKTOP CARD CLICK
    ========================================================= */

    cards.forEach((card) => {

      card.addEventListener(
        "click",
        function (event) {

          event.preventDefault();
          event.stopPropagation();


          const index =
            parseInt(
              this.dataset.card,
              10
            );


          toggleCard(index);

        }
      );

    });


    /* =========================================================
       MOBILE TABS

       Mobile tabs DO NOT toggle back to 01.
       They simply select the requested panel.
    ========================================================= */

    mobileTabs.forEach((tab) => {

      tab.addEventListener(
        "click",
        function (event) {

          event.preventDefault();


          const index =
            parseInt(
              this.dataset.card,
              10
            );


          setActive(index);

        }
      );

    });


    /* =========================================================
       KEYBOARD SUPPORT
    ========================================================= */

    cards.forEach((card) => {

      card.addEventListener(
        "keydown",
        function (event) {

          if (
            event.key === "Enter" ||
            event.key === " "
          ) {

            event.preventDefault();


            const index =
              parseInt(
                this.dataset.card,
                10
              );


            toggleCard(index);

          }

        }
      );

    });


    /* =========================================================
       ESCAPE KEY

       Always return to original layout.
    ========================================================= */

    document.addEventListener(
      "keydown",
      function (event) {

        if (
          event.key === "Escape"
        ) {

          setActive(
            DEFAULT_CARD
          );

        }

      }
    );


    /* =========================================================
       INITIAL STATE

       IMPORTANT:

       01 = OPEN
       02 = CLOSED
       03 = CLOSED
       04 = CLOSED
    ========================================================= */

    setActive(
      DEFAULT_CARD
    );

  }


  /* ===========================================================
     INITIALIZE
  =========================================================== */

  initStoryCards();



  /* ===========================================================
     MOBILE HORIZONTAL DRAG / SWIPE
     
     ONLY ADDED FOR SMALL DEVICES

     <= 767px

     This does NOT modify the card opening/closing logic.
  =========================================================== */

  const mobileTabsContainer =
    document.getElementById("story-tabs-mobile");


  if (mobileTabsContainer) {

    let isDragging = false;
    let startX = 0;
    let startScrollLeft = 0;
    let hasDragged = false;


    /*
      ---------------------------------------------------------
      TOUCH START
      ---------------------------------------------------------
    */

    mobileTabsContainer.addEventListener(
      "touchstart",
      function (event) {

        if (window.innerWidth > 767) {
          return;
        }

        isDragging = true;
        hasDragged = false;

        startX =
          event.touches[0].pageX -
          mobileTabsContainer.offsetLeft;

        startScrollLeft =
          mobileTabsContainer.scrollLeft;

      },
      {
        passive: true
      }
    );


    /*
      ---------------------------------------------------------
      TOUCH MOVE
      ---------------------------------------------------------
    */

    mobileTabsContainer.addEventListener(
      "touchmove",
      function (event) {

        if (!isDragging) {
          return;
        }

        if (window.innerWidth > 767) {
          return;
        }


        const x =
          event.touches[0].pageX -
          mobileTabsContainer.offsetLeft;


        const distance =
          x - startX;


        /*
          Small movement = normal tap.
          Larger movement = dragging.
        */

        if (Math.abs(distance) > 6) {
          hasDragged = true;
        }


        if (hasDragged) {

          mobileTabsContainer.scrollLeft =
            startScrollLeft - distance;

        }

      },
      {
        passive: true
      }
    );


    /*
      ---------------------------------------------------------
      TOUCH END
      ---------------------------------------------------------
    */

    mobileTabsContainer.addEventListener(
      "touchend",
      function () {

        isDragging = false;

      },
      {
        passive: true
      }
    );


    /*
      ---------------------------------------------------------
      TOUCH CANCEL
      ---------------------------------------------------------
    */

    mobileTabsContainer.addEventListener(
      "touchcancel",
      function () {

        isDragging = false;

      },
      {
        passive: true
      }
    );


    /*
      =========================================================
      MOUSE DRAG

      Useful for testing the mobile horizontal scroll
      on desktop by resizing the browser below 768px.
      =========================================================
    */

    mobileTabsContainer.addEventListener(
      "mousedown",
      function (event) {

        if (window.innerWidth > 767) {
          return;
        }

        isDragging = true;
        hasDragged = false;

        startX =
          event.pageX -
          mobileTabsContainer.offsetLeft;

        startScrollLeft =
          mobileTabsContainer.scrollLeft;

        mobileTabsContainer.classList.add(
          "is-dragging"
        );

      }
    );


    mobileTabsContainer.addEventListener(
      "mousemove",
      function (event) {

        if (!isDragging) {
          return;
        }

        if (window.innerWidth > 767) {
          return;
        }


        event.preventDefault();


        const x =
          event.pageX -
          mobileTabsContainer.offsetLeft;


        const distance =
          x - startX;


        if (Math.abs(distance) > 6) {
          hasDragged = true;
        }


        if (hasDragged) {

          mobileTabsContainer.scrollLeft =
            startScrollLeft - distance;

        }

      }
    );


    function stopMouseDrag() {

      isDragging = false;

      mobileTabsContainer.classList.remove(
        "is-dragging"
      );

    }


    mobileTabsContainer.addEventListener(
      "mouseup",
      stopMouseDrag
    );


    mobileTabsContainer.addEventListener(
      "mouseleave",
      stopMouseDrag
    );


    /*
      ---------------------------------------------------------
      PREVENT IMAGE / TEXT SELECTION WHILE DRAGGING
      ---------------------------------------------------------
    */

    mobileTabsContainer.addEventListener(
      "dragstart",
      function (event) {

        if (window.innerWidth <= 767) {
          event.preventDefault();
        }

      }
    );


    /*
      ---------------------------------------------------------
      HORIZONTAL WHEEL SUPPORT

      If someone uses a mouse/trackpad horizontally,
      the tabs can also scroll.
      ---------------------------------------------------------
    */

    mobileTabsContainer.addEventListener(
      "wheel",
      function (event) {

        if (window.innerWidth > 767) {
          return;
        }


        /*
          Only use wheel when there is horizontal
          overflow.
        */

        const canScroll =
          mobileTabsContainer.scrollWidth >
          mobileTabsContainer.clientWidth;


        if (!canScroll) {
          return;
        }


        /*
          Convert vertical wheel movement into
          horizontal movement.
        */

        if (
          Math.abs(event.deltaY) >
          Math.abs(event.deltaX)
        ) {

          mobileTabsContainer.scrollLeft +=
            event.deltaY;

          event.preventDefault();

        }

      },
      {
        passive: false
      }
    );


    /*
      ---------------------------------------------------------
      RESIZE RESET
      ---------------------------------------------------------
    */

    window.addEventListener(
      "resize",
      function () {

        if (window.innerWidth > 767) {

          isDragging = false;

          mobileTabsContainer.classList.remove(
            "is-dragging"
          );

        }

      }
    );

  }

});

  const playBtn = document.getElementById("playBtn");
  const thumbnail = document.getElementById("thumbnail");
  const videoIframe = document.getElementById("videoIframe");

  playBtn.addEventListener("click", () => {
    thumbnail.style.display = "none";
    videoIframe.style.display = "block";
  });

/* =============================================================
   FAQ
============================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    const faqItems =
      document.querySelectorAll(
        ".faq-item"
      );


    faqItems.forEach(
      function (item) {

        const question =
          item.querySelector(
            ".faq-question"
          );

        const answer =
          item.querySelector(
            ".faq-answer"
          );

        const icon =
          item.querySelector(
            ".faq-icon"
          );


        question.addEventListener(
          "click",
          function () {

            const isOpen =
              item.classList.contains(
                "is-open"
              );


            /*
             * CLICKED FAQ ALREADY OPEN HAI
             * → CLOSE IT
             */

            if (isOpen) {

              item.classList.remove(
                "is-open"
              );

              question.setAttribute(
                "aria-expanded",
                "false"
              );

              answer.classList.remove(
                "grid-rows-[1fr]",
                "opacity-100"
              );

              answer.classList.add(
                "grid-rows-[0fr]",
                "opacity-0"
              );

              icon.textContent = "+";

              item.classList.remove(
                "bg-[#F8D8FC]"
              );

              item.classList.add(
                "bg-transparent"
              );

              return;
            }


            /*
             * PEHLE SAB FAQ CLOSE KARO
             */

            faqItems.forEach(
              function (otherItem) {

                const otherQuestion =
                  otherItem.querySelector(
                    ".faq-question"
                  );

                const otherAnswer =
                  otherItem.querySelector(
                    ".faq-answer"
                  );

                const otherIcon =
                  otherItem.querySelector(
                    ".faq-icon"
                  );


                otherItem.classList.remove(
                  "is-open"
                );

                otherQuestion.setAttribute(
                  "aria-expanded",
                  "false"
                );

                otherAnswer.classList.remove(
                  "grid-rows-[1fr]",
                  "opacity-100"
                );

                otherAnswer.classList.add(
                  "grid-rows-[0fr]",
                  "opacity-0"
                );

                otherIcon.textContent =
                  "+";

                otherItem.classList.remove(
                  "bg-[#F8D8FC]"
                );

                otherItem.classList.add(
                  "bg-transparent"
                );

              }
            );


            /*
             * CLICKED FAQ OPEN KARO
             */

            item.classList.add(
              "is-open"
            );

            question.setAttribute(
              "aria-expanded",
              "true"
            );

            answer.classList.remove(
              "grid-rows-[0fr]",
              "opacity-0"
            );

            answer.classList.add(
              "grid-rows-[1fr]",
              "opacity-100"
            );

            icon.textContent =
              "−";

            item.classList.remove(
              "bg-transparent"
            );

            item.classList.add(
              "bg-[#F8D8FC]"
            );

          }
        );

      }
    );

  }
);



/* =============================================================
   MOBILE MENU
============================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    const menuButton =
      document.getElementById(
        "mobile-menu-button"
      );

    const mobileMenu =
      document.getElementById(
        "mobile-menu"
      );


    if (
      !menuButton ||
      !mobileMenu
    ) {
      return;
    }


    /* =======================================================
       OPEN / CLOSE MOBILE MENU
    ======================================================= */

    menuButton.addEventListener(
      "click",
      function () {

        const isOpen =
          !mobileMenu.classList.contains(
            "hidden"
          );


        mobileMenu.classList.toggle(
          "hidden"
        );


        menuButton.setAttribute(
          "aria-expanded",
          String(!isOpen)
        );

      }
    );


    /* =======================================================
       CLOSE MENU AFTER CLICKING A LINK
    ======================================================= */

    mobileMenu
      .querySelectorAll("a")
      .forEach(
        function (link) {

          link.addEventListener(
            "click",
            function () {

              mobileMenu.classList.add(
                "hidden"
              );

              menuButton.setAttribute(
                "aria-expanded",
                "false"
              );

            }
          );

        }
      );


    /* =======================================================
       CLOSE MENU WHEN SWITCHING TO DESKTOP
    ======================================================= */

    window.addEventListener(
      "resize",
      function () {

        if (
          window.innerWidth >= 768
        ) {

          mobileMenu.classList.add(
            "hidden"
          );

          menuButton.setAttribute(
            "aria-expanded",
            "false"
          );

        }

      }
    );

  }
);

 document.addEventListener("DOMContentLoaded", function () {
      const scrollContainer = document.getElementById("path-cards-scroll");

      if (!scrollContainer) return;

      const cards = scrollContainer.querySelectorAll(".path-card");

      if (!cards.length) return;

      /*
        =========================================================
        CONFIGURATION
        =========================================================

        The desktop panel remains 700px exactly as in the original.
        Smaller screens use the responsive Tailwind heights above.

        scrollSpeed:
        Controls how smoothly the cards automatically move.
      */

      const scrollSpeed = 0.45;
      const pauseAfterInteraction = 1800;

      let animationFrame = null;
      let isPaused = false;
      let resumeTimer = null;

      function startAutoScroll() {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }

        let lastTime = performance.now();

        function animate(currentTime) {
          const delta = currentTime - lastTime;
          lastTime = currentTime;

          if (!isPaused) {
            scrollContainer.scrollTop +=
              scrollSpeed * (delta / 16.67);

            /*
              When the bottom is reached, smoothly return to the top.
              This creates a continuous automatic card-panel cycle
              without changing the actual card layout.
            */
            const maxScroll =
              scrollContainer.scrollHeight -
              scrollContainer.clientHeight;

            if (maxScroll > 0 && scrollContainer.scrollTop >= maxScroll - 1) {
              scrollContainer.scrollTop = 0;
            }
          }

          animationFrame = requestAnimationFrame(animate);
        }

        animationFrame = requestAnimationFrame(animate);
      }

      function pauseAutoScroll() {
        isPaused = true;

        clearTimeout(resumeTimer);

        resumeTimer = setTimeout(function () {
          isPaused = false;
        }, pauseAfterInteraction);
      }

      /*
        =========================================================
        DESKTOP / LAPTOP
        Pause while the user is interacting with the cards.
        =========================================================
      */

      scrollContainer.addEventListener(
        "mouseenter",
        function () {
          isPaused = true;
        }
      );

      scrollContainer.addEventListener(
        "mouseleave",
        function () {
          clearTimeout(resumeTimer);

          resumeTimer = setTimeout(function () {
            isPaused = false;
          }, 700);
        }
      );

      /*
        =========================================================
        TOUCH DEVICES
        =========================================================
      */

      scrollContainer.addEventListener(
        "touchstart",
        function () {
          isPaused = true;
          clearTimeout(resumeTimer);
        },
        { passive: true }
      );

      scrollContainer.addEventListener(
        "touchend",
        function () {
          clearTimeout(resumeTimer);

          resumeTimer = setTimeout(function () {
            isPaused = false;
          }, pauseAfterInteraction);
        },
        { passive: true }
      );

      /*
        =========================================================
        MANUAL WHEEL / TOUCHPAD INTERACTION
        =========================================================
      */

      scrollContainer.addEventListener(
        "wheel",
        function () {
          pauseAutoScroll();
        },
        { passive: true }
      );

      /*
        =========================================================
        KEYBOARD ACCESSIBILITY
        =========================================================
      */

      scrollContainer.addEventListener(
        "keydown",
        function () {
          pauseAutoScroll();
        }
      );

      /*
        Make the panel keyboard accessible.
      */

      scrollContainer.setAttribute("tabindex", "0");

      /*
        Start automatic scrolling.
      */

      startAutoScroll();

      /*
        Stop animation if the page/tab becomes hidden.
        Restart when visible again.
      */

      document.addEventListener("visibilitychange", function () {
        if (document.hidden) {
          isPaused = true;
        } else {
          isPaused = false;
        }
      });

      /*
        Keep the scroll position valid if the browser changes size.
      */

      window.addEventListener("resize", function () {
        const maxScroll =
          scrollContainer.scrollHeight -
          scrollContainer.clientHeight;

        if (scrollContainer.scrollTop > maxScroll) {
          scrollContainer.scrollTop = 0;
        }
      });
    });

    document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector("#testimonials");

  if (!section) return;

  const columns = Array.from(
    section.querySelectorAll(".testimonial-column")
  );

  if (columns.length !== 4) return;

  /*
  ============================================================
  DIRECTIONS
  ============================================================

  Column 1 → UP
  Column 2 → DOWN
  Column 3 → UP
  Column 4 → DOWN
  */

  const directions = [-1, 1, -1, 1];

  /*
  ============================================================
  SPEEDS
  ============================================================
  */

  const speeds = [
    18, // Column 1
    15, // Column 2
    20, // Column 3
    16, // Column 4
  ];

  const positions = [0, 0, 0, 0];

  let lastTime = performance.now();
  let resizeTimer;


  /*
  ============================================================
  PREPARE COLUMNS
  ============================================================
  */

  function prepareColumns() {
    columns.forEach((column) => {

      /*
      Remove previous clones.
      */

      column
        .querySelectorAll(".testimonial-clone")
        .forEach((clone) => clone.remove());


      /*
      Reset position.
      */

      column.style.transform =
        "translate3d(0, 0, 0)";


      /*
      Don't animate below 1024px.
      */

      if (window.innerWidth < 1024) {
        return;
      }


      /*
      Get original cards.
      */

      const originalCards =
        Array.from(column.children);


      if (!originalCards.length) {
        return;
      }


      /*
      ========================================================
      DUPLICATE CONTENT
      ========================================================

      Original cards
          ↓
      Clone set 1
          ↓
      Clone set 2

      This keeps the column continuously filled.
      */

      for (let copy = 0; copy < 2; copy++) {

        originalCards.forEach((card) => {

          const clone =
            card.cloneNode(true);

          clone.classList.add(
            "testimonial-clone"
          );

          clone.setAttribute(
            "aria-hidden",
            "true"
          );

          column.appendChild(
            clone
          );

        });

      }

    });
  }


  /*
  ============================================================
  GET ORIGINAL SET HEIGHT
  ============================================================
  */

  function getLoopHeight(column) {

    const originalCards =
      Array.from(column.children).filter(
        (card) =>
          !card.classList.contains(
            "testimonial-clone"
          )
      );


    if (!originalCards.length) {
      return 0;
    }


    const styles =
      window.getComputedStyle(column);


    const gap =
      parseFloat(styles.rowGap) || 24;


    let height = 0;


    originalCards.forEach((card) => {

      height += card.offsetHeight;

    });


    /*
    Gaps between cards.
    */

    height +=
      gap *
      (originalCards.length - 1);


    /*
    Gap between original set
    and clone set.
    */

    height += gap;


    return height;
  }


  /*
  ============================================================
  INFINITE ANIMATION
  ============================================================
  */

  function animate(currentTime) {

    const delta =
      Math.min(
        (currentTime - lastTime) / 1000,
        0.05
      );


    lastTime = currentTime;


    /*
    Only animate on desktop.
    */

    if (window.innerWidth >= 1024) {

      columns.forEach(
        (column, index) => {

          const loopHeight =
            getLoopHeight(column);


          if (!loopHeight) {
            return;
          }


          /*
          Get direction.

          0 → UP
          1 → DOWN
          2 → UP
          3 → DOWN
          */

          const direction =
            directions[index];


          /*
          Move continuously.
          */

          positions[index] +=
            direction *
            speeds[index] *
            delta;


          /*
          ====================================================
          UPWARD LOOP
          ====================================================
          */

          if (
            direction === -1 &&
            positions[index] <= -loopHeight
          ) {

            positions[index] +=
              loopHeight;

          }


          /*
          ====================================================
          DOWNWARD LOOP
          ====================================================
          */

          if (
            direction === 1 &&
            positions[index] >= 0
          ) {

            positions[index] -=
              loopHeight;

          }


          /*
          Apply transform.
          */

          column.style.transform =
            `translate3d(
              0,
              ${positions[index]}px,
              0
            )`;

        }
      );

    }


    /*
    Keep animation running forever.
    */

    requestAnimationFrame(
      animate
    );
  }


  /*
  ============================================================
  INITIALIZE
  ============================================================
  */

  prepareColumns();

  requestAnimationFrame(
    animate
  );


  /*
  ============================================================
  RESIZE
  ============================================================
  */

  window.addEventListener(
    "resize",
    () => {

      clearTimeout(
        resizeTimer
      );


      resizeTimer =
        setTimeout(() => {

          positions[0] = 0;
          positions[1] = 0;
          positions[2] = 0;
          positions[3] = 0;


          prepareColumns();


          lastTime =
            performance.now();

        }, 200);

    }
  );


  /*
  ============================================================
  REDUCED MOTION
  ============================================================
  */

  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );


  /*
  Normal behavior:
  animation keeps running.

  Only users who explicitly request reduced motion
  will have it disabled.
  */

  if (reducedMotion.matches) {

    return;

  }

});