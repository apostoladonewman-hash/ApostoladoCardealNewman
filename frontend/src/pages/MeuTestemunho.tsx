import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import testimonialService, {
  Testimonial,
} from '../services/testimonialService';
import { Helmet } from 'react-helmet-async';
import { Save, AlertCircle, CheckCircle, XCircle, Camera } from 'lucide-react';
import { AxiosError } from 'axios';

// Interface para a estrutura esperada do erro da API
interface ApiErrorData {
  error: {
    message: string;
  };
}

export default function MeuTestemunho() {
  const navigate = useNavigate();
  const [testimonial, setTestimonial] = useState<Testimonial | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    nome_pessoa: '',
    email: '',
    denominacao_anterior: '',
    data_conversao: '',
    ano_nascimento: '',
    cidade_natural: '',
    cidade_atual: '',
    profissao: '',
    biografia: '',
    testemunho_completo: '',
  });

  useEffect(() => {
    loadTestimonial();
  }, []);

  const loadTestimonial = async () => {
    try {
      const data = await testimonialService.getMyTestimonial();
      if (data) {
        setTestimonial(data);
        setFormData({
          nome_pessoa: data.nome_pessoa || '',
          email: data.email || '',
          denominacao_anterior: data.denominacao_anterior || '',
          data_conversao: data.data_conversao?.split('T')[0] || '', // Formatar data
          ano_nascimento: data.ano_nascimento?.toString() || '',
          cidade_natural: data.cidade_natural || '',
          cidade_atual: data.cidade_atual || '',
          profissao: data.profissao || '',
          biografia: data.biografia || '',
          testemunho_completo: data.testemunho_completo || '',
        });
      }
    } catch (err) {
      console.error('Erro ao carregar testemunho:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const dataToSend = {
        ...formData,
        ano_nascimento: formData.ano_nascimento
          ? parseInt(formData.ano_nascimento)
          : undefined,
      };

      if (testimonial) {
        await testimonialService.updateTestimonial(testimonial.id!, dataToSend);
        setSuccess('Testemunho atualizado com sucesso!');
      } else {
        await testimonialService.submitTestimonial(dataToSend);
        setSuccess('Testemunho enviado para moderação com sucesso!');
      }

      setTimeout(() => {
        loadTestimonial();
      }, 1500);
    } catch (err) {
      let errorMessage = 'Erro ao salvar testemunho';
      if (err instanceof AxiosError && err.response?.data) {
        const apiError = err.response.data as ApiErrorData;
        errorMessage = apiError.error?.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !testimonial?.id) return;

    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione uma imagem');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('A imagem deve ter no máximo 5MB');
      return;
    }

    try {
      await testimonialService.uploadAvatar(testimonial.id, file);
      setSuccess('Foto atualizada com sucesso!');
      loadTestimonial();
    } catch (err) {
      setError('Erro ao fazer upload da foto');
      console.error(err);
    }
  };

  const getStatusBadge = () => {
    if (!testimonial) return null;

    const badges = {
      pending: (
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100 text-yellow-800">
          <AlertCircle className="w-4 h-4" />
          Aguardando Moderação
        </span>
      ),
      approved: (
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-800">
          <CheckCircle className="w-4 h-4" />
          Aprovado
        </span>
      ),
      rejected: (
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 text-red-800">
          <XCircle className="w-4 h-4" />
          Rejeitado
        </span>
      ),
    };

    return badges[testimonial.status];
  };

  const canEdit =
    !testimonial ||
    testimonial.status === 'pending' ||
    testimonial.status === 'rejected';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Helmet>
        <title>Meu Testemunho - Apostolado Cardeal Newman</title>
      </Helmet>

      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">
                Meu Testemunho
              </h1>
              {getStatusBadge()}
            </div>

            {testimonial?.status === 'approved' && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                🎉 Seu testemunho foi aprovado e está visível em nosso site!
              </div>
            )}

            {testimonial?.status === 'rejected' &&
              testimonial.motivo_rejeicao && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="font-semibold text-red-900 mb-2">
                    Motivo da Rejeição:
                  </p>
                  <p className="text-red-800">{testimonial.motivo_rejeicao}</p>
                  <p className="text-sm text-red-700 mt-2">
                    Você pode editar e reenviar seu testemunho.
                  </p>
                </div>
              )}

            {!testimonial && (
              <p className="text-gray-600">
                Compartilhe sua história de conversão para inspirar outros. Após
                a submissão, um moderador irá revisar seu testemunho.
              </p>
            )}
          </div>

          {/* Avatar Upload (se já submeteu) */}
          {testimonial && (
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg">
                  {testimonial.avatar?.url ? (
                    <img
                      src={`http://localhost:1337${testimonial.avatar.url}`}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 text-white text-4xl font-bold">
                      {formData.nome_pessoa.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                {canEdit && (
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 shadow-lg"
                  >
                    <Camera className="w-5 h-5" />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          )}

          {/* Mensagens */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
              {success}
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={formData.nome_pessoa}
                  onChange={(e) =>
                    setFormData({ ...formData, nome_pessoa: e.target.value })
                  }
                  disabled={!canEdit}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  disabled={!canEdit}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Denominação Anterior *
                </label>
                <input
                  type="text"
                  value={formData.denominacao_anterior}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      denominacao_anterior: e.target.value,
                    })
                  }
                  disabled={!canEdit}
                  placeholder="Ex: Batista, Presbiteriana..."
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Conversão
                </label>
                <input
                  type="date"
                  value={formData.data_conversao}
                  onChange={(e) =>
                    setFormData({ ...formData, data_conversao: e.target.value })
                  }
                  disabled={!canEdit}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ano de Nascimento
                </label>
                <input
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={formData.ano_nascimento}
                  onChange={(e) =>
                    setFormData({ ...formData, ano_nascimento: e.target.value })
                  }
                  disabled={!canEdit}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profissão
                </label>
                <input
                  type="text"
                  value={formData.profissao}
                  onChange={(e) =>
                    setFormData({ ...formData, profissao: e.target.value })
                  }
                  disabled={!canEdit}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cidade de Nascimento
                </label>
                <input
                  type="text"
                  value={formData.cidade_natural}
                  onChange={(e) =>
                    setFormData({ ...formData, cidade_natural: e.target.value })
                  }
                  disabled={!canEdit}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cidade Atual
                </label>
                <input
                  type="text"
                  value={formData.cidade_atual}
                  onChange={(e) =>
                    setFormData({ ...formData, cidade_atual: e.target.value })
                  }
                  disabled={!canEdit}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Biografia Breve
              </label>
              <textarea
                value={formData.biografia}
                onChange={(e) =>
                  setFormData({ ...formData, biografia: e.target.value })
                }
                disabled={!canEdit}
                rows={3}
                placeholder="Conte um pouco sobre você..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Testemunho Completo *
                <span className="text-sm text-gray-500 ml-2">
                  (Conte sua história de conversão do protestantismo ao
                  catolicismo)
                </span>
              </label>
              <textarea
                value={formData.testemunho_completo}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    testemunho_completo: e.target.value,
                  })
                }
                disabled={!canEdit}
                rows={12}
                required
                placeholder="Compartilhe sua jornada de fé, os desafios enfrentados, o que levou à sua conversão, e como a Igreja Católica transformou sua vida..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            {canEdit && (
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/perfil')}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center gap-2"
                >
                  Voltar ao Perfil
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {saving
                    ? 'Salvando...'
                    : testimonial
                      ? 'Atualizar Testemunho'
                      : 'Enviar para Moderação'}
                </button>
              </div>
            )}

            {!canEdit && (
              <button
                type="button"
                onClick={() => navigate('/perfil')}
                className="w-full px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Voltar ao Perfil
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
