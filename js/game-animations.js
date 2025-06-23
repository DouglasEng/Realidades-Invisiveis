    document.addEventListener("DOMContentLoaded", () => {
      const frase1 = document.getElementById("frase1");
      const frase2 = document.getElementById("frase2");
      const finalIntro = document.getElementById("final-intro");
      const botao = document.getElementById("botao-start");

      frase1.classList.add("animar-frase-1");
      frase2.classList.add("animar-frase-2");

      setTimeout(() => {
        finalIntro.classList.add("aparecer");
      }, 10600);

      setTimeout(() => {
        botao.classList.add("entrar");
      }, 11800);
    });