window.addEventListener("load", function () {
  let header = document.querySelector(".header");
  let link = document.querySelector(".header__burger");
  let menu = document.querySelector(".header__nav");
  if (menu) {
    link.addEventListener(
      "click",
      function () {
        link.classList.toggle("active");
        menu.classList.toggle("open");
        header.classList.toggle("active");
      },
      false
    );
    document.addEventListener("click", (e) => {
      let target = e.target;
      if (
        !target.classList.contains("header__nav") &&
        !target.classList.contains("header__burger")
      ) {
        link.classList.remove("active");
        menu.classList.remove("open");
        header.classList.remove("active");
      }
    });
  }

  // tabs
  const tabsContainers = Array.from(document.querySelectorAll(".tabs"));
  tabsContainers.forEach(tabsContainer => {
    const STATE = { currentTab: null };
  
    const targetsContainer = tabsContainer.querySelector(".targets");
    const triggers = Array.from(tabsContainer.querySelectorAll(".trigger"));
    const select = tabsContainer.querySelector(".mobile-select");
    const targets = [];
  
    function activateTab(ind) {
      if (ind == null) return ind;
    
      const trigger = triggers[ind];
      const target = targets[ind];
    
      if (trigger) trigger.classList.add("active");
    
      if (target) {
        target.classList.add("active");
    
        targets.forEach(t => {
          const iframe = t.querySelector("iframe");
          if (iframe) iframe.removeAttribute("src");
        });
    
        const mapUrl = trigger.dataset.map;
        const iframe = target.querySelector("iframe");
        if (iframe) iframe.src = mapUrl;
      }
    
      targetsContainer.style.transform = `translateX(-${ind}00%)`;
      return ind;
    }
  
    function deactivateTab(ind) {
      if (ind == null) return ind;
      const trigger = triggers[ind];
      if (trigger) trigger.classList.remove("active");
      const target = targets[ind];
      if (target) target.classList.remove("active");
      return null;
    }
  
    if (targetsContainer) {
      triggers.forEach((trigger, ind) => {
        targets.push(tabsContainer.querySelector(trigger.dataset.target));
        trigger.addEventListener("click", () => {
          STATE.currentTab = deactivateTab(STATE.currentTab);
          STATE.currentTab = activateTab(ind);
        });
      });
  
      // Активируем вкладку на основе текущего URL хеша
      const currentHash = window.location.hash;
      const initialIndex = currentHash ? triggers.findIndex(trigger => trigger.getAttribute('href') === currentHash) : 0;
      STATE.currentTab = activateTab(initialIndex !== -1 ? initialIndex : 0);
  
      // Добавляем обработчик для мобильного селекта
      if (select) {
        select.addEventListener("change", (event) => {
          const selectedOption = select.options[select.selectedIndex];
          const targetId = selectedOption.dataset.target;
          const ind = targets.findIndex(target => target.id === targetId.slice(1));
          if (ind !== -1) {
            STATE.currentTab = deactivateTab(STATE.currentTab);
            STATE.currentTab = activateTab(ind);
          }
        });
      }
    }
  });

  // AOS
  AOS.init({
    duration: 1200,
    offset: 0
  });

  // Fancybox
  Fancybox.bind("[data-fancybox]", {});

  // Modals
  function hidePopup(popup) {
    const modalsParent = popup.parentElement;
    modalsParent.addEventListener("click", function (e) {
      const target = e.target;
      if (
        target.classList.contains("modal__close") ||
        target.classList.contains("modals")
      ) {
        popup.style.transition = "opacity 0.4s";
        popup.style.opacity = "0";
        setTimeout(() => {
          popup.style.display = "none";
          if (modalsParent) {
            modalsParent.style.opacity = "0";
            modalsParent.style.display = "none";
          }
        }, 400);
      }
    });
  }

  function showPopup(popup) {
    const modalsParent = popup.parentElement;
    if (modalsParent) {
      modalsParent.style.display = "flex";
      modalsParent.style.transition = "opacity 0.4s";
      modalsParent.style.opacity = "1"; 
    }

    popup.style.display = "block";
    setTimeout(() => {
      popup.style.transition = "opacity 0.4s";
      popup.style.opacity = "1";
    }, 10);
  }

  let modalBtns = document.querySelectorAll(".modal-btn");
  let modals = document.querySelectorAll(".modal");

  modals.forEach((modal) => {
    modal.style.display = "none";
    hidePopup(modal);
  });

  modalBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      let modalType = btn.dataset.modal;
      let modalToShow = document.querySelector(
        `.modal[data-modal="${modalType}"]`
      );

      if (modalToShow) {
        showPopup(modalToShow);
      }
    });
  });
});
