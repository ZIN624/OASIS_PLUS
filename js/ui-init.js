(function () {
  function showOnly(sectionIds, targetId) {
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      if (id === "formArea") {
        el.style.display = id === targetId ? "block" : "none";
      } else {
        el.hidden = id !== targetId;
      }
    });
  }

  function setReservationVisible() {
    const reservationForm = document.getElementById("reservationForm");
    const summary = document.getElementById("reservationSummary");
    if (reservationForm) reservationForm.style.display = "block";
    if (summary) summary.style.display = "none";
  }

  function attachCardSelection() {
    const selectedMenuInput = document.getElementById("selectedMenuInput");
    const otherInputContainer = document.getElementById("other-input-container");

    document.querySelectorAll(".menu-card").forEach((card) => {
      card.addEventListener("click", () => {
        document.querySelectorAll(".menu-card").forEach((c) => c.classList.remove("selected"));
        card.classList.add("selected");

        if (selectedMenuInput) selectedMenuInput.value = card.dataset.menu || "";
        if (otherInputContainer) {
          otherInputContainer.style.display = card.dataset.menu === "その他" ? "block" : "none";
        }
      });
    });

    const selectedStylistInput = document.getElementById("selectedStylistInput");
    const stylistContainer = document.getElementById("stylist-container");
    stylistContainer?.addEventListener("click", (event) => {
      const card = event.target.closest(".stylist-card");
      if (!card) return;
      document.querySelectorAll(".stylist-card").forEach((c) => c.classList.remove("selected"));
      card.classList.add("selected");
      if (selectedStylistInput) selectedStylistInput.value = card.dataset.stylist || "";
      if (card.dataset.status === "restricted" || card.dataset.stylist === "岡崎菜月") {
        alert("現在育休中で予約制限中です。場合によっては予約を受けられない場合もございます。ご了承ください。");
      }
    });
  }

  function attachChoiceButtons() {
    const addSecond = document.getElementById("addSecondChoice");
    const addThird = document.getElementById("addThirdChoice");

    addSecond?.addEventListener("click", () => {
      const box = document.getElementById("secondChoice");
      if (!box) return;

      if (box.innerHTML) {
        box.innerHTML = "";
        return;
      }

      box.innerHTML = `
        <h2 class="title">第2希望</h2>
        <div class="input-wrapper">
          <label for="day2" class="input-label">希望日:</label>
          <select id="day2" name="day2" class="input-select calendar-select-source" required></select>
        </div>
        <div class="input-wrapper">
          <label for="time2" class="input-label">時間:</label>
          <select id="time2" name="time2" class="input-select" required>
            ${[...Array(10).keys()].map((i) => `<option value="${9 + i}:00">${9 + i}:00</option>`).join("")}
          </select>
        </div>
      `;
      if (window.populateDateOptions) window.populateDateOptions("day2");
    });

    addThird?.addEventListener("click", () => {
      const box = document.getElementById("thirdChoice");
      if (!box) return;

      if (box.innerHTML) {
        box.innerHTML = "";
        return;
      }

      box.innerHTML = `
        <h2 class="title">第3希望</h2>
        <div class="input-wrapper">
          <label for="day3" class="input-label">希望日:</label>
          <select id="day3" name="day3" class="input-select calendar-select-source" required></select>
        </div>
        <div class="input-wrapper">
          <label for="time3" class="input-label">時間:</label>
          <select id="time3" name="time3" class="input-select" required>
            ${[...Array(10).keys()].map((i) => `<option value="${9 + i}:00">${9 + i}:00</option>`).join("")}
          </select>
        </div>
      `;
      if (window.populateDateOptions) window.populateDateOptions("day3");
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    const sectionIds = ["select", "new", "existing", "formArea"];

    const select = document.getElementById("select");
    const existingSameBtn = document.getElementById("existingSameBtn");
    const existingChangeBtn = document.getElementById("existingChangeBtn");

    const backToTopFromNew = document.getElementById("backToTopFromNew");
    const backToTopFromExisting = document.getElementById("backToTopFromExisting");

    const customerForm = document.getElementById("customerForm");

    function openReservationScreen() {
      showOnly(sectionIds, "formArea");
      setReservationVisible();
      if (window.populateDateOptions) window.populateDateOptions("day1");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    showOnly(sectionIds, "select");

    const customer = window.CustomerStorage?.getCustomer();
    if (customer) {
      const username = document.getElementById("username");
      const furigana = document.getElementById("furigana");
      const phoneNumber = document.getElementById("phoneNumber");
      if (username) username.value = customer.username || "";
      if (furigana) furigana.value = customer.furigana || "";
      if (phoneNumber) phoneNumber.value = customer.phoneNumber || "";
      if (customer.gender) {
        const selectedGender = document.querySelector(`input[name="gender"][value="${customer.gender}"]`);
        if (selectedGender) selectedGender.checked = true;
      }
    }

    select?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-mode]");
      if (!button) return;
      const mode = button.dataset.mode;
      if (mode === "new") showOnly(sectionIds, "new");
      if (mode === "existing") showOnly(sectionIds, "existing");
    });

    backToTopFromNew?.addEventListener("click", () => showOnly(sectionIds, "select"));
    backToTopFromExisting?.addEventListener("click", () => showOnly(sectionIds, "select"));

    customerForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!window.FormValidator?.validateCustomerForm()) return;

      const customerData = {
        username: document.getElementById("username")?.value.trim() || "",
        furigana: document.getElementById("furigana")?.value.trim() || "",
        gender: document.querySelector('input[name="gender"]:checked')?.value || "",
        phoneNumber: document.getElementById("phoneNumber")?.value.trim() || "",
      };

      window.CustomerStorage?.saveCustomer(customerData);
      openReservationScreen();
    });

    existingSameBtn?.addEventListener("click", () => {
      const saved = window.CustomerStorage?.getCustomer();
      if (!saved?.username || !saved?.furigana || !saved?.gender || !saved?.phoneNumber) {
        alert("顧客情報が未登録です。先に顧客情報を登録してください。");
        showOnly(sectionIds, "new");
        return;
      }
      openReservationScreen();
    });

    existingChangeBtn?.addEventListener("click", () => {
      showOnly(sectionIds, "new");
    });

    attachCardSelection();
    attachChoiceButtons();
  });
})();
