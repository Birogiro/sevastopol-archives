# Sevastopol Archives

Experiência interativa de fã sobre **Alien: Isolation**, criada com HTML, CSS, JavaScript, Bootstrap 5 e dados em JSON.

## Recursos

- navegação por seis telas com rotas por hash;
- screenshots oficiais do jogo armazenados localmente;
- arquivos de personagens com parallax e profundidade 3D;
- visualização detalhada da IA do Xenomorfo;
- mapa de Sevastopol com imagem de fundo dinâmica por setor;
- filtros de conquistas e colecionáveis;
- galeria em tela cheia e ambiente sonoro opcional;
- layout responsivo para desktop, tablet e celular.

## Executar localmente

Os dados JSON carregam normalmente quando o site é servido por HTTP. Na pasta do projeto, execute:

```bash
python -m http.server 8080
```

Depois abra `http://localhost:8080`. O site também possui dados de fallback e continua funcional ao abrir `index.html` diretamente.

## Observação sobre modelos 3D

Modelos extraídos do jogo não foram incluídos por questões de licença. Os cards utilizam screenshots oficiais e uma apresentação 3D interativa produzida com CSS e JavaScript.

## Créditos

Projeto de fã não oficial. Alien: Isolation e seus materiais pertencem aos respectivos detentores. As imagens utilizadas foram obtidas da página oficial do jogo na Steam.
