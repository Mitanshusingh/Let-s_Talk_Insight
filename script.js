/* script.js — handles mobile nav, blog injection, form validation, smooth active link */

document.addEventListener("DOMContentLoaded", () => {
  
  // set year in footers
  const year = new Date().getFullYear();
  ["year", "yearAbout", "yearServices", "yearBlog", "yearAppt", "yearContact"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = year;
  });
  
  // MOBILE NAV TOGGLE (works for all pages)
  function wireHamburger(hamburgerId, mobileNavId) {
    const ham = document.getElementById(hamburgerId);
    const mob = document.getElementById(mobileNavId);
    if (!ham || !mob) return;
    ham.addEventListener("click", () => {
      mob.style.display = mob.style.display === "block" ? "none" : "block";
    });
    // hide when clicking any link
    mob.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => mob.style.display = "none");
    });
  }
  wireHamburger("hamburger", "mobileNav");
  wireHamburger("hamburgerAbout", "mobileNavAbout");
  wireHamburger("hamburgerServices", "mobileNavServices");
  wireHamburger("hamburgerBlog", "mobileNavBlog");
  wireHamburger("hamburgerAppt", "mobileNavAppt");
  wireHamburger("hamburgerContact", "mobileNavContact");
  
  // BLOG injection (home preview and blog page)
  const blogCardsEl = document.getElementById("blogCards");
  const blogListEl = document.getElementById("blogList");
  
  function createBlogCard(b) {
    const div = document.createElement("div");
    div.className = "blog-card";
    div.innerHTML = `
      <img src="${b.image}" alt="${escapeHtml(b.title)}">
      <div class="meta">
        <h3>${escapeHtml(b.title)}</h3>
        <p>${escapeHtml(b.excerpt)}</p>
        <div style="margin-top:10px;">
          <a class="btn" href="#" onclick="openPost('${b.id}')">Read</a>
        </div>
      </div>
    `;
    return div;
  }
  if (Array.isArray(window.BLOGS)) {
    // home - show first 3
    if (blogCardsEl) {
      BLOGS.slice(0, 3).forEach(b => blogCardsEl.appendChild(createBlogCard(b)));
    }
    // blog page - list all
    if (blogListEl) {
      BLOGS.forEach(b => blogListEl.appendChild(createBlogCard(b)));
    }
  }
  
  // simple post viewer (modal-like navigation)
  window.openPost = function(id) {
    const post = BLOGS.find(x => x.id === id);
    if (!post) return alert("Post not found");
    // simple new-window display using blob
    const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(post.title)}</title>
    <link rel="stylesheet" href="style.css"></head><body>
    <header style="padding:18px; background:linear-gradient(90deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));"><a href="blog.html" style="color:white;text-decoration:none;font-weight:700;">&larr; Back to Blog</a></header>
    <main style="padding:20px; max-width:900px; margin:0 auto;">
      <h1 style="color:white">${escapeHtml(post.title)}</h1>
      <img src="${post.image}" style="width:100%; height:300px; object-fit:cover; border-radius:12px; margin-bottom:12px;">
      <div style="color:white;">${post.content}</div>
    </main>
    </body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };
  
  // FORM validation for appointment
  const apptForm = document.getElementById("appointmentForm");
  if (apptForm) {
    apptForm.addEventListener("submit", function(e) {
      e.preventDefault();
      let ok = true;
      const elements = [
        { id: "name", rule: v => v.trim().length >= 2, msg: "Please enter name" },
        { id: "email", rule: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), msg: "Enter valid email" },
        { id: "phone", rule: v => v.trim().length >= 7, msg: "Enter phone" },
        { id: "service", rule: v => v !== "", msg: "Choose a service" },
        { id: "date", rule: v => v !== "", msg: "Choose a date" },
        { id: "time", rule: v => v !== "", msg: "Choose a time" }
      ];
      elements.forEach(({ id, rule, msg }) => {
        const el = document.getElementById(id);
        const err = document.querySelector(`.error[data-for="${id}"]`);
        if (!el) return;
        if (!rule(el.value || "")) { ok = false; if (err) err.textContent = msg; }
        else if (err) err.textContent = "";
      });
      if (!ok) return;
      // show success modal
      const modal = document.getElementById("successModal");
      if (modal) { modal.style.display = "flex"; }
      apptForm.reset();
    });
    const closeModal = document.getElementById("closeModal");
    if (closeModal) closeModal.addEventListener("click", () => document.getElementById("successModal").style.display = "none");
  }
  
  // Active nav underline by page path (simple)
  (function markActiveByPath() {
    const path = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-link").forEach(a => {
      const href = a.getAttribute("href");
      if (href && href.includes(path)) a.classList.add("active");
      else a.classList.remove("active");
    });
  })();
  
  // Accessibility: hide mobile nav when clicking outside
  document.addEventListener("click", (ev) => {
    ["mobileNav", "mobileNavAbout", "mobileNavServices", "mobileNavBlog", "mobileNavAppt", "mobileNavContact"].forEach(id => {
      const el = document.getElementById(id);
      const ham = document.getElementById(id.replace("mobileNav", "hamburger"));
      if (!el) return;
      if (ev.target.closest(`#${id}`) || ev.target.closest(`#${id.replace("mobileNav","hamburger")}`)) return;
      el.style.display = "none";
    });
  });
  
}); // DOMContentLoaded

/* small helper */
function escapeHtml(s) { return String(s).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;"); }