(() => {
  const KEY = "flashcards.v1";
  const $ = (id) => document.getElementById(id);
  const el = {
    study: $("study"), empty: $("empty"), slot: $("slot"), card: $("card"),
    q: $("qText"), a: $("aText"), count: $("count"), fill: $("fill"),
    prev: $("prevBtn"), next: $("nextBtn"), flip: $("flipBtn"),
    formDlg: $("formDlg"), form: $("cardForm"), formTitle: $("formTitle"),
    qIn: $("qInput"), aIn: $("aInput"), err: $("err"), delDlg: $("delDlg"),
  };

  const seed = [
    { q: "What is the capital of France?", a: "Paris" },
    { q: "What does HTML stand for?", a: "HyperText Markup Language" },
    { q: "Which planet is known as the Red Planet?", a: "Mars" },
    { q: "What is 12 × 12?", a: "144" },
  ];

  let cards = load();
  let index = 0, flipped = false, busy = false, editing = null;

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const list = JSON.parse(raw);
        if (Array.isArray(list)) return list;
      }
    } catch (e) {}
    return seed.map((c, i) => ({ id: Date.now() + i, ...c }));
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(cards)); } catch (e) {}
  }

  function setFlip(on) {
    flipped = on;
    el.card.classList.toggle("flipped", on);
    el.flip.textContent = on ? "Show Question" : "Show Answer";
    el.flip.setAttribute("aria-pressed", on);
  }

  function render() {
    const has = cards.length > 0;
    el.study.hidden = !has;
    el.empty.hidden = has;
    if (!has) return;
    const c = cards[index];
    el.q.textContent = c.q;
    el.a.textContent = c.a;
    el.count.textContent = `Card ${index + 1} of ${cards.length}`;
    el.fill.style.width = ((index + 1) / cards.length) * 100 + "%";
    el.prev.disabled = index === 0;
    el.next.disabled = index === cards.length - 1;
  }

  // Slide the current card out, swap content while hidden, slide the new one in.
  function goTo(target) {
    if (busy || target === index || target < 0 || target >= cards.length) return;
    busy = true;
    const forward = target > index;
    el.slot.classList.add(forward ? "exit-left" : "exit-right");
    setTimeout(() => {
      index = target;
      el.card.classList.add("instant");
      setFlip(false);
      render();
      el.slot.style.transition = "none";
      el.slot.classList.remove("exit-left", "exit-right");
      el.slot.classList.add(forward ? "exit-right" : "exit-left");
      void el.slot.offsetWidth;
      el.slot.style.transition = "";
      el.slot.classList.remove("exit-left", "exit-right");
      el.card.classList.remove("instant");
      setTimeout(() => (busy = false), 230);
    }, 220);
  }

  function openForm(card) {
    editing = card || null;
    el.formTitle.textContent = card ? "Edit card" : "Add card";
    el.qIn.value = card ? card.q : "";
    el.aIn.value = card ? card.a : "";
    el.err.hidden = true;
    el.formDlg.showModal();
    el.qIn.focus();
  }

  el.form.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = el.qIn.value.trim(), a = el.aIn.value.trim();
    if (!q || !a) { el.err.hidden = false; return; }
    if (editing) {
      editing.q = q; editing.a = a;
    } else {
      cards.push({ id: Date.now(), q, a });
      index = cards.length - 1;
      setFlip(false);
    }
    save(); render();
    el.formDlg.close();
  });
  $("cancelBtn").addEventListener("click", () => el.formDlg.close());

  el.delDlg.addEventListener("close", () => {
    if (el.delDlg.returnValue !== "ok") return;
    cards.splice(index, 1);
    index = Math.max(0, Math.min(index, cards.length - 1));
    setFlip(false);
    save(); render();
  });

  $("addBtn").addEventListener("click", () => openForm());
  $("emptyAdd").addEventListener("click", () => openForm());
  $("editBtn").addEventListener("click", () => openForm(cards[index]));
  $("delBtn").addEventListener("click", () => { el.delDlg.returnValue = ""; el.delDlg.showModal(); });
  el.flip.addEventListener("click", () => setFlip(!flipped));
  el.prev.addEventListener("click", () => goTo(index - 1));
  el.next.addEventListener("click", () => goTo(index + 1));

  // Close dialogs when clicking the dimmed backdrop
  [el.formDlg, el.delDlg].forEach((d) =>
    d.addEventListener("click", (e) => { if (e.target === d) d.close(); })
  );

  document.addEventListener("keydown", (e) => {
    if (document.querySelector("dialog[open]") || !cards.length) return;
    if (e.key === "ArrowRight") goTo(index + 1);
    else if (e.key === "ArrowLeft") goTo(index - 1);
    else if (e.key === " " && e.target === document.body) { e.preventDefault(); setFlip(!flipped); }
  });

  render();
})();
