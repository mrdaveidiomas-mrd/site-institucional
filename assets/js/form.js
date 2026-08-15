/* ==========================================================================
   form.js — validação e envio do formulário de aula experimental.

   Por padrão, o formulário valida os campos e mostra uma mensagem de sucesso
   SEM enviar os dados para nenhum servidor externo.

   Para receber os leads por e-mail, defina no <form> o atributo
   data-endpoint com a URL de um serviço de formulário (ex.: Formspree,
   Basin, Getform) e o script fará o POST automaticamente. Exemplo:
     <form class="contact-form" data-endpoint="https://formspree.io/f/XXXX">
   ========================================================================== */

const VALIDATORS = {
  nome: (v) => v.trim().length >= 2 || "Informe seu nome completo.",
  email: (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || "Informe um e-mail válido.",
  telefone: (v) =>
    v.replace(/\D/g, "").length >= 10 || "Informe um telefone com DDD.",
  idioma: (v) => v.trim() !== "" || "Selecione o idioma de interesse.",
  nivel: (v) => v.trim() !== "" || "Selecione o seu nível atual.",
  objetivo: (v) => v.trim() !== "" || "Selecione o seu objetivo.",
};

function fieldWrap(input) {
  return input.closest(".field");
}

function showError(input, message) {
  const wrap = fieldWrap(input);
  if (!wrap) return;
  wrap.classList.add("field--invalid");
  const err = wrap.querySelector(".field__error");
  if (err) err.textContent = message;
  input.setAttribute("aria-invalid", "true");
}

function clearError(input) {
  const wrap = fieldWrap(input);
  if (!wrap) return;
  wrap.classList.remove("field--invalid");
  input.removeAttribute("aria-invalid");
}

function validateField(input) {
  const rule = VALIDATORS[input.name];
  if (!rule) return true;
  const result = rule(input.value);
  if (result === true) {
    clearError(input);
    return true;
  }
  showError(input, result);
  return false;
}

/* Máscara simples de telefone brasileiro: (00) 00000-0000 */
function maskPhone(input) {
  input.addEventListener("input", () => {
    let d = input.value.replace(/\D/g, "").slice(0, 11);
    if (d.length > 6) {
      input.value = d.replace(/(\d{2})(\d{5})(\d{0,4}).*/, "($1) $2-$3").replace(/-$/, "");
    } else if (d.length > 2) {
      input.value = d.replace(/(\d{2})(\d{0,5})/, "($1) $2");
    } else if (d.length > 0) {
      input.value = d.replace(/(\d{0,2})/, "($1");
    }
  });
}

function initContactForm() {
  const form = document.querySelector(".contact-form");
  if (!form) return;

  const fields = Array.from(form.querySelectorAll("[name]")).filter(
    (el) => VALIDATORS[el.name]
  );

  const phone = form.querySelector('[name="telefone"]');
  if (phone) maskPhone(phone);

  // Valida ao sair do campo (após a primeira interação)
  fields.forEach((input) => {
    input.addEventListener("blur", () => validateField(input));
    input.addEventListener("input", () => {
      if (fieldWrap(input)?.classList.contains("field--invalid")) validateField(input);
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    let firstInvalid = null;
    fields.forEach((input) => {
      const ok = validateField(input);
      if (!ok && !firstInvalid) firstInvalid = input;
    });

    if (firstInvalid) {
      firstInvalid.focus();
      firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const submitBtn = form.querySelector('[type="submit"]');
    const endpoint = form.dataset.endpoint;

    // Envia a um serviço externo apenas se um endpoint estiver configurado
    if (endpoint) {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.dataset.label = submitBtn.textContent;
        submitBtn.textContent = "Enviando…";
      }
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form),
        });
        if (!res.ok) throw new Error(res.statusText);
      } catch (err) {
        console.error("Falha ao enviar o formulário:", err);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = submitBtn.dataset.label || "Enviar";
        }
        alert(
          "Não foi possível enviar agora. Tente novamente ou fale com a gente pelo WhatsApp."
        );
        return;
      }
    }

    showSuccess(form);
  });
}

function showSuccess(form) {
  const wrapper = form.closest("[data-form-wrapper]") || form.parentElement;
  wrapper?.classList.add("is-form-sent");
  const success = wrapper?.querySelector(".form-success");
  if (success) {
    success.classList.add("is-visible");
    success.setAttribute("tabindex", "-1");
    success.focus({ preventScroll: true });
    success.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  form.reset();
}

document.addEventListener("DOMContentLoaded", initContactForm);
