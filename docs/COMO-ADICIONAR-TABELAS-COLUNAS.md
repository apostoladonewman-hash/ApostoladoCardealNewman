# Como Adicionar Tabelas e Colunas no Strapi - Apostolado Cardeal Newman

## 🗂️ **1. Adicionando uma Nova Tabela (Content-Type)**

### **Método 1: Via Interface Admin (Recomendado)**

1. **Acesse o painel administrativo**:

   ```
   http://localhost:1337/admin
   ```

2. **Vá para Content-Types Builder**
3. **Clique em "Create new collection type"**
4. **Configure os campos**
5. **Salve** - o Strapi criará tudo automaticamente

### **Método 2: Via CLI**

```bash
# Gerar uma nova API completa
npx strapi generate api events

# Isso criará automaticamente:
# - src/api/events/content-types/events/schema.json
# - src/api/events/controllers/events.js
# - src/api/events/services/events.js
# - src/api/events/routes/events.js
```

### **Método 3: Criação Manual**

#### **Passo 1: Criar a estrutura de pastas**

```
src/api/events/
├── content-types/
│   └── events/
│       └── schema.json
├── controllers/
│   └── events.js
├── routes/
│   └── events.js
└── services/
    └── events.js
```

#### **Passo 2: Criar o Schema (schema.json)**

```json
{
  "kind": "collectionType",
  "collectionName": "events",
  "info": {
    "singularName": "event",
    "pluralName": "events",
    "displayName": "Event",
    "description": "Manage events for the apostolado"
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {},
  "attributes": {
    "title": {
      "type": "string",
      "required": true
    },
    "description": {
      "type": "text"
    },
    "startDate": {
      "type": "datetime",
      "required": true
    },
    "endDate": {
      "type": "datetime"
    },
    "location": {
      "type": "string"
    },
    "coverImage": {
      "type": "media",
      "multiple": false,
      "required": false,
      "allowedTypes": ["images"]
    },
    "category": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::category.category",
      "inversedBy": "events"
    },
    "organizer": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::author.author",
      "inversedBy": "organizedEvents"
    },
    "maxParticipants": {
      "type": "integer"
    },
    "price": {
      "type": "decimal"
    },
    "isActive": {
      "type": "boolean",
      "default": true
    }
  }
}
```

#### **Passo 3: Criar o Controller (controllers/events.js)**

```javascript
'use strict';

/**
 * event controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::event.event');
```

#### **Passo 4: Criar o Service (services/events.js)**

```javascript
'use strict';

/**
 * event service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::event.event');
```

#### **Passo 5: Criar as Routes (routes/events.js)**

```javascript
'use strict';

/**
 * event router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::event.event');
```

---

## 📝 **2. Adicionando uma Nova Coluna (Campo)**

### **Método 1: Via Interface Admin (Recomendado)**

1. **Acesse Content-Types Builder**
2. **Selecione o content-type existente** (ex: Article)
3. **Clique em "Add another field"**
4. **Escolha o tipo de campo**
5. **Configure as propriedades**
6. **Salve**

### **Método 2: Editando o Schema Manualmente**

#### **Exemplo: Adicionar campo "tags" ao Article**

Edite o arquivo: `src/api/article/content-types/article/schema.json`

```json
{
  "kind": "collectionType",
  "collectionName": "articles",
  "info": {
    "singularName": "article",
    "pluralName": "articles",
    "displayName": "Article",
    "description": "Create your blog content"
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {},
  "attributes": {
    "title": {
      "type": "string"
    },
    "description": {
      "type": "text",
      "maxLength": 80
    },
    "slug": {
      "type": "uid",
      "targetField": "title"
    },
    "cover": {
      "type": "media",
      "multiple": false,
      "required": false,
      "allowedTypes": ["images", "files", "videos"]
    },
    "author": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::author.author",
      "inversedBy": "articles"
    },
    "category": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::category.category",
      "inversedBy": "articles"
    },
    "blocks": {
      "type": "dynamiczone",
      "components": [
        "shared.media",
        "shared.quote",
        "shared.rich-text",
        "shared.slider"
      ]
    },
    // 🆕 NOVO CAMPO ADICIONADO
    "tags": {
      "type": "json",
      "description": "Array de tags para o artigo"
    },
    "readingTime": {
      "type": "integer",
      "description": "Tempo estimado de leitura em minutos"
    },
    "featured": {
      "type": "boolean",
      "default": false,
      "description": "Artigo em destaque"
    },
    "publishedDate": {
      "type": "date",
      "description": "Data de publicação personalizada"
    },
    "seoKeywords": {
      "type": "text",
      "description": "Palavras-chave para SEO"
    }
  }
}
```

---

## 🔄 **3. Tipos de Campos Disponíveis**

### **Campos Básicos**

- `string`: Texto curto
- `text`: Texto longo
- `richtext`: Texto formatado
- `email`: Email
- `password`: Senha
- `enumeration`: Lista de opções

### **Campos Numéricos**

- `integer`: Número inteiro
- `biginteger`: Número inteiro grande
- `float`: Número decimal
- `decimal`: Decimal de alta precisão

### **Campos de Data**

- `date`: Data
- `datetime`: Data e hora
- `time`: Apenas hora

### **Campos Especiais**

- `boolean`: Verdadeiro/Falso
- `json`: Dados JSON
- `uid`: Identificador único
- `media`: Arquivos/Imagens

### **Relacionamentos**

- `relation`: Relação com outro content-type

---

## 🚀 **4. Após Adicionar Campos/Tabelas**

### **Reiniciar o Servidor**

```bash
# Parar o servidor (Ctrl+C)
# Iniciar novamente
npm run develop
# ou
yarn develop
```

### **Verificar as Migrações**

- O Strapi criará automaticamente as migrações do banco
- Verifique no console se há erros
- As mudanças são aplicadas automaticamente no SQLite

### **Testar no Admin**

1. Acesse o painel admin
2. Vá em **Content Manager**
3. Verifique se a nova tabela/campos aparecem
4. Teste criar/editar conteúdo

---

## 🔗 **5. Exemplo: Adicionando Relacionamento**

### **Cenário**: Adicionar relacionamento entre Category e Events

#### **Passo 1: Modificar o schema de Category**

Adicione ao `src/api/category/content-types/category/schema.json`:

```json
{
  "attributes": {
    // ... campos existentes ...
    "events": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::event.event",
      "mappedBy": "category"
    }
  }
}
```

#### **Passo 2: O campo já existe no Events**

```json
{
  "category": {
    "type": "relation",
    "relation": "manyToOne",
    "target": "api::category.category",
    "inversedBy": "events"
  }
}
```

---

## ⚠️ **Dicas Importantes**

1. **Sempre faça backup** antes de modificar schemas
2. **Use a interface admin** quando possível - é mais segura
3. **Reinicie o servidor** após mudanças manuais
4. **Teste em desenvolvimento** antes de aplicar em produção
5. **Verifique as migrações** no console
6. **Mantenha consistência** nos nomes (singular/plural)

---

## 🛠️ **Comandos Úteis**

```bash
# Gerar nova API
npx strapi generate api nome

# Iniciar em modo desenvolvimento
npm run develop

# Build para produção
npm run build

# Verificar configuração
npx strapi configuration:dump

# Gerar tipos TypeScript
npm run build --ts
```

Esta documentação cobre os principais métodos para adicionar tabelas e colunas no seu projeto Strapi do Apostolado Cardeal Newman.
