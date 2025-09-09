# Diagrama da Estrutura do Banco de Dados - Apostolado Cardeal Newman

## Diagrama de Entidade-Relacionamento (ERD)

```mermaid
erDiagram
    %% Entidades Principais
    ARTICLES {
        id bigint PK
        title string
        description text
        slug string UK
        cover_id bigint FK
        author_id bigint FK
        category_id bigint FK
        published_at timestamp
        created_at timestamp
        updated_at timestamp
        created_by_id bigint FK
        updated_by_id bigint FK
    }

    AUTHORS {
        id bigint PK
        name string
        email string
        avatar_id bigint FK
        created_at timestamp
        updated_at timestamp
        created_by_id bigint FK
        updated_by_id bigint FK
    }

    CATEGORIES {
        id bigint PK
        name string
        slug string UK
        description text
        created_at timestamp
        updated_at timestamp
        created_by_id bigint FK
        updated_by_id bigint FK
    }

    ABOUTS {
        id bigint PK
        title string
        created_at timestamp
        updated_at timestamp
        created_by_id bigint FK
        updated_by_id bigint FK
    }

    GLOBALS {
        id bigint PK
        site_name string
        site_description text
        favicon_id bigint FK
        created_at timestamp
        updated_at timestamp
        created_by_id bigint FK
        updated_by_id bigint FK
    }

    %% Tabelas de Mídia
    FILES {
        id bigint PK
        name string
        alternative_text string
        caption string
        width int
        height int
        formats json
        hash string
        ext string
        mime string
        size decimal
        url string
        preview_url string
        provider string
        provider_metadata json
        folder_path string
        created_at timestamp
        updated_at timestamp
        created_by_id bigint FK
        updated_by_id bigint FK
    }

    %% Componentes (Dynamic Zones)
    COMPONENTS_SHARED_MEDIA {
        id bigint PK
        file_id bigint FK
    }

    COMPONENTS_SHARED_QUOTES {
        id bigint PK
        title string
        body text
    }

    COMPONENTS_SHARED_RICH_TEXTS {
        id bigint PK
        body longtext
    }

    COMPONENTS_SHARED_SEOS {
        id bigint PK
        meta_title string
        meta_description text
        share_image_id bigint FK
    }

    COMPONENTS_SHARED_SLIDERS {
        id bigint PK
    }

    %% Tabelas de junção para Dynamic Zones
    ARTICLES_COMPONENTS {
        id bigint PK
        entity_id bigint FK
        component_id bigint
        component_type string
        field string
        order int
    }

    ABOUTS_COMPONENTS {
        id bigint PK
        entity_id bigint FK
        component_id bigint
        component_type string
        field string
        order int
    }

    %% Tabela de junção para Slider (múltiplas imagens)
    COMPONENTS_SHARED_SLIDERS_FILES_LINKS {
        id bigint PK
        slider_id bigint FK
        file_id bigint FK
        file_order int
    }

    %% Tabelas do Sistema Strapi
    ADMIN_USERS {
        id bigint PK
        firstname string
        lastname string
        username string
        email string UK
        password string
        reset_password_token string
        registration_token string
        is_active boolean
        blocked boolean
        prefered_language string
        created_at timestamp
        updated_at timestamp
        created_by_id bigint FK
        updated_by_id bigint FK
    }

    ADMIN_ROLES {
        id bigint PK
        name string
        code string UK
        description string
        created_at timestamp
        updated_at timestamp
        created_by_id bigint FK
        updated_by_id bigint FK
    }

    ADMIN_USERS_ROLES_LINKS {
        id bigint PK
        user_id bigint FK
        role_id bigint FK
        user_order int
        role_order int
    }

    UP_USERS {
        id bigint PK
        username string UK
        email string UK
        provider string
        password string
        reset_password_token string
        confirmation_token string
        confirmed boolean
        blocked boolean
        created_at timestamp
        updated_at timestamp
        created_by_id bigint FK
        updated_by_id bigint FK
    }

    UP_ROLES {
        id bigint PK
        name string
        description string
        type string
        created_at timestamp
        updated_at timestamp
        created_by_id bigint FK
        updated_by_id bigint FK
    }

    UP_USERS_ROLE_LINKS {
        id bigint PK
        user_id bigint FK
        role_id bigint FK
        user_order int
    }

    %% Relacionamentos
    AUTHORS ||--o{ ARTICLES : "has many"
    CATEGORIES ||--o{ ARTICLES : "has many"
    FILES ||--o| ARTICLES : "cover image"
    FILES ||--o| AUTHORS : "avatar"
    FILES ||--o| GLOBALS : "favicon"
    FILES ||--o{ COMPONENTS_SHARED_MEDIA : "media files"
    FILES ||--o| COMPONENTS_SHARED_SEOS : "share image"
    FILES ||--o{ COMPONENTS_SHARED_SLIDERS_FILES_LINKS : "slider images"

    %% Dynamic Zone Relations
    ARTICLES ||--o{ ARTICLES_COMPONENTS : "has components"
    ABOUTS ||--o{ ABOUTS_COMPONENTS : "has components"
    COMPONENTS_SHARED_MEDIA ||--o{ ARTICLES_COMPONENTS : "media component"
    COMPONENTS_SHARED_QUOTES ||--o{ ARTICLES_COMPONENTS : "quote component"
    COMPONENTS_SHARED_RICH_TEXTS ||--o{ ARTICLES_COMPONENTS : "rich text component"
    COMPONENTS_SHARED_SLIDERS ||--o{ ARTICLES_COMPONENTS : "slider component"
    COMPONENTS_SHARED_MEDIA ||--o{ ABOUTS_COMPONENTS : "media component"
    COMPONENTS_SHARED_QUOTES ||--o{ ABOUTS_COMPONENTS : "quote component"
    COMPONENTS_SHARED_RICH_TEXTS ||--o{ ABOUTS_COMPONENTS : "rich text component"
    COMPONENTS_SHARED_SLIDERS ||--o{ ABOUTS_COMPONENTS : "slider component"

    %% Global SEO Component
    GLOBALS ||--|| COMPONENTS_SHARED_SEOS : "default seo"

    %% Slider Multiple Files
    COMPONENTS_SHARED_SLIDERS ||--o{ COMPONENTS_SHARED_SLIDERS_FILES_LINKS : "has multiple files"

    %% Admin Relations
    ADMIN_USERS ||--o{ ADMIN_USERS_ROLES_LINKS : "has roles"
    ADMIN_ROLES ||--o{ ADMIN_USERS_ROLES_LINKS : "assigned to users"

    %% User Plugin Relations
    UP_USERS ||--o{ UP_USERS_ROLE_LINKS : "has role"
    UP_ROLES ||--o{ UP_USERS_ROLE_LINKS : "assigned to users"

    %% Created/Updated By Relations (Admin)
    ADMIN_USERS ||--o{ ARTICLES : "created/updated articles"
    ADMIN_USERS ||--o{ AUTHORS : "created/updated authors"
    ADMIN_USERS ||--o{ CATEGORIES : "created/updated categories"
    ADMIN_USERS ||--o{ ABOUTS : "created/updated about"
    ADMIN_USERS ||--o{ GLOBALS : "created/updated global"
    ADMIN_USERS ||--o{ FILES : "created/updated files"
```

## Resumo da Estrutura

### Entidades Principais do Conteúdo

1. **ARTICLES** (Artigos)

   - Entidade principal para posts do blog
   - Relaciona com Author (muitos para um)
   - Relaciona com Category (muitos para um)
   - Tem imagem de capa (cover)
   - Suporta draft/publish
   - Contém blocos dinâmicos (dynamic zone)

2. **AUTHORS** (Autores)

   - Informações dos autores dos artigos
   - Pode ter avatar
   - Relacionamento um-para-muitos com articles

3. **CATEGORIES** (Categorias)

   - Organização dos artigos por categoria
   - Relacionamento um-para-muitos com articles

4. **ABOUTS** (Sobre)

   - Página única sobre o site/organização
   - Contém blocos dinâmicos (dynamic zone)

5. **GLOBALS** (Configurações Globais)
   - Configurações gerais do site
   - Nome do site, descrição, favicon
   - SEO padrão

### Componentes Dinâmicos (Dynamic Zones)

Os artigos e a página "sobre" utilizam dynamic zones que permitem combinações flexíveis de:

- **Media**: Imagens, vídeos, arquivos
- **Quote**: Citações com título e corpo
- **Rich Text**: Texto formatado
- **Slider**: Galeria de imagens
- **SEO**: Metadados para otimização

### Sistema de Arquivos

- **FILES**: Gerenciamento de mídia (imagens, vídeos, documentos)
- Suporte a diferentes formatos e tamanhos
- Metadados completos (dimensões, tipo MIME, etc.)

### Sistema de Usuários

- **Administradores** (ADMIN_USERS): Usuários do painel administrativo
- **Usuários Finais** (UP_USERS): Sistema de usuários público (se habilitado)
- **Roles e Permissões**: Controle de acesso granular

### Características Técnicas

- **Auditoria**: Todas as tabelas têm created_at, updated_at, created_by, updated_by
- **Soft Delete**: Suporte a publicação/despublicação
- **Slugs**: URLs amigáveis para articles e categories
- **Multilíngua**: Preparado para internacionalização (i18n)
- **Versionamento**: Sistema de draft e publish

Este diagrama representa a estrutura completa do banco de dados do projeto Apostolado Cardeal Newman baseado no Strapi CMS.
