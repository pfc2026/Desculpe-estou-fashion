const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { connect } = require('./mongo_connect');

const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const db = await connect();
    const products = await db.collection('products').find({}).toArray();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao listar produtos' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const db = await connect();
    const prod = await db.collection('products').findOne({ _id: new ObjectId(req.params.id) });
    if (!prod) return res.status(404).json({ message: 'Produto não encontrado' });
    res.json(prod);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao obter produto' });
  }
});

// POST /api/products
router.post('/', upload.single('imagem'), async (req, res) => {
  try {
    console.log('POST /api/products - req.body:', req.body);
    console.log('File:', req.file);
    const db = await connect();
    const { nome, descricao, preco, tamanhos, categoria } = req.body;
    let sizesArr = [];
    if (Array.isArray(tamanhos)) {
      sizesArr = tamanhos.map(s => s.trim()).filter(Boolean);
    } else if (tamanhos) {
      sizesArr = tamanhos.split(',').map(s => s.trim()).filter(Boolean);
    }
    const images = [];
    if (req.file) {
      images.push(`/public/uploads/${req.file.filename}`);
    }

    const doc = {
      nome: nome || '',
      descricao: descricao || '',
      preco: preco ? parseFloat(preco) : 0,
      tamanhos: sizesArr,
      categoria: categoria || '',
      imagens: images,
      createdAt: new Date()
    };

    const result = await db.collection('products').insertOne(doc);
    res.json({ success: true, id: result.insertedId, product: doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erro ao salvar produto' });
  }
});

// PUT /api/products/:id
router.put('/:id', upload.single('imagem'), async (req, res) => {
  try {
    const db = await connect();
    const { nome, descricao, preco, tamanhos, categoria } = req.body;
    let sizesArr = [];
    if (Array.isArray(tamanhos)) {
      sizesArr = tamanhos.map(s => s.trim()).filter(Boolean);
    } else if (tamanhos) {
      sizesArr = tamanhos.split(',').map(s => s.trim()).filter(Boolean);
    }

    const update = {
      $set: {
        nome: nome || '',
        descricao: descricao || '',
        preco: preco ? parseFloat(preco) : 0,
        tamanhos: sizesArr,
        categoria: categoria || '',
        updatedAt: new Date()
      }
    };

    if (req.file) {
      const imagePath = `/public/uploads/${req.file.filename}`;
      update.$push = { imagens: imagePath };
    }

    const result = await db.collection('products').updateOne({ _id: new ObjectId(req.params.id) }, update);
    res.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erro ao atualizar produto' });
  }
});

// DELETE /api/products/:id
router.delete('/:id', async (req, res) => {
  try {
    const db = await connect();
    const prod = await db.collection('products').findOne({ _id: new ObjectId(req.params.id) });
    if (!prod) return res.status(404).json({ success: false, message: 'Produto não encontrado' });

    // remove images from disk if present
    if (Array.isArray(prod.imagens)) {
      prod.imagens.forEach(imgPath => {
        const filePath = path.join(__dirname, '..', imgPath.replace('/public/', ''));
        if (fs.existsSync(filePath)) {
          try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
        }
      });
    }

    const result = await db.collection('products').deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erro ao excluir produto' });
  }
});

module.exports = router;
