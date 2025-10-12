import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import articleSubmissionService from '@/services/articleSubmissionService';
import categoriesService from '@/services/categories';
import { Send, Upload, Loader2 } from 'lucide-react';
import type { Category } from '@/types/strapi';

export default function SubmeterArtigo() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: '',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await categoriesService.getAll();
      setCategories(response.data || []);
    } catch (err) {
      console.error('Erro ao carregar categorias:', err);
      setError('Erro ao carregar categorias');
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione uma imagem válida');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('A imagem deve ter no máximo 5MB');
      return;
    }

    setCoverFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const dataToSubmit = {
        title: formData.title,
        description: formData.description,
        content: formData.content,
        category: formData.category ? parseInt(formData.category) : undefined,
        status: 'pending' as const,
      };

      const response = await articleSubmissionService.submitArticle(dataToSubmit);

      // Upload cover image if provided
      if (coverFile && response.id) {
        await articleSubmissionService.uploadCover(response.id, coverFile);
      }

      setSuccess('Artigo enviado para moderação com sucesso!');

      // Reset form
      setFormData({
        title: '',
        description: '',
        content: '',
        category: '',
      });
      setCoverFile(null);
      setCoverPreview('');

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/meus-artigos');
      }, 2000);
    } catch (err: any) {
      setError(
        err.response?.data?.error?.message || 'Erro ao enviar artigo. Tente novamente.'
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-20">
      <Helmet>
        <title>Submeter Artigo - Apostolado Cardeal Newman</title>
      </Helmet>

      <div className="container max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Submeter Artigo
          </h1>
          <div className="h-1 w-20 bg-gradient-to-r from-[hsl(var(--bronze))] via-[hsl(var(--primary))] to-[hsl(var(--gold-warm))] rounded-full mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">
            Compartilhe seu conhecimento e reflexões sobre a fé católica
          </p>
        </div>

        <Card className="p-8 shadow-lg">
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg text-green-800">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Título do Artigo *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Digite um título atraente para seu artigo"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Descrição Breve
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Uma breve descrição do artigo (opcional)"
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.description.length}/200 caracteres
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Categoria
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={loadingCategories}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
              >
                <option value="">Selecione uma categoria (opcional)</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Imagem de Capa
              </label>
              <div className="space-y-4">
                {coverPreview && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border">
                    <img
                      src={coverPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setCoverFile(null);
                        setCoverPreview('');
                      }}
                      className="absolute top-2 right-2 bg-destructive text-white rounded-full p-2 hover:bg-destructive/90"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                )}
                <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-border rounded-lg hover:border-primary cursor-pointer transition-colors">
                  <Upload className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {coverFile ? 'Alterar imagem' : 'Escolher imagem de capa (opcional)'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverChange}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-muted-foreground">
                  Máximo 5MB. Formatos: JPG, PNG, WebP
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Conteúdo do Artigo *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={16}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Escreva seu artigo aqui. Seja claro, profundo e fiel ao ensinamento da Igreja Católica..."
              />
              <p className="text-xs text-muted-foreground mt-1">
                Mínimo recomendado: 500 palavras
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">
                Informação Importante
              </h3>
              <p className="text-sm text-blue-800">
                Seu artigo será enviado para moderação e será revisado por nossa equipe
                antes de ser publicado. Você pode acompanhar o status em "Meus Artigos".
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/perfil')}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--gold-warm))] hover:from-[hsl(var(--bronze))] hover:to-[hsl(var(--primary))] text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Enviar para Moderação
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
