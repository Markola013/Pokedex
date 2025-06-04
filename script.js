// Mapeia cores para os tipos de Pokémon
// Este objeto associa o nome de cada tipo de Pokémon a uma cor hexadecimal.
// Isso é usado para colorir os 'spans' dos tipos no cartão do Pokémon,
// tornando-os visualmente distintos e informativos.
const typeColors = {
  normal: '#A8A77A', // Cor para o tipo Normal
  fire: '#EE8130',   // Cor para o tipo Fire
  water: '#6390F0',  // Cor para o tipo Water
  grass: '#7AC74C',  // Cor para o tipo Grass
  electric: '#F7D02C', // Cor para o tipo Electric
  ice: '#96D9D6',    // Cor para o tipo Ice
  fighting: '#C22E28', // Cor para o tipo Fighting
  poison: '#A33EA1', // Cor para o tipo Poison
  ground: '#E2BF65', // Cor para o tipo Ground
  flying: '#A98FF3', // Cor para o tipo Flying
  psychic: '#F95587', // Cor para o tipo Psychic
  bug: '#A6B91A',    // Cor para o tipo Bug
  rock: '#B6A136',   // Cor para o tipo Rock
  ghost: '#735797',  // Cor para o tipo Ghost
  dragon: '#6F35FC', // Cor para o tipo Dragon
  dark: '#705746',   // Cor para o tipo Dark
  steel: '#B7B7CE',  // Cor para o tipo Steel
  fairy: '#D685AD',  // Cor para o tipo Fairy
};

// Função principal: busca o Pokémon da API
// Esta função é assíncrona, pois fará uma requisição de rede (fetch).
// Ela é chamada quando o botão "Buscar" é clicado ou a tecla Enter é pressionada.
async function buscarPokemon() {
  // Obtém o valor digitado no campo de busca e converte para minúsculas
  // para garantir que a busca seja case-insensitive.
  const nomeOuId = document.getElementById("searchInput").value.toLowerCase().trim();
  // Constrói a URL para a PokeAPI usando o nome/ID digitado.
  const url = `https://pokeapi.co/api/v2/pokemon/${nomeOuId}`;
  // Obtém a referência ao container onde o Pokémon será exibido.
  const container = document.getElementById("pokemonContainer");

  // Verifica se o campo de busca está vazio. Se sim, exibe uma mensagem e retorna.
  if (!nomeOuId) {
    container.innerHTML = '<p class="placeholder-text error">Por favor, digite um nome ou ID de Pokémon.</p>';
    // Adiciona log no console para depuração
    console.warn("Campo de busca vazio. Por favor, digite um nome ou ID.");
    return;
  }

  // Limpa o conteúdo anterior e mostra uma mensagem de carregamento.
  container.innerHTML = '<p class="placeholder-text animate-pulse">Buscando Pokémon...</p>';
  // Adiciona log no console para depuração
  console.log(`Tentando buscar Pokémon: ${nomeOuId} na URL: ${url}`);

  try {
    // Faz a requisição HTTP para a PokeAPI.
    const resposta = await fetch(url);

    // Verifica se a resposta da requisição foi bem-sucedida (status 200-299).
    // Se não for 'ok', significa que o Pokémon não foi encontrado ou houve outro erro.
    if (!resposta.ok) {
        // Adiciona log no console para depuração em caso de resposta não OK
        console.error(`Erro na resposta da API: Status ${resposta.status}, StatusText: ${resposta.statusText}`);
        // Se a resposta for 404 (Not Found), exibe uma mensagem específica.
        if (resposta.status === 404) {
            throw new Error("Pokémon não encontrado. Verifique o nome ou ID.");
        } else {
            // Para outros erros HTTP, lança um erro genérico.
            throw new Error(`Erro ao buscar Pokémon: ${resposta.statusText || 'Erro desconhecido'}`);
        }
    }

    // Converte a resposta para JSON.
    const dados = await resposta.json();
    // Adiciona log no console para depuração (dados recebidos)
    console.log("Dados do Pokémon recebidos:", dados);
    // Chama a função para exibir os dados do Pokémon na tela.
    mostrarPokemon(dados);
  } catch (erro) {
    // Em caso de qualquer erro durante a busca (rede, 404, etc.),
    // exibe a mensagem de erro no container e registra no console.
    container.innerHTML = `<p class="placeholder-text error">${erro.message}</p>`;
    console.error("Erro durante a busca do Pokémon:", erro);
  }
}

// Exibe os dados do Pokémon na tela
// Esta função recebe um objeto 'pokemon' (os dados JSON da API) e
// insere um cartão com as informações na página, utilizando classes Tailwind CSS.
function mostrarPokemon(pokemon) {
  const container = document.getElementById("pokemonContainer");

  // Cria o HTML do cartão do Pokémon dinamicamente, incorporando classes Tailwind para estilo.
  // - pokemon.name: Nome do Pokémon, convertido para maiúsculas.
  // - pokemon.sprites.front_default: URL da imagem frontal padrão do Pokémon.
  // - pokemon.id: ID do Pokémon. Formatado para ter sempre 3 dígitos (ex: 001, 025).
  // - pokemon.types.map(...): Itera sobre os tipos do Pokémon.
  //   - Para cada tipo, cria um 'span' com a classe 'type' (definida em style.css).
  //   - O estilo de fundo ('background-color') é definido inline usando o 'typeColors'
  //     mapeamento. Se um tipo não estiver mapeado, usa um cinza padrão ('#ccc').
  //   - .join(""): Concatena todos os 'spans' dos tipos em uma única string HTML.
  container.innerHTML = `
    <div class="card bg-white rounded-2xl shadow-xl p-8 m-4 text-center max-w-sm w-full
                flex flex-col items-center transition-all duration-500 ease-in-out transform
                hover:scale-105 hover:shadow-2xl relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-pokedex-light-gray to-gray-200 opacity-20 rounded-2xl -z-10"></div>

      <h2 class="text-4xl font-bold text-pokedex-red mb-4 capitalize drop-shadow-sm">${pokemon.name}</h2>
      <img
        src="${pokemon.sprites.front_default}"
        alt="${pokemon.name}"
        class="w-40 h-40 object-contain bg-pokedex-light-gray rounded-full p-2 mb-6 border-4 border-pokedex-yellow shadow-md transform hover:rotate-6 transition-transform duration-300"
      />
      <p class="text-xl text-pokedex-dark-gray mb-4">
        <strong class="text-pokedex-blue">ID:</strong> #${String(pokemon.id).padStart(3, '0')}
      </p>
      <div class="types flex flex-wrap justify-center gap-2 mt-4">
        ${pokemon.types
          .map((tipo) => `<span class="type" style="background-color: ${typeColors[tipo.type.name] || '#ccc'};">${tipo.type.name}</span>`)
          .join("")}
      </div>
    </div>
  `;
  // Adiciona log no console para depuração (Pokémon exibido)
  console.log(`Pokémon ${pokemon.name} exibido com sucesso.`);
}

// Adiciona um listener para a tecla 'Enter' no campo de busca.
// Isso permite que o usuário pressione Enter para buscar o Pokémon,
// em vez de ter que clicar no botão.
document.getElementById("searchInput").addEventListener("keypress", function(event) {
    // Verifica se a tecla pressionada foi 'Enter' (código 13 ou 'Enter' para eventos mais modernos).
    if (event.key === "Enter") {
        // Previne o comportamento padrão do Enter (que pode ser submeter um formulário, por exemplo).
        event.preventDefault();
        // Chama a função de busca do Pokémon.
        buscarPokemon();
    }
});

// Adiciona um listener de evento ao botão de busca.
// Isso garante que a função 'buscarPokemon' seja chamada quando o botão for clicado,
// independentemente de como o script é carregado ou quando o DOM está pronto.
document.getElementById("searchButton").addEventListener("click", buscarPokemon);
