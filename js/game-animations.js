document.addEventListener("DOMContentLoaded", () => {
  const telaTerror = document.getElementById("tela-terror");
  const telaIntrodutoria = document.getElementById("tela-introdutoria");
  const frase1 = document.getElementById("frase1");
  const frase2 = document.getElementById("frase2");
  const finalIntro = document.getElementById("final-intro");
  const botao = document.getElementById("botao-start");

  setTimeout(() => {
    telaTerror.classList.add("sair");
    
    // depois de 2 segundos de trasição aparece a tela introdutoria
    setTimeout(() => {
      telaTerror.classList.remove("ativa");
      telaIntrodutoria.classList.add("ativa");
      
      // animação de titulo
      frase1.classList.add("animar-frase-1");
      frase2.classList.add("animar-frase-2");
      
      setTimeout(() => {
        finalIntro.classList.add("aparecer");
      }, 10600);

      setTimeout(() => {
        botao.classList.add("entrar");
      }, 11800);
      
    }, 2000);
  }, 8000);
});
