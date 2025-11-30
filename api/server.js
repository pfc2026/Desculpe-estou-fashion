require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connect } = require('./mongo_connect');

const productsRouter = require('./products');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set EJS as template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

// Serve static files (HTML, CSS, JS, uploads)
app.use('/public', express.static(path.join(__dirname, '..', 'public')));
app.use(express.static(path.join(__dirname, '..')));

// API routes
app.use('/api/products', productsRouter);

// Dynamic routes
app.get('/categoria/:categoria', async (req, res) => {
  try {
    const db = await connect();
    const categoria = req.params.categoria;
    const products = await db.collection('products').find({ categoria: categoria }).toArray();
    res.render('categoria', {
      title: `${categoria} - Desculpe, Estou Fashion`,
      categoria,
      products
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar categoria');
  }
});

app.get('/produto/:id', async (req, res) => {
  try {
    const db = await connect();
    const { ObjectId } = require('mongodb');
    const product = await db.collection('products').findOne({ _id: new ObjectId(req.params.id) });
    if (!product) return res.status(404).send('Produto não encontrado');
    res.render('produto', {
      title: `${product.nome} - Desculpe, Estou Fashion`,
      product
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar produto');
  }
});

// Redirect old static pages to dynamic ones
app.get('/masculino.html', (req, res) => res.redirect('/categoria/Masculino'));
app.get('/feminino.html', (req, res) => res.redirect('/categoria/Feminino'));

// Serve static HTML pages
app.get('/index3.html', (req, res) => res.sendFile(path.join(__dirname, '..', 'index3.html')));
app.get('/index.html', (req, res) => res.sendFile(path.join(__dirname, '..', 'index.html')));
app.get('/painel.html', (req, res) => res.sendFile(path.join(__dirname, '..', 'painel.html')));
app.get('/carrinho.html', (req, res) => res.sendFile(path.join(__dirname, '..', 'carrinho.html')));
app.get('/contato.html', (req, res) => res.sendFile(path.join(__dirname, '..', 'contato.html')));

// Home page with dynamic products
app.get('/', async (req, res) => {
  try {
    const db = await connect();
    const products = await db.collection('products').find({}).limit(6).toArray();
    res.render('layout', {
      title: 'Desculpe, Estou Fashion',
      body: `
        <div class="promo-bar">
          <div class="promo-item"> <i class="fas fa-tags"></i> <span>Vendas Ecológicas</span> </div>
          <div class="promo-item"> <i class="fas fa-truck"></i> <span>Frete Grátis</span> </div>
          <div class="promo-item"> <i class="fas fa-undo-alt"></i> <span>Devolução Grátis</span> </div>
        </div>

        <div class="product-categories">
          <h2>Produtos em Destaque</h2>
          <div class="product-list">
            ${products && products.length > 0 ? products.map(product => `
              <div class="product-item">
                <a href="/produto/${product._id}">
                  <img src="${product.imagens && product.imagens[0] ? product.imagens[0] : 'compras/pagina de compras (1).png'}" alt="${product.nome}">
                  <span class="price">R$ ${Number(product.preco || 0).toFixed(2)}</span>
                  <p class="description">${product.nome} ${product.descricao ? ('- ' + product.descricao) : ''}</p>
                  <p class="gender">${product.categoria}</p>
                </a>
              </div>
            `).join('') : '<p>Nenhum produto disponível no momento.</p>'}
          </div>
        </div>

        <div class="subscription-payment">
          <div class="subscription">
            <h3>Encontre-nos</h3>
            <div style="display: flex; gap: 10px; margin-top: 10px;">
              <a href="#" style="color: #333;"><i class="fab fa-facebook-f"></i></a>
              <a href="#" style="color: #333;"><i class="fab fa-instagram"></i></a>
              <a href="#" style="color: #333;"><i class="fab fa-twitter"></i></a>
              <a href="#" style="color: #333;"><i class="fab fa-pinterest"></i></a>
              <a href="#" style="color: #333;"><i class="fab fa-tiktok"></i></a>
            </div>
            <p style="margin-top: 15px; font-size: 0.8em;">Cadastre-se para receber notícias sobre Desculpe, Estou Fashion.</p>
            <form class="subscription-form">
              <input type="tel" placeholder="DDD + Telefone">
              <button type="submit">subscribe</button>
            </form>
            <form class="subscription-form" style="margin-top: 10px;">
              <input type="email" placeholder="Endereço do seu e-mail">
              <button type="submit">Inscreva-se</button>
            </form>
          </div>
          <div class="payment-methods">
            <h3>Formas de Pagamento</h3>
            <div class="payment-icons">
              <img src="https://via.placeholder.com/50/4169E1/FFFFFF?Text=VISA" alt="Visa">
              <img src="https://via.placeholder.com/50/FF69B4/FFFFFF?Text=MASTERCARD" alt="Mastercard">
              <img src="https://via.placeholder.com/50/008000/FFFFFF?Text=PIX" alt="PIX">
              <img src="https://via.placeholder.com/50/FFA500/FFFFFF?Text=BOLETO" alt="Boleto">
            </div>
          </div>
        </div>
      `,
      products
    });
  } catch (err) {
    console.error(err);
    // Fallback to static page if DB fails
    res.sendFile(path.join(__dirname, '..', 'index3.html'));
  }
});

// Basic health check
app.get('/api/health', (req, res) => res.json({ ok: true }));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
