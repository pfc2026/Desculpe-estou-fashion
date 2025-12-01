require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const { connect } = require('./mongo_connect');

const productsRouter = require('./products');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true in production with HTTPS
}));

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
    res.render('layout', {
      title: `${categoria} - Desculpe, Estou Fashion`,
      body: `
        <div class="product-grid-container">
          <h1>${categoria}</h1>
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
            `).join('') : '<p>Nenhum produto disponível nesta categoria no momento.</p>'}
          </div>
        </div>
      `,
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
    res.render('layout', {
      title: `${product.nome} - Desculpe, Estou Fashion`,
      body: `
        <div class="product-page-container">
          <div class="product-gallery">
            <img src="${product.imagens && product.imagens[0] ? product.imagens[0] : 'compras/pagina de compras (1).png'}" alt="${product.nome}">
          </div>

          <div class="product-details">
            <div class="title-section">
              <span class="tag-purple">Tendências</span>
              <h1>${product.nome}</h1>
              <i class="fas fa-external-link-alt"></i>
            </div>

            <div class="reviews">
              <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half-alt"></i>
            </div>

            <div class="price-section">
              <span class="current-price">R$ ${Number(product.preco || 0).toFixed(2)}</span>
            </div>

            <div class="offer-banners">
              <div class="offer">25% OFF Para pedidos R$169,00+ <i class="fas fa-chevron-right"></i></div>
              <div class="offer">R$15,00 OFF Para pedidos R$... <i class="fas fa-chevron-right"></i></div>
            </div>

            <div class="color-selector">
              <p><strong>Cor:</strong> ${product.cor || 'Padrão'}</p>
            </div>

            <div class="size-selector">
              <div class="size-header">
                <p><strong>Tamanho</strong></p>
              </div>
              <div class="size-buttons">
                ${product.tamanhos && product.tamanhos.length > 0 ? product.tamanhos.map(tamanho => `<button>${tamanho}</button>`).join('') : '<button>Único</button>'}
              </div>
            </div>

            <div class="shipping-info">
              <p><strong>Enviado por</strong></p>
              <div class="shipping-options">
                <button>Envio Nacional</button>
                <button class="active">Internacional</button>
              </div>
              <div class="import-notice">
                <i class="fas fa-lightbulb"></i>
                <span>Produto Internacional sujeito à declaração de importação e a tributos estaduais e federais.</span>
              </div>
            </div>

            <div class="actions">
              <button class="add-to-cart">
                ADICIONAR AO CARRINHO
              </button>
              <button class="wishlist"><i class="far fa-heart"></i></button>
            </div>
          </div>
        </div>
      `,
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

// Authentication routes
app.post('/api/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.redirect('/index-login.html?error=empty');
    }

    const db = await connect();
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return res.redirect('/index-login.html?error=invalid');
    }

    const isValidPassword = await bcrypt.compare(senha, user.password);
    if (!isValidPassword) {
      return res.redirect('/index-login.html?error=invalid');
    }

    req.session.user = { id: user._id, nome: user.nome, email: user.email };
    res.redirect('/index3.html'); // Redirect to recommended area
  } catch (err) {
    console.error(err);
    res.redirect('/index-login.html?error=invalid');
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
      return res.redirect('/index7.html?error=empty');
    }

    const db = await connect();
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.redirect('/index7.html?error=email_exists');
    }

    const hashedPassword = await bcrypt.hash(senha, 10);
    await db.collection('users').insertOne({
      nome,
      email,
      password: hashedPassword,
      createdAt: new Date()
    });

    res.redirect('/index-login.html?status=success');
  } catch (err) {
    console.error(err);
    res.redirect('/index7.html?error=db_error');
  }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
    res.redirect('/');
  });
});

// Contact form submission
app.post('/api/contact', (req, res) => {
  const { nome, email, mensagem } = req.body;
  console.log('Nova mensagem de contato:', { nome, email, mensagem });
  // In a real app, you'd save this to database or send email
  res.json({ success: true, message: 'Mensagem enviada com sucesso!' });
});

// Basic health check
app.get('/api/health', (req, res) => res.json({ ok: true }));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
