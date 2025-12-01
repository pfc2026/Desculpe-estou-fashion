const { connect } = require('./api/mongo_connect');

async function populateProducts() {
  try {
    const db = await connect();
    const products = [
      {
        nome: 'Calça Jeans Masculina',
        descricao: 'Calça jeans confortável para o dia a dia',
        preco: 99.90,
        tamanhos: ['P', 'M', 'G'],
        categoria: 'Masculino',
        imagens: ['compras/foto.png'],
        slug: 'calca-jeans-masculina'
      },
      {
        nome: 'Camisa Xadrez Masculina',
        descricao: 'Camisa xadrez elegante',
        preco: 79.90,
        tamanhos: ['P', 'M', 'G'],
        categoria: 'Masculino',
        imagens: ['compras/foto2.png'],
        slug: 'camisa-xadres-masculina'
      },
      {
        nome: 'Camiseta Básica Masculina',
        descricao: 'Camiseta básica preta',
        preco: 49.90,
        tamanhos: ['P', 'M', 'G'],
        categoria: 'Masculino',
        imagens: ['compras/foto3.png'],
        slug: 'camiseta-basica-masculina'
      },
      {
        nome: 'Sunga Branca',
        descricao: 'Sunga branca confortável',
        preco: 39.90,
        tamanhos: ['Único'],
        categoria: 'Masculino',
        imagens: ['compras/foto4.png'],
        slug: 'sunga-branca'
      },
      {
        nome: 'Camiseta Básica Preta Feminina',
        descricao: 'Camiseta básica preta para mulher',
        preco: 49.90,
        tamanhos: ['P', 'M', 'G'],
        categoria: 'Feminino',
        imagens: ['compras/foto5.png'],
        slug: 'camiseta-basica-preta-feminina'
      },
      {
        nome: 'Vestido Verde Vintage',
        descricao: 'Vestido vintage elegante',
        preco: 129.90,
        tamanhos: ['P', 'M', 'G'],
        categoria: 'Feminino',
        imagens: ['compras/foto6.png'],
        slug: 'vestido-verde-vintage'
      },
      {
        nome: 'Macacão Florido',
        descricao: 'Macacão florido feminino',
        preco: 89.90,
        tamanhos: ['P', 'M', 'G'],
        categoria: 'Feminino',
        imagens: ['compras/Pagina inicial (1).png'],
        slug: 'macacao-florido'
      }
    ];

    await db.collection('products').insertMany(products);
    console.log('Produtos inseridos com sucesso!');
  } catch (err) {
    console.error('Erro ao inserir produtos:', err);
  } finally {
    process.exit();
  }
}

populateProducts();
